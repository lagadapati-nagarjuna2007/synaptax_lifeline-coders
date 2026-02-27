const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to SQLite database (will create a fresh 'database.sqlite')
const db = new sqlite3.Database('./database.sqlite');

// Initialize the updated table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS profile (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            email           TEXT UNIQUE NOT NULL,
            full_name       TEXT NOT NULL,
            age             REAL NOT NULL,
            gender          TEXT NOT NULL,
            height_cm       REAL NOT NULL,
            weight_kg       REAL NOT NULL,
            bmi             REAL,
            smoking         TEXT DEFAULT 'never',
            alcohol         TEXT DEFAULT 'never',
            exercise        TEXT DEFAULT 'none',
            medical_notes   TEXT,
            created_at      TEXT DEFAULT (datetime('now')),
            updated_at      TEXT DEFAULT (datetime('now'))
        );
    `);
});

// POST endpoint to handle form submissions
app.post('/add-profile', (req, res) => {
    const data = req.body;

    // Auto-compute BMI
    const heightMeters = data.height_cm / 100;
    const computedBmi = (data.weight_kg / (heightMeters * heightMeters)).toFixed(1);

    // SQL Query: Insert new, or Update if the email already exists
    const sql = `
        INSERT INTO profile (
            email, full_name, age, gender, height_cm, weight_kg, 
            bmi, smoking, alcohol, exercise, medical_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET 
            full_name=excluded.full_name,
            age=excluded.age,
            gender=excluded.gender,
            height_cm=excluded.height_cm,
            weight_kg=excluded.weight_kg,
            bmi=excluded.bmi,
            smoking=excluded.smoking,
            alcohol=excluded.alcohol,
            exercise=excluded.exercise,
            medical_notes=excluded.medical_notes,
            updated_at=datetime('now')
    `;

    const params = [
        data.email, data.full_name, data.age, data.gender, 
        data.height_cm, data.weight_kg, computedBmi, 
        data.smoking, data.alcohol, data.exercise, data.medical_notes
    ];

    db.run(sql, params, function(err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Failed to save profile." });
        }
        // 'this.lastID' contains the auto-generated ID from SQLite
        console.log(`[SUCCESS] Saved profile for ${data.email} (Database ID: ${this.lastID})`);
        res.status(200).json({ message: "Profile Saved!", db_id: this.lastID });
    });
});
// NEW: GET endpoint to fetch a user's profile for the dashboard
// GET endpoint to fetch a user's profile for the dashboard
app.get('/get-profile/:email', (req, res) => {
    const email = req.params.email;
    const sql = `SELECT * FROM profile WHERE email = ?`;
    
    db.get(sql, [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!row) {
            return res.status(404).json({ error: "Profile not found" });
        }
        // Sends the entire database row (including full_name) back to the dashboard
        res.json(row); 
    });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
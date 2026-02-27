// Initialize Icons
lucide.createIcons();
// --- 1. Interactive Gender Cards ---
const genderCards = document.querySelectorAll('.select-card');
let selectedGender = null;

genderCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove active class from all
        genderCards.forEach(c => c.classList.remove('active'));
        // Add active class to clicked
        card.classList.add('active');
        selectedGender = card.getAttribute('data-value');
    });
});
// --- 2. Real-time Slider Updates ---
const heightSlider = document.getElementById('heightSlider');
const heightValue = document.getElementById('heightValue');
const weightSlider = document.getElementById('weightSlider');
const weightValue = document.getElementById('weightValue');

heightSlider.addEventListener('input', (e) => {
    heightValue.textContent = `${e.target.value} cm`;
});

weightSlider.addEventListener('input', (e) => {
    weightValue.textContent = `${e.target.value} kg`;
});

// --- 3. Form Submission & Database Integration ---
const form = document.getElementById('interactiveForm');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsOverlay = document.getElementById('resultsOverlay');
const finalBmi = document.getElementById('finalBmi');
const aiSuggestion = document.getElementById('aiSuggestion');
const resetBtn = document.getElementById('resetBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Ensure gender is selected
    if (!selectedGender) {
        alert("Please select your Biological Sex.");
        return;
    }

    // Get the logged-in user's email to link the data
    // Get the logged-in user's email to link the data
    const currentUserEmail = localStorage.getItem('currentLoggedInUser') || "guest@email.com";

    // Simulate Processing State
    const originalText = analyzeBtn.innerHTML;
    analyzeBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> Computing...';
    lucide.createIcons();
    
    // Build Payload - changed user_id to email!
    const data = {
        email: currentUserEmail, 
        full_name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        gender: selectedGender.toLowerCase(),
        height_cm: heightSlider.value,
        weight_kg: weightSlider.value,
        smoking: document.getElementById("smoking").checked ? "current" : "never",
        alcohol: document.getElementById("alcohol").checked ? "social" : "never",
        exercise: document.getElementById("exercise").checked ? "moderate" : "none",
        medical_notes: document.getElementById("medicalHistory").value || "None"
    };
    try {
        // Send data to local backend
        const response = await fetch("http://localhost:3000/add-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Calculate BMI for the UI
            const w = parseFloat(data.weight_kg);
            const h = parseFloat(data.height_cm) / 100;
            const bmi = (w / (h * h)).toFixed(1);
            
            finalBmi.textContent = bmi;
            aiSuggestion.textContent = "Your profile vitals have been saved to the secure database successfully.";
            
            // Mark the profile as complete for THIS specific user
            localStorage.setItem('profileComplete_' + currentUserEmail, 'true');
            
            // Show overlay
            resultsOverlay.classList.remove('hidden');
        } else {
            alert("Error: Could not save profile. Check server console.");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Network Error: Make sure your Node.js server (server.js) is running on port 3000.");
    } finally {
        // Revert button text
        analyzeBtn.innerHTML = originalText;
        lucide.createIcons();
    }
});

// Reset Form
resetBtn.addEventListener('click', () => {
    resultsOverlay.classList.add('hidden');
    form.reset();
    
    // Reset UI selections manually
    genderCards.forEach(c => c.classList.remove('active'));
    selectedGender = null;
    heightValue.textContent = `170 cm`;
    weightValue.textContent = `70 kg`;
});
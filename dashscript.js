document.addEventListener("DOMContentLoaded", async () => {
    
    // 1. Get the email of the person who just logged in
    const currentUserEmail = localStorage.getItem('currentLoggedInUser');
    
    if (!currentUserEmail) {
        window.location.href = './index.html';
        return;
    }

    try {
        // 2. Ask the backend for this email's database record
        const response = await fetch(`http://localhost:3000/get-profile/${currentUserEmail}`);
        
        if (response.ok) {
            // 3. Convert the database row into a JavaScript object
            const userData = await response.json();
            
            // 4. Inject the 'full_name' from the database into the HTML!
            document.getElementById('userNameDisplay').textContent = userData.full_name;
        } else {
            document.getElementById('userNameDisplay').textContent = "Guest User";
        }
    } catch (error) {
        console.error("Could not connect to backend:", error);
        document.getElementById('userNameDisplay').textContent = "Offline Mode";
    }

    // ... (Chart.js code continues below) ...
});

    // 2. Initialize Chart.js Graphs (Matching the Image)

    // --- A. Daily Revenue Bar Chart ---
// --- A. Overall Health Score Statistics Bar Chart ---
    const ctxRev = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctxRev, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'July','aug','sept','oct','nov','dec'],
            datasets: [
                { 
                    label: 'overall health score', 
                    data: [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0], // Changed all to 0
                    backgroundColor: '#0ea5e9', 
                    borderRadius: 4 
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { 
                y: { 
                    beginAtZero: true, 
                    suggestedMax: 100, // Forces the graph to show a scale up to 100 even if values are 0
                    grid: { borderDash: [5, 5] } 
                }, 
                x: { grid: { display: false } } 
            },
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
        }
    });
    // --- B. Appointments Overview Pie Chart ---
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Male', 'Female', 'Child', 'Germany'],
            datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: ['#3b82f6', '#ec4899', '#ef4444', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'right' } } }
    });

    // --- C. Balance Sparklines (Small Line Charts) ---
    const sparkOptions = {
        responsive: false, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        elements: { point: { radius: 0 }, line: { tension: 0.4, borderWidth: 2 } }
    };

    const ctxInc = document.getElementById('incomeLine').getContext('2d');
    new Chart(ctxInc, {
        type: 'line',
        data: { labels: ['1','2','3','4','5'], datasets: [{ data: [10, 30, 15, 40, 25], borderColor: '#0ea5e9', fill: true, backgroundColor: 'rgba(14, 165, 233, 0.1)' }] },
        options: sparkOptions
    });

    const ctxOut = document.getElementById('outcomeLine').getContext('2d');
    new Chart(ctxOut, {
        type: 'line',
        data: { labels: ['1','2','3','4','5'], datasets: [{ data: [30, 10, 35, 15, 20], borderColor: '#ef4444', fill: true, backgroundColor: 'rgba(239, 68, 68, 0.1)' }] },
        options: sparkOptions
    });

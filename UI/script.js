// --- Navigation Logic ---
function navigateTo(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        if(page.id !== 'login-page') page.classList.add('hidden');
    });
    // Show target page
    document.getElementById(pageId).classList.remove('hidden');
    // Hide sidebar if open
    document.getElementById('sidebar').classList.add('hidden');
}

// --- Login Logic ---
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    navigateTo('home-page');
});

// --- Sidebar Logic ---
document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('hidden');
});
document.getElementById('close-sidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('hidden');
});

// --- Crops Generation (13 Crops) ---
const crops = [
    "Apple", "Banana", "Cassava", "Citrus", "Corn", 
    "Cotton", "Grape", "Potato", "Rice", "Soybean", 
    "Sugarcane", "Tomato", "Wheat"
];

const cropsGrid = document.getElementById('crops-grid');
crops.forEach(crop => {
    const div = document.createElement('div');
    div.className = 'crop-tile';
    div.innerText = crop;
    div.onclick = () => selectCrop(crop);
    cropsGrid.appendChild(div);
});

let currentCrop = "";

function selectCrop(crop) {
    currentCrop = crop;
    document.getElementById('selected-crop-name').innerText = crop;
    // Reset upload area
    document.getElementById('leaf-image').value = "";
    document.getElementById('preview-area').classList.add('hidden');
    navigateTo('upload-page');
}

// --- Image Upload & Preview ---
let currentImageSrc = "";
document.getElementById('leaf-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageSrc = event.target.result;
            document.getElementById('image-preview').src = currentImageSrc;
            document.getElementById('preview-area').classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
});

// --- Submit & Analyze (Connecting to your Backend LLM) ---
document.getElementById('submit-image-btn').addEventListener('click', () => {
    if(!currentImageSrc) {
        alert("Please upload an image first.");
        return;
    }
    
    // UI Update to show processing
    document.getElementById('submit-image-btn').innerText = "Analyzing via LLM...";
    
    /* ===============================================================
      BACKEND INTEGRATION POINT:
      Here is where you make the API call to your Python Backend.
      Example using fetch:
      
      const formData = new FormData();
      formData.append("image", document.getElementById('leaf-image').files[0]);
      formData.append("crop", currentCrop);
      
      fetch('http://127.0.0.1:5000/predict', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            // Update UI with data.disease, data.severity, data.description
        });
      ===============================================================
    */

    // Mocking the backend delay for demonstration
    setTimeout(() => {
        document.getElementById('result-image').src = currentImageSrc;
        document.getElementById('res-disease').innerText = currentCrop + " Blight / Spot (Simulated)";
        document.getElementById('res-severity').innerText = Math.floor(Math.random() * 40 + 50) + "%";
        document.getElementById('res-desc').innerText = "This is an output from Lightweight-LeafNet. Pathogens detected require prompt application of appropriate crop-specific fungicides.";
        
        // Reset button and navigate
        document.getElementById('submit-image-btn').innerText = "Submit for Analysis";
        navigateTo('result-page');
    }, 1500);
});

// --- Statistics Interaction ---
function updateStats(region) {
    const stateEl = document.getElementById('stat-state');
    if(region === 'North') stateEl.innerText = "Punjab: 90% healthy. Haryana: Minor blight reported.";
    if(region === 'South') stateEl.innerText = "Andhra Pradesh: Stable. Tamil Nadu: High moisture risk.";
    if(region === 'All') stateEl.innerText = "Country-wide averages holding stable compared to last quarter.";
}

// --- Contact Form ---
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Thank you, we will contact you shortly.");
    this.reset();
});
// --- Navigation Logic ---
function navigateTo(pageId) {
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        if(page.id !== 'login-page') page.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
    document.getElementById('sidebar').classList.add('hidden');
    window.scrollTo(0, 0);
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

// --- Crops Generation (Extracted from your Dataset Image) ---
// --- Crops Generation (Extracted from your Dataset Image) ---
const cropData = [
    { name: "Apple", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=300&q=80" },
    { name: "Blueberry", img: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=300&q=80" },
    { name: "Cherry", img: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=300&q=80" },
    { name: "Corn", img: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=300&q=80" },
    { name: "Grape", img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=300&q=80" },
    { name: "Orange", img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=300&q=80" },
    { name: "Peach", img: "https://images.unsplash.com/photo-1596733430284-f7437060373e?auto=format&fit=crop&w=300&q=80" },
    { name: "Pepper bell", img: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=300&q=80" },
    { name: "Potato", img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80" },
    { name: "Raspberry", img: "https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?auto=format&fit=crop&w=300&q=80" },
    { name: "Soybean", img: "https://images.unsplash.com/photo-1599889862557-61c0da186b40?auto=format&fit=crop&w=300&q=80" },
    { name: "Squash", img: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=300&q=80" },
    { name: "Strawberry", img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300&q=80" },
    { name: "Tomato", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80" }
];

const cropsGrid = document.getElementById('crops-grid');
cropData.forEach(crop => {
    const div = document.createElement('div');
    div.className = 'crop-tile';
    div.innerHTML = `
        <img src="${crop.img}" alt="${crop.name}">
        <div class="crop-name">${crop.name}</div>
    `;
    div.onclick = () => selectCrop(crop.name);
    cropsGrid.appendChild(div);
});

let currentCrop = "";
function selectCrop(cropName) {
    currentCrop = cropName;
    document.getElementById('selected-crop-name').innerText = cropName;
    document.getElementById('leaf-image').value = "";
    document.getElementById('preview-area').classList.add('hidden');
    navigateTo('upload-page');
}

// --- Image Upload & Analysis ---
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

document.getElementById('submit-image-btn').addEventListener('click', () => {
    if(!currentImageSrc) { alert("Please upload an image first."); return; }
    
    document.getElementById('submit-image-btn').innerText = "Analyzing LeafNet & SeverityNet...";
    
    // Mock backend response
    setTimeout(() => {
        document.getElementById('result-image').src = currentImageSrc;
        document.getElementById('res-disease').innerText = currentCrop + " - Disease Detected";
        document.getElementById('res-severity').innerText = Math.floor(Math.random() * 40 + 50) + "%";
        document.getElementById('submit-image-btn').innerText = "Submit for Analysis";
        navigateTo('result-page');
    }, 1500);
});

// [KEEP ALL YOUR PREVIOUS LOGIN, NAVIGATION, AND CROP UPLOAD LOGIC HERE]

// --- MAP STATISTICS LOGIC (Google GeoCharts) ---

// Load the Google Chart library
google.charts.load('current', {
    'packages':['geochart'],
    // Note: To use the map, Google needs the API loaded
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
    // We create a dummy data table just to color the map slightly
    var data = google.visualization.arrayToDataTable([
    ['State', 'Crop Monitor Status'],
    ['IN-AP', 1], ['IN-MH', 2], ['IN-UP', 3], ['IN-KA', 4],
    ['IN-TN', 5], ['IN-GJ', 6], ['IN-RJ', 7], ['IN-MP', 8],
    ['IN-PB', 9], ['IN-HR', 10], ['IN-WB', 11], ['IN-BR', 12],
    ['IN-TG', 13], // Added Telangana
    ['IN-GA', 14]  // Added Goa
]);

    var options = {
        region: 'IN', // 'IN' is the ISO code for India
        domain: 'IN',
        displayMode: 'regions',
        resolution: 'provinces', // Shows state boundaries
        colorAxis: {colors: ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5']},
        backgroundColor: 'transparent',
        defaultColor: '#f4f7f6',
        tooltip: {trigger: 'none'} // We handle UI updates below instead of tooltips
    };

    var chart = new google.visualization.GeoChart(document.getElementById('india-map'));
    
    // Event listener for when a state is clicked
    google.visualization.events.addListener(chart, 'regionClick', function(eventData) {
        // eventData.region returns ISO-3166-2 codes like 'IN-MH'
        updateStateStats(eventData.region);
    });

    chart.draw(data, options);
}

// Dictionary to map ISO codes to State names and mock data
// Dictionary to map ISO codes to State names and mock data
const stateData = {
    // Southern States
    'IN-AP': { name: "Andhra Pradesh", info: "High moisture detected. Rice paddies stable.", rec: "Monitor for Brown Spot in rice." },
    'IN-TG': { name: "Telangana", info: "Cotton and Maize growth stable.", rec: "Monitor irrigation levels closely during dry spells." },
    'IN-KA': { name: "Karnataka", info: "Tomato crops stable.", rec: "Ensure adequate drainage for Tomato fields." },
    'IN-TN': { name: "Tamil Nadu", info: "Banana crops showing good health.", rec: "Monitor humidity levels." },
    'IN-KL': { name: "Kerala", info: "Heavy rainfall expected.", rec: "Protect vulnerable crops from waterlogging." },

    // Northern States & UTs
    'IN-JK': { name: "Jammu and Kashmir", info: "Apple orchards are vulnerable to fungal infections right now.", rec: "Preventative spray for Apple Scab highly recommended." },
    'IN-UT': { name: "Uttarakhand", info: "Wheat showing healthy progress.", rec: "Standard pest control measures apply." },
    'IN-PB': { name: "Punjab", info: "Excellent wheat health. High yield expected.", rec: "Standard fungicide schedule applies." },
    'IN-UP': { name: "Uttar Pradesh", info: "Sugarcane and Potato production peaking.", rec: "Watch for early signs of Potato Late Blight." },

    // Western & Central States
    'IN-MH': { name: "Maharashtra", info: "Cotton yields looking positive. Grapes are maturing.", rec: "Watch for early signs of Grape Black Rot." },
    'IN-GJ': { name: "Gujarat", info: "Cotton fields experiencing dry spells.", rec: "Increase irrigation protocols." },
    'IN-RJ': { name: "Rajasthan", info: "Arid conditions holding steady.", rec: "Use drought-resistant crop strategies." },
    'IN-MP': { name: "Madhya Pradesh", info: "Soybean crops are in optimal condition.", rec: "Ideal conditions for upcoming harvest." },

    // Eastern States
    'IN-WB': { name: "West Bengal", info: "Rice paddies are thriving in current humidity.", rec: "Maintain standard farming protocols." },
    'IN-BR': { name: "Bihar", info: "Corn production is stable.", rec: "Monitor for Corn Common Rust." }
};

function updateStateStats(stateCode) {
    const stateEl = document.getElementById('stat-state');
    const farmerEl = document.getElementById('stat-farmer');

    // Check if we have data for the clicked state, otherwise show a generic message
    if(stateData[stateCode]) {
        stateEl.innerHTML = `<strong>State: ${stateData[stateCode].name}</strong><br>${stateData[stateCode].info}`;
        farmerEl.innerHTML = `<strong>Recommendation:</strong> ${stateData[stateCode].rec}`;
    } else {
        // Fallback for states not explicitly hardcoded in the dictionary above
        let cleanStateName = stateCode.replace('IN-', '');
        stateEl.innerHTML = `<strong>State Code: ${cleanStateName}</strong><br>General health stable.`;
        farmerEl.innerHTML = `<strong>Recommendation:</strong> Maintain standard farming protocols for this region.`;
    }
}

// --- Integrated Support Sidebar Logic ---
const supportSidebar = document.getElementById('support-sidebar');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const llmSelector = document.getElementById('llm-selector');

// Open / Close Sidebar
document.getElementById('open-support-btn').addEventListener('click', () => {
    supportSidebar.classList.add('open');
});
document.getElementById('close-support-btn').addEventListener('click', () => {
    supportSidebar.classList.remove('open');
});

// Tab Switching (Chat vs Call)
document.getElementById('tab-chat').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('tab-call').classList.remove('active');
    document.getElementById('chat-view').classList.remove('hidden');
    document.getElementById('call-view').classList.add('hidden');
});

document.getElementById('tab-call').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('tab-chat').classList.remove('active');
    document.getElementById('call-view').classList.remove('hidden');
    document.getElementById('chat-view').classList.add('hidden');
});

// Log when user switches LLM Engine
llmSelector.addEventListener('change', (e) => {
    const engineName = e.target.options[e.target.selectedIndex].text;
    appendMessage('system', `Switched reasoning engine to: ${engineName}`);
});

// Send Message Logic (Connected to Python Backend)
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Show User Message
    appendMessage('user', text);
    chatInput.value = '';

    // 2. Get the selected LLM engine from the dropdown
    const currentLLM = llmSelector.value;

    // 3. Show a "typing..." indicator (optional but good for UX)
    const typingIndicatorId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = typingIndicatorId;
    typingDiv.classList.add('message', 'bot-message');
    typingDiv.innerHTML = "<em>Thinking...</em>";
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        // 4. Send the data to your Python Flask server
        const response = await fetch('http://127.0.0.1:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: text,
                model: currentLLM
            })
        });

        const data = await response.json();

        // 5. Remove the "typing..." indicator
        document.getElementById(typingIndicatorId).remove();

        // 6. Display the actual AI response or an error
        if (response.ok) {
            appendMessage('bot', data.reply);
        } else {
            appendMessage('system', 'Error: ' + (data.error || 'Server connection failed.'));
        }

    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById(typingIndicatorId).remove();
        appendMessage('system', 'Network error. Is the Python server running?');
    }
}

function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.classList.add('message');
    if (sender === 'user') div.classList.add('user-message');
    else if (sender === 'system') div.classList.add('system-message');
    else div.classList.add('bot-message');
    
    div.innerHTML = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});
document.getElementById('send-chat-btn').addEventListener('click', sendMessage);

// --- Contact Form ---
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Thank you, we will contact you shortly.");
    this.reset();
});
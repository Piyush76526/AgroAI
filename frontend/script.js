
// 🔥 GRAPH COUNTERS
let healthyCount = 0;
let pestCount = 0;
let diseaseCount = 0;
let chart = null;

const USE_BACKEND = false;

async function analyze() {
  const fileInput = document.getElementById("imageInput");
  const resultText = document.getElementById("resultText");
  const preview = document.getElementById("preview");
  const resultSection = document.querySelector(".result-section");

  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload an image");
    return;
  }

  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";

  resultSection.scrollIntoView({ behavior: "smooth" });

  resultText.innerText = "🔍 Analyzing your crop...";

  // ===== BACKEND MODE =====
  if (USE_BACKEND) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      resultText.innerHTML = `
        🌿 <b>Disease:</b> ${data.disease} <br><br>
        💊 <b>Solution:</b> ${data.solution}
      `;

      updateCounts(data.disease);

    } catch (error) {
      resultText.innerText = "❌ Error connecting to AI server";
    }

    return;
  }

  // ===== SMART DEMO AI LOGIC 🔥 =====
  setTimeout(() => {

    let result;
    const confidence = Math.random(); // fake AI confidence

    if (confidence < 0.4) {
      result = {
        text: "🌱 Crop looks healthy. Maintain proper care.",
        type: "Healthy"
      };
    } 
    else if (confidence < 0.7) {
      result = {
        text: "🐛 Mild pest infection detected. Use neem oil spray.",
        type: "Pest"
      };
    } 
    else {
      result = {
        text: "🦠 Disease detected. Apply fungicide immediately.",
        type: "Disease"
      };
    }

    resultText.innerText = result.text;

    // 🔥 Update graph
    updateCounts(result.type);

  }, 1200);
}


// 🔥 COUNT UPDATE
function updateCounts(type) {
  if (type.toLowerCase().includes("healthy")) healthyCount++;
  else if (type.toLowerCase().includes("pest")) pestCount++;
  else diseaseCount++;

  updateChart();
}


// 🔥 CHART FUNCTION
function updateChart() {
  const ctx = document.getElementById("resultChart");

  if (!ctx) return;

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Healthy", "Pest", "Disease"],
      datasets: [{
        label: "Crop Analysis",
        data: [healthyCount, pestCount, diseaseCount]
      }]
    },
    options: {
      responsive: true
    }
  });
}


// ===== TRANSLATION =====
async function translateText(text, targetLang) {
  try {
    const res = await fetch(
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) +
      "&langpair=en|" + targetLang
    );

    const data = await res.json();
    return data.responseData.translatedText;

  } catch {
    return text;
  }
}


// ===== SPEAK =====
async function speakResult() {
  const text = document.getElementById("resultText").innerText;
  const langSelect = document.getElementById("lang");

  if (!text) return;

  let langCode = "en-IN";
  let translatedText = text;

  const selected = langSelect.value;

  if (selected === "Hindi") {
    langCode = "hi-IN";
    translatedText = await translateText(text, "hi");
  } 
  else if (selected === "Marathi") {
    langCode = "mr-IN";
    translatedText = await translateText(text, "mr");
  }

  const speech = new SpeechSynthesisUtterance(translatedText);
  speech.lang = langCode;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}


// ===== CHATBOT =====
function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBody = document.getElementById("chatBody");

  const userText = input.value.trim();
  if (!userText) return;

  chatBody.innerHTML += `<p><b>You:</b> ${userText}</p>`;

  setTimeout(() => {
    let reply = "🌱 I can help with farming advice!";

    if (userText.toLowerCase().includes("disease")) {
      reply = "🦠 Use neem oil or pesticide.";
    } 
    else if (userText.toLowerCase().includes("water")) {
      reply = "💧 Water early morning or evening.";
    } 
    else if (userText.toLowerCase().includes("fertilizer")) {
      reply = "🌾 Use organic fertilizer.";
    }

    chatBody.innerHTML += `<p><b>Bot:</b> ${reply}</p>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 500);

  input.value = "";
}


// ===== NAV SCROLL =====
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");

    if (targetId.startsWith("#")) {
      e.preventDefault();

      const section = document.querySelector(targetId);

      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});


// ===== GET STARTED =====
const getStartedBtn = document.querySelector(".contact-btn");
const fileInput = document.getElementById("imageInput");

if (getStartedBtn && fileInput) {
  getStartedBtn.addEventListener("click", () => {
    fileInput.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}


// ===== CHAT TOGGLE =====
const chatbotBtn = document.getElementById("chatbotBtn");
const chatbox = document.getElementById("chatbox");

if (chatbotBtn && chatbox) {
  chatbotBtn.addEventListener("click", () => {
    chatbox.style.display =
      chatbox.style.display === "block" ? "none" : "block";
  });
}




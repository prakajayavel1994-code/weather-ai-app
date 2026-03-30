
// 🌍 WEATHER VARIABLES
let currentTemp = null;
let currentDesc = "";

// 🌤 WEATHER FUNCTION
async function getWeather(city) {

    const url = `https://wttr.in/${city}?format=j1`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const temp = parseInt(data.current_condition[0].temp_C);
        const desc = data.current_condition[0].weatherDesc[0].value.toLowerCase();
        const humidity = data.current_condition[0].humidity;
        const wind = data.current_condition[0].windspeedKmph;

        currentTemp = temp;
        currentDesc = desc;

        // 🌈 ICON
        let icon = "☁";
        if (desc.includes("rain")) icon = "🌧";
        else if (desc.includes("sunny") || desc.includes("clear")) icon = "☀";

        // 💡 ADVICE
        let suggestion = "";
        if (temp > 35) suggestion = "🔥 Very hot! Drink water.";
        else if (temp < 20) suggestion = "❄ Cold! Wear warm clothes.";
        else suggestion = "😊 Pleasant weather!";

        // 🎨 WEATHER-BASED BACKGROUND COLOR
        if (desc.includes("rain")) {
            document.body.style.backgroundColor = "rgba(95,108,123,0.6)";
        } 
        else if (desc.includes("sunny") || desc.includes("clear")) {
            document.body.style.backgroundColor = "rgba(247,183,51,0.6)";
        } 
        else if (desc.includes("cloud")) {
            document.body.style.backgroundColor = "rgba(189,195,199,0.6)";
        } 
        else {
            document.body.style.backgroundColor = "rgba(116,235,213,0.6)";
        }

        document.getElementById("result").innerHTML = `
            <h2>${icon} ${city}</h2>
            <p>🌡 Temperature: ${temp} °C</p>
            <p>☁ Weather: ${desc}</p>
            <p>💧 Humidity: ${humidity}%</p>
            <p>🌬 Wind: ${wind} km/h</p>
            <p>💡 Advice: ${suggestion}</p>
        `;

    } catch (err) {
        document.getElementById("result").innerHTML = "❌ Error fetching data";
    }
}

// 🔍 SEARCH
function searchWeather() {
    const city = document.getElementById("city").value.trim();
    if (!city) {
        alert("Enter city name");
        return;
    }
    getWeather(city);
}

// 🎤 VOICE INPUT
function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-US";

    recognition.onresult = function(event) {
        const city = event.results[0][0].transcript;
        document.getElementById("city").value = city;
        getWeather(city);
    };

    recognition.start();
}

// 📍 LOCATION
function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const url = `https://wttr.in/${lat},${lon}?format=j1`;
        const res = await fetch(url);
        const data = await res.json();

        const city = data.nearest_area[0].areaName[0].value;
        getWeather(city);
    });
}

// 🤖 AI ASSISTANT
function sendMessage() {

    const inputBox = document.getElementById("userInput");
    const chat = document.getElementById("chat");

    const text = inputBox.value.trim().toLowerCase();
    if (!text) return;

    chat.innerHTML += `<p><b>You:</b> ${text}</p>`;

    let reply = "";

    if (!currentTemp) {
        reply = "⚠ Please search a city first.";
    } 
    else if (text.includes("temperature")) {
        reply = `🌡 Temperature is ${currentTemp} °C`;
    } 
    else if (text.includes("hot")) {
        reply = currentTemp > 30 ? "🔥 Yes it's hot!" : "😊 Not very hot.";
    } 
    else if (text.includes("cold")) {
        reply = currentTemp < 20 ? "❄ Yes it's cold!" : "😊 Not cold.";
    } 
    else if (text.includes("rain")) {
        reply = currentDesc.includes("rain") ? "🌧 Yes it's raining!" : "☀ No rain.";
    } 
    else if (text.includes("weather")) {
        reply = `🌤 Weather is ${currentDesc}`;
    } 
    else {
        reply = "🤖 Ask about temperature, rain, or weather.";
    }

    chat.innerHTML += `<p><b>AI:</b> ${reply}</p>`;
    chat.scrollTop = chat.scrollHeight;

    inputBox.value = "";
}

// 🔄 AUTO COLOR CHANGE EVERY 4 SECONDS
let colors = [
    "rgba(116,235,213,0.6)",
    "rgba(247,183,51,0.6)",
    "rgba(95,108,123,0.6)",
    "rgba(189,195,199,0.6)",
    "rgba(255,154,158,0.6)"
];

let index = 0;

setInterval(() => {
    document.body.style.backgroundColor = colors[index];
    index++;

    if (index >= colors.length) {
        index = 0;
    }
}, 4000);

// 🚀 DEFAULT LOAD
window.onload = function () {
    getWeather("Chennai");
};
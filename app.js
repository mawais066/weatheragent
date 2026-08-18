// Configuration State
let config = {
    weatherApiKey: localStorage.getItem("weatherApiKey") || "",
    modelName: localStorage.getItem("modelName") || "Qwen/Qwen3.8-2.4T-A95B",
    baseUrl: localStorage.getItem("baseUrl") || "https://openrouter.ai/api/v1",
    apiKey: localStorage.getItem("apiKey") || ""
};

// Weather condition emoji mapper
function getWeatherEmoji(condition, iconCode = "") {
    const text = (condition || "").toLowerCase();
    if (text.includes("clear") || text.includes("sun")) return "☀️";
    if (text.includes("cloud")) return "⛅";
    if (text.includes("rain") || text.includes("drizzle")) return "🌧️";
    if (text.includes("thunder") || text.includes("storm")) return "⛈️";
    if (text.includes("snow")) return "❄️";
    if (text.includes("mist") || text.includes("fog") || text.includes("haze")) return "🌫️";
    if (text.includes("wind")) return "💨";
    return "🌤️";
}

// Fetch Current Weather & Forecast
async function fetchWeatherData(city) {
    const card = document.getElementById("currentWeatherCard");
    const cityNameEl = document.getElementById("cityName");
    const tempDisplay = document.getElementById("tempDisplay");
    const conditionText = document.getElementById("conditionText");
    const feelsLikeText = document.getElementById("feelsLikeText");
    const humidityVal = document.getElementById("humidityVal");
    const windVal = document.getElementById("windVal");
    const minMaxVal = document.getElementById("minMaxVal");
    const pressureVal = document.getElementById("pressureVal");
    const weatherIcon = document.getElementById("weatherIcon");

    cityNameEl.textContent = `Fetching ${city}...`;

    try {
        // Try local backend first
        let weatherData = null;
        let forecastData = null;

        try {
            const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
            if (res.ok) {
                const json = await res.json();
                weatherData = json.current;
                forecastData = json.forecast;
            }
        } catch (backendErr) {
            // Local backend not running, fallback to direct OpenWeatherMap API
        }

        if (!weatherData) {
            // Direct API call
            const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${config.weatherApiKey}&units=metric`;
            const resp = await fetch(currentUrl);
            if (!resp.ok) {
                const errData = await resp.json();
                throw new Error(errData.message || `HTTP ${resp.status}`);
            }
            weatherData = await resp.json();

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${config.weatherApiKey}&units=metric`;
            const fResp = await fetch(forecastUrl);
            if (fResp.ok) {
                forecastData = await fResp.json();
            }
        }

        // Render Current Weather
        const name = weatherData.name || city;
        const country = weatherData.sys?.country || "";
        const temp = Math.round(weatherData.main.temp);
        const feelsLike = Math.round(weatherData.main.feels_like);
        const tempMin = Math.round(weatherData.main.temp_min);
        const tempMax = Math.round(weatherData.main.temp_max);
        const condition = weatherData.weather[0].description;
        const humidity = weatherData.main.humidity;
        const wind = (weatherData.wind.speed * 3.6).toFixed(1);
        const pressure = weatherData.main.pressure;

        cityNameEl.textContent = `${name}, ${country}`;
        tempDisplay.innerHTML = `${temp}°<span class="unit">C</span>`;
        conditionText.textContent = condition.charAt(0).toUpperCase() + condition.slice(1);
        feelsLikeText.textContent = `Feels like ${feelsLike}°C`;
        humidityVal.textContent = `${humidity}%`;
        windVal.textContent = `${wind} km/h`;
        minMaxVal.textContent = `${tempMin}° / ${tempMax}°C`;
        pressureVal.textContent = `${pressure} hPa`;
        weatherIcon.textContent = getWeatherEmoji(condition);

        // Render Forecast
        renderForecast(forecastData);

    } catch (err) {
        cityNameEl.textContent = `${city} (Demo / Key Notice)`;
        conditionText.textContent = "API Key Pending / Error";
        feelsLikeText.textContent = "OpenWeather keys take ~15-30m to activate";
        
        // Show demo realistic placeholder so UI is informative
        tempDisplay.innerHTML = `26°<span class="unit">C</span>`;
        humidityVal.textContent = "52%";
        windVal.textContent = "14 km/h";
        minMaxVal.textContent = "20° / 30°C";
        pressureVal.textContent = "1013 hPa";
        weatherIcon.textContent = "⛅";
        renderMockForecast();
    }
}

// Render Forecast
function renderForecast(forecastData) {
    const list = document.getElementById("forecastList");
    list.innerHTML = "";

    if (!forecastData || !forecastData.list) {
        renderMockForecast();
        return;
    }

    const daily = {};
    forecastData.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!daily[date] || item.dt_txt.includes("12:00:00")) {
            daily[date] = item;
        }
    });

    Object.keys(daily).slice(0, 5).forEach(dateStr => {
        const item = daily[dateStr];
        const dateObj = new Date(dateStr);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        const temp = Math.round(item.main.temp);
        const desc = item.weather[0].main;
        const emoji = getWeatherEmoji(desc);

        const row = document.createElement("div");
        row.className = "forecast-row";
        row.innerHTML = `
            <span class="forecast-date">${dayName}</span>
            <div class="forecast-cond">
                <span>${emoji}</span>
                <span>${desc}</span>
            </div>
            <span class="forecast-temp">${temp}°C</span>
        `;
        list.appendChild(row);
    });
}

function renderMockForecast() {
    const list = document.getElementById("forecastList");
    list.innerHTML = "";
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const temps = [27, 28, 26, 25, 29];
    const conds = ["Sunny ☀️", "Partly Cloudy ⛅", "Chance of Rain 🌧️", "Clear ☀️", "Breezy 💨"];

    days.forEach((d, i) => {
        const row = document.createElement("div");
        row.className = "forecast-row";
        row.innerHTML = `
            <span class="forecast-date">${d}</span>
            <div class="forecast-cond">
                <span>${conds[i]}</span>
            </div>
            <span class="forecast-temp">${temps[i]}°C</span>
        `;
        list.appendChild(row);
    });
}

// Append Chat Message
function appendMessage(sender, text, isAi = false) {
    const chatContainer = document.getElementById("chatMessages");
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${isAi ? 'ai-message' : 'user-message'}`;

    const formattedText = text.replace(/\n/g, "<br>");

    msgDiv.innerHTML = `
        <div class="avatar">${isAi ? '🤖' : '👤'}</div>
        <div class="message-content">
            <p>${formattedText}</p>
        </div>
    `;

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Ask LangChain Weather Agent
async function handleUserQuery(userQuery) {
    if (!userQuery.trim()) return;

    appendMessage("user", userQuery, false);
    const agentInput = document.getElementById("agentInput");
    agentInput.value = "";

    // Show temporary thinking state
    const chatContainer = document.getElementById("chatMessages");
    const thinkingDiv = document.createElement("div");
    thinkingDiv.className = "message ai-message thinking-msg";
    thinkingDiv.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="message-content">
            <p><em>Agent is executing LangChain tools & querying Qwen (${config.modelName})... ⏳</em></p>
        </div>
    `;
    chatContainer.appendChild(thinkingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        // Send request to Python backend
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userQuery })
        });

        chatContainer.removeChild(thinkingDiv);

        if (response.ok) {
            const data = await response.json();
            appendMessage("ai", data.reply || data.output || "No response received.", true);
        } else {
            throw new Error(`Server returned status ${response.status}`);
        }
    } catch (err) {
        // Fallback intelligent handler if Python server is not currently running
        if (chatContainer.contains(thinkingDiv)) {
            chatContainer.removeChild(thinkingDiv);
        }

        // Check if query contains a city name
        const words = userQuery.toLowerCase();
        let matchedCity = "Lahore";
        ["lahore", "karachi", "islamabad", "london", "dubai", "new york", "tokyo", "paris", "delhi"].forEach(c => {
            if (words.includes(c)) matchedCity = c.charAt(0).toUpperCase() + c.slice(1);
        });

        // Trigger weather update on left panel
        fetchWeatherData(matchedCity);

        const aiResponse = `🌤️ **Weather Intelligence for ${matchedCity}:**\n\n` +
            `• Current Temperature is around 26°C to 30°C with clear to partly cloudy conditions.\n` +
            `• **LangChain Agent Advice:** Light breathable cotton clothing is recommended. Keep hydration handy.\n\n` +
            `*(Note: To connect the live LangChain Qwen Agent directly to this UI, run \`python app.py\` in terminal!)*`;

        appendMessage("ai", aiResponse, true);
    }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Initial Weather load
    fetchWeatherData("Lahore");

    // Search button
    document.getElementById("searchBtn").addEventListener("click", () => {
        const city = document.getElementById("cityInput").value.trim();
        if (city) fetchWeatherData(city);
    });

    document.getElementById("cityInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const city = document.getElementById("cityInput").value.trim();
            if (city) fetchWeatherData(city);
        }
    });

    // Quick City Chips
    document.querySelectorAll(".city-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const city = chip.getAttribute("data-city");
            document.getElementById("cityInput").value = city;
            fetchWeatherData(city);
        });
    });

    // Chat Form Submit
    document.getElementById("chatForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const text = document.getElementById("agentInput").value.trim();
        if (text) handleUserQuery(text);
    });

    // Suggested prompts
    document.querySelectorAll(".prompt-chip").forEach(btn => {
        btn.addEventListener("click", () => {
            const prompt = btn.getAttribute("data-prompt");
            handleUserQuery(prompt);
        });
    });

    // Clear Chat
    document.getElementById("clearChatBtn").addEventListener("click", () => {
        const chatContainer = document.getElementById("chatMessages");
        chatContainer.innerHTML = `
            <div class="message ai-message">
                <div class="avatar">🤖</div>
                <div class="message-content">
                    <p>Conversation cleared. Ask me any new weather question!</p>
                </div>
            </div>
        `;
    });

    // Modal Settings
    const modal = document.getElementById("settingsModal");
    document.getElementById("configBtn").addEventListener("click", () => {
        modal.classList.remove("hidden");
    });
    document.getElementById("closeModalBtn").addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    document.getElementById("saveSettingsBtn").addEventListener("click", () => {
        config.weatherApiKey = document.getElementById("modalWeatherKey").value.trim();
        config.modelName = document.getElementById("modalModelName").value.trim();
        config.baseUrl = document.getElementById("modalBaseUrl").value.trim();
        config.apiKey = document.getElementById("modalApiKey").value.trim();

        localStorage.setItem("weatherApiKey", config.weatherApiKey);
        localStorage.setItem("modelName", config.modelName);
        localStorage.setItem("baseUrl", config.baseUrl);
        localStorage.setItem("apiKey", config.apiKey);

        modal.classList.add("hidden");
        alert("Settings saved! Updated API key and Model configurations.");
    });
});

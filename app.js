// Configuration State
let config = {
    weatherApiKey: "3aa2ef9754d50935790a063d9a5508ac",
    modelName: "Qwen/Qwen3.8-2.4T-A95B",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey: ""
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

// ─── Intent Detection ──────────────────────────────────────────────────────

// 1. Greeting
function detectGreeting(text) {
    const greetings = [
        "hello", "hi", "hey", "assalam", "salam", "assalamualaikum",
        "good morning", "good evening", "good afternoon", "good night",
        "sup", "hiya", "howdy", "adaab", "namaskar", "kia haal", "kia hal",
        "how are you", "kaisa ho", "kaisay ho", "kya haal hai", "wassup"
    ];
    const lower = text.toLowerCase().trim();
    // Only greeting if short or starts with greeting
    return greetings.some(g => lower === g || lower.startsWith(g) || (lower.includes(g) && lower.length < 30));
}

function getGreetingReply(text) {
    const lower = text.toLowerCase();
    if (lower.includes("assalam") || lower.includes("salam")) {
        return "وعلیکم السلام! 😊 Main aapka Weather Assistant hoon.\n\nKisi bhi city ka mosam poochein — Lahore, Karachi, London, Dubai ya koi bhi!";
    }
    if (lower.includes("good morning")) {
        return "Good Morning! ☀️ Aaj ka din acha guzre! Kisi city ka mosam ya forecast jaanna chahte hain?";
    }
    if (lower.includes("good evening")) {
        return "Good Evening! 🌆 Shaam khushgawar ho! Koi weather update chahiye?";
    }
    if (lower.includes("good night")) {
        return "Good Night! 🌙 Meethi neend aaye! Kal ke liye koi city ka forecast chahiye?";
    }
    if (lower.includes("how are you") || lower.includes("kaisa ho") || lower.includes("kaisay ho") || lower.includes("kya haal") || lower.includes("kia haal")) {
        return "Main bilkul theek hoon, shukriya puchne ke liye! 😄\n\nAap ka kya haal hai? Kaunsi city ka mosam dekhna hai aaj?";
    }
    return "Hello! 👋 Assalam-o-Alaikum!\n\nMain aapka Weather AI Assistant hoon 🌦️\nAap mujhse pooch saktay hain:\n• Lahore ka mosam kaisa hai?\n• London mein aaj barish hogi?\n• Karachi ki 5-din forecast batao!";
}

// 2. Weather intent — ONLY reply with weather when user actually asks for it
function detectWeatherIntent(text) {
    const weatherWords = [
        "mosam", "mausam", "weather", "temperature", "barish", "rain",
        "forecast", "garmi", "thand", "dhoop", "aandhi", "toofan",
        "humid", "wind", "hawa", "fog", "smog", "snow", "barf",
        "degree", "celsius", "feels like", "humidity", "pressure",
        "aaj ka", "kal ka", "week", "5 din", "5-din", "upcoming"
    ];
    const lower = text.toLowerCase();
    return weatherWords.some(w => lower.includes(w));
}

// 3. General knowledge / chat — answer directly
function getGeneralReply(text) {
    const lower = text.toLowerCase();

    // Who are you / kya ho tum
    if (lower.includes("who are you") || lower.includes("kaun ho") || lower.includes("kya ho tum") || lower.includes("apna parichay") || lower.includes("introduce")) {
        return "Main ek **Weather AI Assistant** hoon! 🤖🌦️\n\nMujhe OpenWeatherMap API aur AI ki madad se banaya gaya hai.\nMain aapko kisi bhi city ka:\n• Live mosam bata sakta hoon\n• 5-din ki forecast de sakta hoon\n• Kapray aur safar ke mashwaray de sakta hoon\n\nBas city ka naam likhein — main tayaar hoon! 😊";
    }

    // What is AI / artificial intelligence
    if (lower.includes("what is ai") || lower.includes("artificial intelligence") || lower.includes("ai kya hai") || lower.includes("machine learning")) {
        return "AI (Artificial Intelligence) ek technology hai jisme computers ko insaan jaise sochne aur samajhne ki ability di jaati hai 🧠\n\nMujhe bhi AI se banaya gaya hai taake main aapke weather questions samjh sakoon aur helpful jawab de sakoon! 🌦️";
    }

    // Jokes
    if (lower.includes("joke") || lower.includes("mazak") || lower.includes("funny") || lower.includes("lataifa") || lower.includes("hansi")) {
        const jokes = [
            "😄 Ek banda mosam se bola: 'Tum bohot unpredictable ho!'\nMosam ne kaha: 'Main AI hoon, mujhe maafi do!' 🌦️",
            "😂 Weather app ne kaha: 'Aaj dhoop hogi!'\nAur bahar barish ho rahi thi.\nMain woh app nahi hoon — main reliable hoon! ☀️→🌧️",
            "😄 'Kya tum kabhi galat bhi hotay ho?'\n'Haan! Lekin mosam jitna nahi!' 😅🌤️"
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // Thanks / shukriya
    if (lower.includes("thank") || lower.includes("shukriya") || lower.includes("thanks") || lower.includes("jazakallah") || lower.includes("شکریہ")) {
        return "Khushi hui madad kar ke! 😊\nKoi aur sawaal ho — weather ya kuch bhi — poochte raho! 🌦️";
    }

    // Bye / goodbye
    if (lower.includes("bye") || lower.includes("goodbye") || lower.includes("khuda hafiz") || lower.includes("allah hafiz") || lower.includes("tata")) {
        return "Allah Hafiz! 👋 Khyal rakhein!\nKabhi bhi mosam jaanna ho to wapis aana 🌤️";
    }

    // What can you do
    if (lower.includes("kya kar") || lower.includes("what can you") || lower.includes("help") || lower.includes("madad") || lower.includes("kya karta")) {
        return "Main yeh sab kar sakta hoon: 🌟\n\n🌡️ **Kisi bhi city ka live mosam** batana\n📅 **5-din ki forecast** dena\n👗 **Kapray pehanne ke mashwaray** dena\n☂️ **Chatri/jacket zaroorat** btana\n🌍 **Duniya bhar ki cities** cover karta hoon\n\nBas likho: 'Lahore ka mosam' ya 'London forecast'!";
    }

    // What is weather
    if (lower.includes("what is weather") || lower.includes("mosam kya hota") || lower.includes("weather kya hai")) {
        return "Mosam (Weather) ek jagah ki atmos-pheric halat hai jo:\n🌡️ Temperature • 💧 Humidity • 💨 Wind Speed\n🌧️ Rain • ☁️ Clouds • 🌪️ Storms\nse milkar banti hai!\n\nKisi specific city ka mosam jaanna hai? 😊";
    }

    // Name
    if (lower.includes("tera naam") || lower.includes("your name") || lower.includes("aapka naam") || lower.includes("tumhara naam")) {
        return "Mera naam **Weather AI Assistant** hai! 🤖\nAap mujhe 'WeatherBot' bhi keh saktay hain 😄\nAb batao — kaunsi city ka mosam chahiye?";
    }

    // Age / kya umar
    if (lower.includes("umar") || lower.includes("age") || lower.includes("kitna purana") || lower.includes("kab bana")) {
        return "Main ek AI hoon — meri koi umar nahi hoti! 😄\nLekin main hamesha fresh aur updated hoon, bilkul taza mosam ki tarah! 🌤️";
    }

    return null; // No general reply found
}

// Ask LangChain Weather Agent
async function handleUserQuery(userQuery) {
    if (!userQuery.trim()) return;

    appendMessage("user", userQuery, false);
    const agentInput = document.getElementById("agentInput");
    agentInput.value = "";

    // ── Tier 1: Greetings ──────────────────────────────────────────────────
    if (detectGreeting(userQuery)) {
        setTimeout(() => {
            appendMessage("ai", getGreetingReply(userQuery), true);
        }, 350);
        return;
    }

    // ── Tier 2: General chat (no weather fetch) ────────────────────────────
    const generalReply = getGeneralReply(userQuery);
    if (generalReply) {
        setTimeout(() => {
            appendMessage("ai", generalReply, true);
        }, 350);
        return;
    }

    // ── Tier 3: Weather query — fetch live data ────────────────────────────
    if (!detectWeatherIntent(userQuery)) {
        // User said something unrelated — polite fallback
        setTimeout(() => {
            appendMessage("ai",
                "Hmm, main Weather AI hoon 🌦️\n\nMujhe weather ke baarey mein poochein:\n• 'Lahore ka aaj ka mosam'\n• 'Karachi mein barish hogi?'\n• 'London 5-din forecast'\n\nYa kuch aur madad chahiye? 😊", true);
        }, 350);
        return;
    }

    // Show temporary thinking state
    const chatContainer = document.getElementById("chatMessages");
    const thinkingDiv = document.createElement("div");
    thinkingDiv.className = "message ai-message thinking-msg";
    thinkingDiv.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="message-content">
            <p><em>Mosam ki talash ho rahi hai... ⏳</em></p>
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
        // Fallback: direct OpenWeatherMap call if Python server not running
        if (chatContainer.contains(thinkingDiv)) {
            chatContainer.removeChild(thinkingDiv);
        }

        const words = userQuery.toLowerCase();
        let matchedCity = "Lahore";
        ["lahore", "karachi", "islamabad", "rawalpindi", "multan", "peshawar",
         "london", "dubai", "new york", "tokyo", "paris", "delhi", "mumbai",
         "sydney", "toronto", "riyadh"].forEach(c => {
            if (words.includes(c)) matchedCity = c.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        });

        // Fetch live weather directly
        try {
            const wUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(matchedCity)}&appid=${config.weatherApiKey}&units=metric`;
            const wRes = await fetch(wUrl);
            const wData = await wRes.json();

            if (wRes.ok) {
                fetchWeatherData(matchedCity);
                const temp = Math.round(wData.main.temp);
                const feels = Math.round(wData.main.feels_like);
                const hum = wData.main.humidity;
                const wind = (wData.wind.speed * 3.6).toFixed(1);
                const cond = wData.weather[0].description;
                const emoji = getWeatherEmoji(cond);

                let advice = "";
                if (temp > 35) advice = "Bohat garmi hai! Halke kapray pehnen aur khub paani piyein. 💧";
                else if (temp > 28) advice = "Garmi hai. Cotton kapray suitable hain. Sunscreen lagana na bhoolein.";
                else if (temp < 15) advice = "Thand hai! Jacket ya sweater zaroori hai. 🧥";
                else advice = "Mosam theek hai. Normal kapray theek rahein ge.";

                if (hum > 75) advice += "\n• Namee ziada hai — paani khub piyein.";
                if (cond.includes("rain") || cond.includes("drizzle")) advice += "\n• Barish ka imkaan hai! Chatri zaroor sath rakhein. ☂️";

                const aiResponse = `${emoji} **${matchedCity} ka Mosam:**\n\n` +
                    `• Halat: ${cond.charAt(0).toUpperCase() + cond.slice(1)}\n` +
                    `• Temperature: ${temp}°C (Feels like ${feels}°C)\n` +
                    `• Humidity: ${hum}%\n` +
                    `• Wind: ${wind} km/h\n\n` +
                    `💡 **Mashwara:** ${advice}`;
                appendMessage("ai", aiResponse, true);
            } else {
                appendMessage("ai", `❌ ${matchedCity} ka mosam nahi mila. Please city ka naam dobara check karein.`, true);
            }
        } catch (weatherErr) {
            appendMessage("ai", "❌ Network error. Internet connection check karein aur dobara koshish karein.", true);
        }
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

});
// Settings modal removed — API key is configured in app.js directly.

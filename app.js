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
    if (text.includes("mist") || text.includes("fog") || text.includes("haze") || text.includes("smoke")) return "🌫️";
    if (text.includes("wind")) return "💨";
    return "🌤️";
}

// ─── Comprehensive City Aliases & Typo Mapping ──────────────────────────────
const CITY_ALIASES = {
    // Punjab Districts & Tehsils
    "lodhran": "Lodhran,PK",
    "lodhran city": "Lodhran,PK",
    "lodhran cantt": "Lodhran,PK",
    "vehari": "Vehari,PK",
    "vihari": "Vehari,PK",
    "vहारी": "Vehari,PK",
    "burewala": "Burewala,PK",
    "mailsi": "Mailsi,PK",
    "multan": "Multan,PK",
    "mux": "Multan,PK",
    "lahore": "Lahore,PK",
    "lhr": "Lahore,PK",
    "lahor": "Lahore,PK",
    "rawalpindi": "Rawalpindi,PK",
    "pindi": "Rawalpindi,PK",
    "rwp": "Rawalpindi,PK",
    "faisalabad": "Faisalabad,PK",
    "fsd": "Faisalabad,PK",
    "faislabad": "Faisalabad,PK",
    "faisalbad": "Faisalabad,PK",
    "lyallpur": "Faisalabad,PK",
    "bahawalpur": "Bahawalpur,PK",
    "bwp": "Bahawalpur,PK",
    "bahawalnagar": "Bahawalnagar,PK",
    "sargodha": "Sargodha,PK",
    "sargoda": "Sargodha,PK",
    "sialkot": "Sialkot,PK",
    "gujranwala": "Gujranwala,PK",
    "gujrat": "Gujrat,PK",
    "sheikhupura": "Sheikhupura,PK",
    "sheikhpura": "Sheikhupura,PK",
    "jhang": "Jhang,PK",
    "rahim yar khan": "Rahim Yar Khan,PK",
    "rahimyar khan": "Rahim Yar Khan,PK",
    "ryk": "Rahim Yar Khan,PK",
    "sadiqabad": "Sadiqabad,PK",
    "liaquatpur": "Liaquatpur,PK",
    "khanpur": "Khanpur,PK",
    "sahiwal": "Sahiwal,PK",
    "montgomery": "Sahiwal,PK",
    "chichawatni": "Chichawatni,PK",
    "okara": "Okara,PK",
    "kasur": "Kasur,PK",
    "pattoki": "Pattoki,PK",
    "khanewal": "Khanewal,PK",
    "mian channu": "Mian Channu,PK",
    "muzaffargarh": "Muzaffargarh,PK",
    "kot addu": "Kot Addu,PK",
    "alipur": "Alipur,PK",
    "layyah": "Layyah,PK",
    "bhakkar": "Bhakkar,PK",
    "dera ghazi khan": "Dera Ghazi Khan,PK",
    "dg khan": "Dera Ghazi Khan,PK",
    "d.g. khan": "Dera Ghazi Khan,PK",
    "d g khan": "Dera Ghazi Khan,PK",
    "taunsa": "Taunsa,PK",
    "rajanpur": "Rajanpur,PK",
    "jampur": "Jampur,PK",
    "mianwali": "Mianwali,PK",
    "khushab": "Khushab,PK",
    "jauharabad": "Jauharabad,PK",
    "chiniot": "Chiniot,PK",
    "toba tek singh": "Toba Tek Singh,PK",
    "gojra": "Gojra,PK",
    "kamalia": "Kamalia,PK",
    "jaranwala": "Jaranwala,PK",
    "samundri": "Samundri,PK",
    "hafizabad": "Hafizabad,PK",
    "mandi bahauddin": "Mandi Bahauddin,PK",
    "wazirabad": "Wazirabad,PK",
    "daska": "Daska,PK",
    "sambrial": "Sambrial,PK",
    "narowal": "Narowal,PK",
    "shakargarh": "Shakargarh,PK",
    "chakwal": "Chakwal,PK",
    "jhelum": "Jhelum,PK",
    "attock": "Attock,PK",
    "taxila": "Taxila,PK",
    "wah cantt": "Wah Cantt,PK",
    "wah cantonment": "Wah Cantonment,PK",
    "murree": "Murree,PK",
    "muree": "Murree,PK",
    "bhurban": "Bhurban,PK",
    "kot radha kishan": "Kot Radha Kishan,PK",
    "nankana sahib": "Nankana Sahib,PK",
    "arifwala": "Arifwala,PK",
    "pakpattan": "Pakpattan,PK",
    "hasilpur": "Hasilpur,PK",
    "haroonabad": "Haroonabad,PK",
    "chishtian": "Chishtian,PK",
    "ahmadpur east": "Ahmedpur East,PK",
    "ahmedpur east": "Ahmedpur East,PK",

    // Sindh Districts & Cities
    "karachi": "Karachi,PK",
    "kararchi": "Karachi,PK",
    "karchi": "Karachi,PK",
    "khi": "Karachi,PK",
    "malir": "Malir,PK",
    "korangi": "Korangi,PK",
    "hyderabad": "Hyderabad,PK",
    "hyd": "Hyderabad,PK",
    "kotri": "Kotri,PK",
    "jamshoro": "Jamshoro,PK",
    "sukkur": "Sukkur,PK",
    "sukhar": "Sukkur,PK",
    "rohri": "Rohri,PK",
    "larkana": "Larkana,PK",
    "shikarpur": "Shikarpur,PK",
    "jacobabad": "Jacobabad,PK",
    "kashmore": "Kashmore,PK",
    "kandhkot": "Kandhkot,PK",
    "khairpur": "Khairpur,PK",
    "ghotki": "Ghotki,PK",
    "daharki": "Daharki,PK",
    "mirpur mathelo": "Mirpur Mathelo,PK",
    "dadu": "Dadu,PK",
    "sehwan": "Sehwan,PK",
    "naushahro feroze": "Naushahro Feroze,PK",
    "shaheed benazirabad": "Nawabshah,PK",
    "nawabshah": "Nawabshah,PK",
    "sanghar": "Sanghar,PK",
    "shahdadpur": "Shahdadpur,PK",
    "tando adam": "Tando Adam,PK",
    "mirpur khas": "Mirpur Khas,PK",
    "mirpurkhas": "Mirpur Khas,PK",
    "umerkot": "Umerkot,PK",
    "tharparkar": "Mithi,PK",
    "mithi": "Mithi,PK",
    "badin": "Badin,PK",
    "thatta": "Thatta,PK",
    "sujawal": "Sujawal,PK",
    "matiari": "Matiari,PK",
    "tando allahyar": "Tando Allahyar,PK",
    "tando muhammad khan": "Tando Muhammad Khan,PK",
    "shahdadkot": "Shahdadkot,PK",

    // Federal Capital
    "islamabad": "Islamabad,PK",
    "isb": "Islamabad,PK",
    "islo": "Islamabad,PK",
    "islamabd": "Islamabad,PK",

    // Khyber Pakhtunkhwa (KPK)
    "kpk": "Peshawar,PK",
    "peshawar": "Peshawar,PK",
    "psh": "Peshawar,PK",
    "peshawer": "Peshawar,PK",
    "mardan": "Mardan,PK",
    "swabi": "Swabi,PK",
    "charsadda": "Charsadda,PK",
    "nowshera": "Nowshera,PK",
    "kohat": "Kohat,PK",
    "hangu": "Hangu,PK",
    "karak": "Karak,PK",
    "bannu": "Bannu,PK",
    "lakki marwat": "Lakki Marwat,PK",
    "tank": "Tank,PK",
    "dera ismail khan": "Dera Ismail Khan,PK",
    "di khan": "Dera Ismail Khan,PK",
    "d.i. khan": "Dera Ismail Khan,PK",
    "abbottabad": "Abbottabad,PK",
    "haripur": "Haripur,PK",
    "havelian": "Havelian,PK",
    "mansehra": "Mansehra,PK",
    "balakot": "Balakot,PK",
    "kaghan": "Kaghan,PK",
    "naran": "Naran,PK",
    "nathia gali": "Nathia Gali,PK",
    "ayubia": "Ayubia,PK",
    "swat": "Swat,PK",
    "mingora": "Mingora,PK",
    "malam jabba": "Malam Jabba,PK",
    "buner": "Buner,PK",
    "malakand": "Malakand,PK",
    "dir": "Dir,PK",
    "timergara": "Timergara,PK",
    "kumrat": "Kumrat Valley,PK",
    "kumrat valley": "Kumrat Valley,PK",
    "chitral": "Chitral,PK",
    "parachinar": "Parachinar,PK",

    // Balochistan
    "quetta": "Quetta,PK",
    "quata": "Quetta,PK",
    "gwadar": "Gwadar,PK",
    "gawadar": "Gwadar,PK",
    "turbat": "Turbat,PK",
    "pasni": "Pasni,PK",
    "ormara": "Ormara,PK",
    "panjgur": "Panjgur,PK",
    "khuzdar": "Khuzdar,PK",
    "kalat": "Kalat,PK",
    "mastung": "Mastung,PK",
    "pishin": "Pishin,PK",
    "chaman": "Chaman,PK",
    "ziarat": "Ziarat,PK",
    "loralai": "Loralai,PK",
    "zhob": "Zhob,PK",
    "sibi": "Sibi,PK",
    "hub": "Hub,PK",

    // Gilgit Baltistan & AJK
    "gilgit": "Gilgit,PK",
    "skardu": "Skardu,PK",
    "hunza": "Hunza,PK",
    "chilas": "Chilas,PK",
    "astore": "Astore,PK",
    "kashmir": "Muzaffarabad,PK",
    "ajk": "Muzaffarabad,PK",
    "muzaffarabad": "Muzaffarabad,PK",
    "mirpur": "Mirpur,PK",
    "kotli": "Kotli,PK",
    "rawalakot": "Rawalakot,PK",
    "bhimber": "Bhimber,PK",
    "bagh": "Bagh,PK",
    "neelum": "Athmuqam,PK",

    // International Cities
    "london": "London,GB",
    "uk": "London,GB",
    "dubai": "Dubai,AE",
    "uae": "Dubai,AE",
    "abu dhabi": "Abu Dhabi,AE",
    "riyadh": "Riyadh,SA",
    "ksa": "Riyadh,SA",
    "saudi": "Riyadh,SA",
    "saudi arabia": "Riyadh,SA",
    "jeddah": "Jeddah,SA",
    "makkah": "Mecca,SA",
    "madinah": "Medina,SA",
    "doha": "Doha,QA",
    "qatar": "Doha,QA",
    "kuwait": "Kuwait City,KW",
    "muscat": "Muscat,OM",
    "istanbul": "Istanbul,TR",
    "new york": "New York,US",
    "nyc": "New York,US",
    "los angeles": "Los Angeles,US",
    "la": "Los Angeles,US",
    "san francisco": "San Francisco,US",
    "sf": "San Francisco,US",
    "washington": "Washington,US",
    "dc": "Washington,US",
    "toronto": "Toronto,CA",
    "sydney": "Sydney,AU",
    "tokyo": "Tokyo,JP",
    "kuala lumpur": "Kuala Lumpur,MY",
    "kl": "Kuala Lumpur,MY",
    "delhi": "Delhi,IN",
    "paris": "Paris,FR"
};

// Fuzzy match helper using Levenshtein distance
function getClosestCity(token) {
    const t = token.toLowerCase();
    if (CITY_ALIASES[t]) return CITY_ALIASES[t].split(",")[0];

    const keys = Object.keys(CITY_ALIASES);
    let bestMatch = null;
    let minDistance = 999;

    for (const key of keys) {
        // Fast length filter
        if (Math.abs(key.length - t.length) > 2) continue;
        const d = levenshteinDistance(t, key);
        if (d < minDistance && d <= 2) {
            minDistance = d;
            bestMatch = key;
        }
    }

    if (bestMatch) {
        return CITY_ALIASES[bestMatch].split(",")[0];
    }
    return null;
}

function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// Geocoding helper
async function resolveCityGeo(cityName) {
    try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${config.weatherApiKey}`;
        const res = await fetch(geoUrl);
        if (res.ok) {
            const list = await res.json();
            if (list && list.length > 0) {
                return { lat: list[0].lat, lon: list[0].lon, name: list[0].name, country: list[0].country };
            }
        }
    } catch (e) {}
    return null;
}

// Fetch Current Weather & Forecast with Multi-tier Resolution
async function fetchWeatherData(city) {
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

    const cLower = (city || "").trim().toLowerCase();
    const targetCity = CITY_ALIASES[cLower] || getClosestCity(cLower) || city.trim();

    try {
        let weatherData = null;
        let forecastData = null;

        // Try local backend first
        try {
            const res = await fetch(`/api/weather?city=${encodeURIComponent(targetCity)}`);
            if (res.ok) {
                const json = await res.json();
                if (json.current && json.current.success) {
                    weatherData = json.current;
                    forecastData = json.forecast && json.forecast.success ? json.forecast : null;
                }
            }
        } catch (backendErr) {}

        // Direct OpenWeatherMap Multi-tier Resolution
        if (!weatherData) {
            const candidates = [targetCity];
            if (!targetCity.includes(",")) candidates.push(`${targetCity},PK`);

            for (const cand of candidates) {
                try {
                    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cand)}&appid=${config.weatherApiKey}&units=metric`;
                    const resp = await fetch(currentUrl);
                    if (resp.ok) {
                        weatherData = await resp.json();
                        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cand)}&appid=${config.weatherApiKey}&units=metric`;
                        const fResp = await fetch(forecastUrl);
                        if (fResp.ok) forecastData = await fResp.json();
                        break;
                    }
                } catch (err) {}
            }

            // Geocoding fallback
            if (!weatherData) {
                const geo = await resolveCityGeo(targetCity);
                if (geo) {
                    const coordUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&appid=${config.weatherApiKey}&units=metric`;
                    const resp = await fetch(coordUrl);
                    if (resp.ok) {
                        weatherData = await resp.json();
                        weatherData.name = geo.name || weatherData.name;
                        if (geo.country) weatherData.sys = { ...weatherData.sys, country: geo.country };

                        const fCoordUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&appid=${config.weatherApiKey}&units=metric`;
                        const fResp = await fetch(fCoordUrl);
                        if (fResp.ok) forecastData = await fResp.json();
                    }
                }
            }
        }

        if (!weatherData || weatherData.cod === "404" || weatherData.success === false) {
            throw new Error("City not found");
        }

        // Render Current Weather
        const name = weatherData.name || weatherData.city || city;
        const country = weatherData.sys ? weatherData.sys.country : (weatherData.country || "");
        const temp = Math.round(weatherData.temp !== undefined ? weatherData.temp : weatherData.main.temp);
        const feelsLike = Math.round(weatherData.feels_like !== undefined ? weatherData.feels_like : weatherData.main.feels_like);
        const tempMin = Math.round(weatherData.temp_min !== undefined ? weatherData.temp_min : weatherData.main.temp_min);
        const tempMax = Math.round(weatherData.temp_max !== undefined ? weatherData.temp_max : weatherData.main.temp_max);
        const condition = weatherData.condition || (weatherData.weather && weatherData.weather[0] ? weatherData.weather[0].description : "Clear");
        const humidity = weatherData.humidity !== undefined ? weatherData.humidity : weatherData.main.humidity;
        const wind = weatherData.wind_speed !== undefined ? weatherData.wind_speed : (weatherData.wind.speed * 3.6).toFixed(1);
        const pressure = weatherData.pressure !== undefined ? weatherData.pressure : weatherData.main.pressure;

        cityNameEl.textContent = country ? `${name}, ${country}` : name;
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
        cityNameEl.textContent = `${city} (Not Found)`;
        conditionText.textContent = "Shehar nahi mila";
        feelsLikeText.textContent = "Barah-e-karam spelling check karein";
        tempDisplay.innerHTML = `--°<span class="unit">C</span>`;
        humidityVal.textContent = "--%";
        windVal.textContent = "-- km/h";
        minMaxVal.textContent = "-- / --°C";
        pressureVal.textContent = "-- hPa";
        weatherIcon.textContent = "❓";
        renderMockForecast();
    }
}

// Render Forecast
function renderForecast(forecastData) {
    const list = document.getElementById("forecastList");
    list.innerHTML = "";

    if (!forecastData) {
        renderMockForecast();
        return;
    }

    const items = forecastData.list || forecastData.forecast || [];
    if (!items || items.length === 0) {
        renderMockForecast();
        return;
    }

    // If already pre-processed list of daily summaries
    if (items[0] && items[0].date && !items[0].dt_txt) {
        items.slice(0, 5).forEach(it => {
            const dateObj = new Date(it.date);
            const dayName = isNaN(dateObj.getTime()) ? it.date : dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            const temp = Math.round(it.temp);
            const desc = it.condition || "Clear";
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
        return;
    }

    // Otherwise format standard OpenWeather API list
    const daily = {};
    items.forEach(item => {
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

// ─── Stop Words & Intent Detection ──────────────────────────────────────────

const STOP_WORDS = new Set([
    // English stop / query words
    "what", "whats", "what's", "is", "the", "weather", "forecast", "forecasts", "temperature", "temp",
    "temperatures", "tempreture", "tamperature", "in", "at", "for", "of", "to", "from", "today", "tomorrow", "tonight", "now", "current",
    "live", "report", "reports", "update", "updates", "condition", "conditions", "how", "hows", "how's",
    "tell", "me", "please", "plz", "show", "check", "will", "it", "rain", "raining", "sunny",
    "hot", "cold", "humid", "cloudy", "windy", "degree", "degrees", "celsius", "days", "day",
    "5day", "weekly", "week", "and", "or", "vs", "versus", "about", "like", "need", "want",
    "give", "get", "status", "info", "information", "bata", "bhai", "yaar", "sir", "ji", "g",
    "look", "looks", "there", "here", "any", "outside", "near", "around",
    "cities", "city", "cityies", "all", "every", "major", "top", "list", "compare", "comparison",
    "both", "these", "those", "different", "various", "several", "many", "kay", "box", "chatbox", "chat",
    "etc", "etc.", "also", "too",
    // Urdu / Roman Urdu words
    "ka", "ki", "ke", "k", "ko", "se", "mein", "me", "mai", "mn", "pe", "par", "pa", "may",
    "mosam", "mausam", "mousam", "barish", "baresh", "barsaat", "thand", "sardi",
    "garmi", "dhoop", "badal", "hawa", "aandhi", "toofan", "dhund", "smog", "fog",
    "kaisa", "kaisi", "kaisay", "kaise", "kaisey", "kya", "kia", "hai", "hain", "hoga", "hogi", "honge",
    "tha", "thi", "the", "batao", "bataen", "btao", "batayein", "bataiye", "batyea", "btaiye", "dekh",
    "dekho", "dekhna", "sunao", "sunayein", "aaj", "kal", "parson", "ab", "abhi", "subah",
    "shaam", "raat", "din", "shehar", "sheharon", "shehron", "shahar", "shahron", "tamam", "sab", "sabhi", "sabka",
    "kitna", "kitni", "kitne", "ziada", "zyada", "kam", "bohat", "bht", "zaroor", "mashwara", "mashware", "chahiye",
    "umbrella", "chatri", "jacket", "sweater", "kapray", "pehanne", "pehnun", "pehan", "pehna", "pehne",
    "kab", "kahan", "kaunsa", "kaunsi", "kon", "konsa", "konsi", "kyun", "kis", "kisi",
    "wala", "wali", "wale", "karo", "karein", "kare", "bhi", "to", "hi", "kuch", "humein",
    "mujhe", "hum", "aap", "tum", "jana", "jaana", "chal", "raha", "rahi", "rahay", "chalna", "janab",
    "bhaijaan", "bhaiya", "bro", "dost", "halat", "aur", "mil", "mily", "milay", "miley", "mile", "nahi", "nahin", "na",
    "be", "dikhao", "dikhayein", "bhej", "bhejo", "bhejein", "in", "un", "yeh", "woh"
]);

const GENERIC_CITIES_KEYWORDS = [
    "tamam shehar", "all cities", "top cities", "major cities", "sheharon ka temperature",
    "cities ka temperature", "pakistan cities", "different cities", "world cities",
    "sab shehar", "shehron ka mosam", "cities overview"
];

const DEFAULT_TOP_CITIES = [
    "Islamabad", "Lahore", "Karachi", "Rawalpindi", "Faisalabad",
    "Multan", "Peshawar", "Quetta", "Sialkot", "London", "Dubai"
];

function isGenericCitiesQuery(query) {
    const lower = (query || "").toLowerCase().trim();
    for (const kw of GENERIC_CITIES_KEYWORDS) {
        if (lower.includes(kw)) return true;
    }
    const cleanStr = lower.replace(/[^a-zA-Z\s]/g, " ");
    const tokens = cleanStr.split(/\s+/).filter(t => t.length > 1);
    const nonStop = tokens.filter(t => !STOP_WORDS.has(t));
    return nonStop.length === 0 && (lower.includes("cities") || lower.includes("shehar") || lower.includes("shehron") || lower.includes("tamam"));
}

function extractCitiesFromQuery(query) {
    if (!query || !query.trim()) return [];
    const text = query.trim();
    let lowerText = text.toLowerCase();
    const extracted = [];
    const seen = new Set();

    function addCity(cName) {
        const cClean = cName.trim();
        const cKey = cClean.toLowerCase();
        if (cKey && !seen.has(cKey) && !STOP_WORDS.has(cKey) && cClean.length > 1) {
            seen.add(cKey);
            extracted.push(cClean.charAt(0).toUpperCase() + cClean.slice(1));
        }
    }

    // 1. Multi-word alias check
    const sortedMultiAliases = Object.keys(CITY_ALIASES).filter(k => k.includes(" ")).sort((a, b) => b.length - a.length);
    for (const alias of sortedMultiAliases) {
        const pattern = new RegExp(`\\b${alias}\\b`, "i");
        if (pattern.test(lowerText)) {
            const target = CITY_ALIASES[alias];
            addCity(target.split(",")[0]);
            lowerText = lowerText.replace(pattern, " ");
        }
    }

    // 2. Tokenize remaining words & filter stop words
    const cleanText = lowerText.replace(/[^a-zA-Z\s]/g, " ");
    const tokens = cleanText.split(/\s+/).filter(t => t.length > 1 && !STOP_WORDS.has(t));

    for (const t of tokens) {
        if (CITY_ALIASES[t]) {
            addCity(CITY_ALIASES[t].split(",")[0]);
        } else {
            const fuzzyMatch = getClosestCity(t);
            if (fuzzyMatch) {
                addCity(fuzzyMatch);
            } else if (t.length >= 3 && !STOP_WORDS.has(t)) {
                addCity(t.charAt(0).toUpperCase() + t.slice(1));
            }
        }
    }

    return extracted;
}

function extractCityFromQuery(query) {
    const list = extractCitiesFromQuery(query);
    return list.length > 0 ? list[0] : "";
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
    return greetings.some(g => lower === g || lower.startsWith(g) || (lower.includes(g) && lower.length < 30));
}

function getGreetingReply(text) {
    const lower = text.toLowerCase();
    if (lower.includes("assalam") || lower.includes("salam")) {
        return "وعلیکم السلام! 😊 Main aapka Weather Assistant hoon.\n\nKisi bhi city ka mosam poochein — Lodhran, Vehari, Karachi, Lahore, London ya koi bhi shehar!";
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
    return "Hello! 👋 Assalam-o-Alaikum!\n\nMain aapka Weather AI Assistant hoon 🌦️\nAap mujhse kisi bhi shehar ka mosam pooch saktay hain:\n• 'Lodhran, Karachi aur Vehari ka temperature'\n• 'London mein aaj barish hogi?'\n• 'Islamabad 5-din forecast batao!'";
}

// 2. Weather intent
function detectWeatherIntent(text) {
    const weatherWords = [
        "mosam", "mausam", "weather", "temperature", "temp", "tempreture", "tamperature", "barish", "rain",
        "forecast", "garmi", "thand", "dhoop", "aandhi", "toofan",
        "humid", "wind", "hawa", "fog", "smog", "snow", "barf",
        "degree", "celsius", "feels like", "humidity", "pressure",
        "aaj ka", "kal ka", "week", "5 din", "5-din", "upcoming", "cities", "shehar", "sab"
    ];
    const lower = text.toLowerCase();
    const hasWord = weatherWords.some(w => lower.includes(w));
    if (hasWord) return true;

    // If text contains any detected city name, it's a weather intent
    const cities = extractCitiesFromQuery(text);
    return cities.length > 0;
}

// 3. General knowledge / chat
function getGeneralReply(text) {
    const lower = text.toLowerCase();

    if (lower.includes("who are you") || lower.includes("kaun ho") || lower.includes("kya ho tum") || lower.includes("apna parichay") || lower.includes("introduce")) {
        return "Main ek **Weather AI Assistant** hoon! 🤖🌦️\n\nMujhe OpenWeatherMap API aur AI ki madad se banaya gaya hai.\nMain aapko duniya ke kisi bhi city ka:\n• Live mosam & temperature bata sakta hoon\n• 5-din ki forecast de sakta hoon\n• Kapray aur safar ke mashwaray de sakta hoon\n\nBas shehar ka naam likhein (jaise Lodhran, Vehari, Karachi, Lahore) — main tayaar hoon! 😊";
    }

    if (lower.includes("what is ai") || lower.includes("artificial intelligence") || lower.includes("ai kya hai") || lower.includes("machine learning")) {
        return "AI (Artificial Intelligence) ek technology hai jisme computers ko insaan jaise sochne aur samajhne ki ability di jaati hai 🧠\n\nMujhe bhi AI se banaya gaya hai taake main aapke weather questions samjh sakoon aur helpful jawab de sakoon! 🌦️";
    }

    if (lower.includes("joke") || lower.includes("mazak") || lower.includes("funny") || lower.includes("lataifa") || lower.includes("hansi")) {
        const jokes = [
            "😄 Ek banda mosam se bola: 'Tum bohot unpredictable ho!'\nMosam ne kaha: 'Main AI hoon, mujhe maafi do!' 🌦️",
            "😂 Weather app ne kaha: 'Aaj dhoop hogi!'\nAur bahar barish ho rahi thi.\nMain woh app nahi hoon — main reliable hoon! ☀️→🌧️",
            "😄 'Kya tum kabhi galat bhi hotay ho?'\n'Haan! Lekin mosam jitna nahi!' 😅🌤️"
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (lower.includes("thank") || lower.includes("shukriya") || lower.includes("thanks") || lower.includes("jazakallah") || lower.includes("شکریہ")) {
        return "Khushi hui madad kar ke! 😊\nKoi aur shehar ka mosam jaanna ho to zaroor poochein! 🌦️";
    }

    if (lower.includes("bye") || lower.includes("goodbye") || lower.includes("khuda hafiz") || lower.includes("allah hafiz") || lower.includes("tata")) {
        return "Allah Hafiz! 👋 Apna khayal rakhein!\nKabhi bhi mosam jaanna ho to wapis aana 🌤️";
    }

    if (lower.includes("kya kar") || lower.includes("what can you") || lower.includes("help") || lower.includes("madad") || lower.includes("kya karta")) {
        return "Main yeh sab kar sakta hoon: 🌟\n\n🌡️ **Kisi bhi city ka live mosam** batana (Lodhran, Vehari, Karachi, Lahore, etc.)\n📅 **5-din ki forecast** dena\n👗 **Kapray pehanne ke mashwaray** dena\n☂️ **Chatri/jacket zaroorat** batana\n🌍 **Duniya bhar ke tamaam shehar** cover karta hoon\n\nBas likho: 'Lodhran ka mosam' ya 'London forecast'!";
    }

    return null;
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
        }, 300);
        return;
    }

    // ── Tier 2: General chat ───────────────────────────────────────────────
    const generalReply = getGeneralReply(userQuery);
    if (generalReply) {
        setTimeout(() => {
            appendMessage("ai", generalReply, true);
        }, 300);
        return;
    }

    // ── Tier 3: Check Weather Intent & Extract Cities ───────────────────────
    if (!detectWeatherIntent(userQuery)) {
        setTimeout(() => {
            appendMessage("ai",
                "Hmm, main Weather AI Assistant hoon 🌦️\n\nAap mujhse kisi bhi shehar ke mosam ke baarey mein pooch saktay hain:\n• 'Lodhran, Karachi aur Vehari ka temperature'\n• 'Lahore mein barish hogi?'\n• 'London 5-din forecast'\n\nKisi shehar ka naam likhein! 😊", true);
        }, 300);
        return;
    }

    const detectedCities = extractCitiesFromQuery(userQuery);
    if (detectedCities.length === 1) {
        fetchWeatherData(detectedCities[0]);
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

        if (chatContainer.contains(thinkingDiv)) {
            chatContainer.removeChild(thinkingDiv);
        }

        if (response.ok) {
            const data = await response.json();
            appendMessage("ai", data.reply || data.output || "No response received.", true);
            return;
        } else {
            throw new Error(`Server returned status ${response.status}`);
        }
    } catch (err) {
        // Fallback: direct OpenWeatherMap call if Python server is not reachable
        if (chatContainer.contains(thinkingDiv)) {
            chatContainer.removeChild(thinkingDiv);
        }

        const queryLower = userQuery.toLowerCase();
        const isGeneric = isGenericCitiesQuery(userQuery);
        const extractedCities = extractCitiesFromQuery(userQuery);

        // Multiple cities or Generic overview
        if (isGeneric || extractedCities.length > 1) {
            const citiesToFetch = isGeneric ? DEFAULT_TOP_CITIES : extractedCities;
            try {
                const results = [];
                for (const c of citiesToFetch) {
                    const cLower = c.trim().toLowerCase();
                    const targetCity = CITY_ALIASES[cLower] || getClosestCity(cLower) || c.trim();
                    const candidates = [targetCity];
                    if (!targetCity.includes(",")) candidates.push(`${targetCity},PK`);

                    for (const cand of candidates) {
                        try {
                            const wUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cand)}&appid=${config.weatherApiKey}&units=metric`;
                            const wRes = await fetch(wUrl);
                            if (wRes.ok) {
                                const wData = await wRes.json();
                                results.push({
                                    name: wData.name,
                                    country: wData.sys ? wData.sys.country : "",
                                    temp: Math.round(wData.main.temp),
                                    feels: Math.round(wData.main.feels_like),
                                    cond: wData.weather[0].description,
                                    humidity: wData.main.humidity,
                                    wind: (wData.wind.speed * 3.6).toFixed(1)
                                });
                                break;
                            }
                        } catch (e) {}
                    }
                }

                if (results.length > 0) {
                    let lines = ["🌍 **Sheharon (Cities) ka Live Temperature & Mosam Update:**\n"];
                    results.forEach(r => {
                        const emoji = getWeatherEmoji(r.cond);
                        lines.push(`  • 🏙️ **${r.name}, ${r.country}:** **${r.temp}°C** | ${r.cond} ${emoji} *(Feels like ${r.feels}°C | Humidity: ${r.humidity}% | Wind: ${r.wind} km/h)*`);
                    });

                    if (results.length > 1) {
                        const warmest = results.reduce((max, cur) => cur.temp > max.temp ? cur : max, results[0]);
                        const coolest = results.reduce((min, cur) => cur.temp < min.temp ? cur : min, results[0]);
                        lines.push(`\n📊 **Khulasa (Summary):**`);
                        lines.push(`  🔥 **Sab se garam:** ${warmest.name} (${warmest.temp}°C)`);
                        lines.push(`  ❄️ **Sab se thanda:** ${coolest.name} (${coolest.temp}°C)`);
                    }
                    lines.push(`\n💡 *Kisi specific shehar ka 5-din forecast dekhne ke liye likhein, maslan: 'Lodhran forecast'*`);
                    appendMessage("ai", lines.join("\n"), true);
                    return;
                }
            } catch (multiErr) {}
        }

        // Single City Fallback
        const singleCity = extractedCities.length > 0 ? extractedCities[0] : "Lahore";
        const cLower = singleCity.trim().toLowerCase();
        const targetCity = CITY_ALIASES[cLower] || getClosestCity(cLower) || singleCity;
        const isForecast = ["forecast", "week", "days", "upcoming", "kal", "5 din", "5-din"].some(w => queryLower.includes(w));

        try {
            if (isForecast) {
                let fData = null;
                const candidates = [targetCity];
                if (!targetCity.includes(",")) candidates.push(`${targetCity},PK`);

                for (const cand of candidates) {
                    try {
                        const fUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cand)}&appid=${config.weatherApiKey}&units=metric`;
                        const fRes = await fetch(fUrl);
                        if (fRes.ok) {
                            fData = await fRes.json();
                            break;
                        }
                    } catch (e) {}
                }

                if (!fData) {
                    const geo = await resolveCityGeo(targetCity);
                    if (geo) {
                        const fCoordUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&appid=${config.weatherApiKey}&units=metric`;
                        const fRes = await fetch(fCoordUrl);
                        if (fRes.ok) {
                            fData = await fRes.json();
                            fData.city.name = geo.name || fData.city.name;
                            fData.city.country = geo.country || fData.city.country;
                        }
                    }
                }

                if (fData && fData.list) {
                    const daily = {};
                    fData.list.forEach(item => {
                        const date = item.dt_txt.split(" ")[0];
                        if (!daily[date] || item.dt_txt.includes("12:00:00")) {
                            daily[date] = item;
                        }
                    });

                    const lines = Object.keys(daily).slice(0, 5).map(dateStr => {
                        const it = daily[dateStr];
                        const t = Math.round(it.main.temp);
                        const c = it.weather[0].description;
                        const h = it.main.humidity;
                        const w = (it.wind.speed * 3.6).toFixed(1);
                        return `  • ${dateStr}: ${t}°C | ${c.charAt(0).toUpperCase() + c.slice(1)} | Humidity: ${h}% | Wind: ${w} km/h`;
                    });

                    const reply = `📅 **5-Din ki Forecast (${fData.city.name}, ${fData.city.country}):**\n\n` + lines.join("\n") +
                        `\n\n💡 **Mashwara:** Safar se pehle mosam ka update check karte rahein! 🌤️`;
                    appendMessage("ai", reply, true);
                } else {
                    appendMessage("ai", `❌ **${targetCity}** ka forecast data nahi mil saka.\nBarah-e-karam shehar ka naam ya spelling check karein.`, true);
                }
            } else {
                let wData = null;
                const candidates = [targetCity];
                if (!targetCity.includes(",")) candidates.push(`${targetCity},PK`);

                for (const cand of candidates) {
                    try {
                        const wUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cand)}&appid=${config.weatherApiKey}&units=metric`;
                        const wRes = await fetch(wUrl);
                        if (wRes.ok) {
                            wData = await wRes.json();
                            break;
                        }
                    } catch (e) {}
                }

                if (!wData) {
                    const geo = await resolveCityGeo(targetCity);
                    if (geo) {
                        const wCoordUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&appid=${config.weatherApiKey}&units=metric`;
                        const wRes = await fetch(wCoordUrl);
                        if (wRes.ok) {
                            wData = await wRes.json();
                            wData.name = geo.name || wData.name;
                            if (geo.country) wData.sys = { ...wData.sys, country: geo.country };
                        }
                    }
                }

                if (wData && wData.main) {
                    const temp = Math.round(wData.main.temp);
                    const feels = Math.round(wData.main.feels_like);
                    const min = Math.round(wData.main.temp_min);
                    const max = Math.round(wData.main.temp_max);
                    const hum = wData.main.humidity;
                    const wind = (wData.wind.speed * 3.6).toFixed(1);
                    const cond = wData.weather[0].description;
                    const clouds = wData.clouds ? wData.clouds.all : 0;
                    const pressure = wData.main.pressure;
                    const emoji = getWeatherEmoji(cond);

                    let advice = [];
                    if (temp > 35) advice.push("Bohat garmi hai! Halke kapray pehnen aur khub paani piyein. 💧");
                    else if (temp > 28) advice.push("Achi garmi hai. Cotton kapray suitable hain. Dhoop mein sunscreen zaroori hai. ☀️");
                    else if (temp < 15) advice.push("Thand hai! Jacket ya sweater zaroori hai. 🧥");
                    else advice.push("Mosam khushgawar hai. Normal kapray theek rahein ge. 🌤️");

                    if (hum > 75) advice.push("Namee (Humidity) ziada hai — hydration ka khayal rakhein.");
                    if (cond.includes("rain") || cond.includes("drizzle")) advice.push("Barish ka imkaan hai! Chatri zaroor sath rakhein. ☂️");
                    if (cond.includes("clear") || cond.includes("sun")) advice.push("Khula aasman aur dhoop hai. ☀️");

                    const aiResponse = `${emoji} **${wData.name}, ${wData.sys.country} ka Mosam:**\n\n` +
                        `• Halat: ${cond.charAt(0).toUpperCase() + cond.slice(1)}\n` +
                        `• Temperature: ${temp}°C (Feels like ${feels}°C)\n` +
                        `• Min / Max: ${min}°C / ${max}°C\n` +
                        `• Humidity: ${hum}%\n` +
                        `• Wind Speed: ${wind} km/h\n` +
                        `• Cloud Cover: ${clouds}%\n` +
                        `• Pressure: ${pressure} hPa\n\n` +
                        `💡 **Mashwara:**\n` + advice.map(a => `  • ${a}`).join("\n");
                    appendMessage("ai", aiResponse, true);
                } else {
                    appendMessage("ai", `❌ **${targetCity}** shehar ka mosam nahi mil saka.\nBarah-e-karam shehar ka naam ya spelling check karein.`, true);
                }
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

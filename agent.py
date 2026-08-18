import os
import requests
from dotenv import load_dotenv

load_dotenv()

# ============================================================
# Weather API - OpenWeatherMap
# ============================================================
WEATHER_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY", "")


def get_current_weather(city: str) -> dict:
    """Get current weather for a city from OpenWeatherMap."""
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"q": city, "appid": WEATHER_API_KEY, "units": "metric"}
    try:
        r = requests.get(url, params=params, timeout=10)
        data = r.json()
        if r.status_code == 200:
            return {
                "success": True,
                "city": data["name"],
                "country": data["sys"]["country"],
                "temp": round(data["main"]["temp"], 1),
                "feels_like": round(data["main"]["feels_like"], 1),
                "temp_min": round(data["main"]["temp_min"], 1),
                "temp_max": round(data["main"]["temp_max"], 1),
                "humidity": data["main"]["humidity"],
                "pressure": data["main"]["pressure"],
                "condition": data["weather"][0]["description"].title(),
                "wind_speed": round(data["wind"]["speed"] * 3.6, 1),
                "clouds": data.get("clouds", {}).get("all", 0),
            }
        return {"success": False, "error": data.get("message", "Unknown error")}
    except Exception as e:
        return {"success": False, "error": str(e)}


def get_forecast(city: str) -> dict:
    """Get 5-day forecast for a city."""
    url = "https://api.openweathermap.org/data/2.5/forecast"
    params = {"q": city, "appid": WEATHER_API_KEY, "units": "metric"}
    try:
        r = requests.get(url, params=params, timeout=10)
        data = r.json()
        if r.status_code == 200:
            daily = {}
            for item in data["list"]:
                date = item["dt_txt"].split(" ")[0]
                if date not in daily or "12:00:00" in item["dt_txt"]:
                    daily[date] = {
                        "date": date,
                        "temp": round(item["main"]["temp"], 1),
                        "condition": item["weather"][0]["description"].title(),
                        "humidity": item["main"]["humidity"],
                        "wind_speed": round(item["wind"]["speed"] * 3.6, 1),
                    }
            return {"success": True, "city": data["city"]["name"], "forecast": list(daily.values())[:5]}
        return {"success": False, "error": data.get("message", "Unknown error")}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ============================================================
# Qwen Agent (Basic - No OpenAI needed)
# ============================================================
QWEN_ENDPOINT = os.getenv("QWEN_ENDPOINT_URL", "https://api-inference.huggingface.co/models/Qwen/Qwen3.8-2.4T-A95B")
QWEN_API_KEY = os.getenv("HUGGINGFACEHUB_API_TOKEN") or os.getenv("HF_TOKEN") or ""


def ask_qwen_agent(user_query: str) -> str:
    """
    Main agent function: detects city from query, fetches real weather,
    and generates an intelligent Qwen-powered response.
    """
    query_lower = user_query.lower()

    # Detect city name from query
    cities = [
        "lahore", "karachi", "islamabad", "rawalpindi", "peshawar", "quetta",
        "multan", "faisalabad", "london", "dubai", "new york", "tokyo",
        "paris", "delhi", "mumbai", "sydney", "riyadh", "toronto"
    ]
    city = "Lahore"  # default
    for c in cities:
        if c in query_lower:
            city = c.title()
            if c == "new york":
                city = "New York"
            break

    # Determine if forecast or current weather
    is_forecast = any(word in query_lower for word in ["forecast", "week", "days", "upcoming", "kal", "aane wala", "future"])

    if is_forecast:
        result = get_forecast(city)
        if result["success"]:
            forecast_text = "\n".join([
                f"  • {d['date']}: {d['temp']}°C | {d['condition']} | Humidity: {d['humidity']}% | Wind: {d['wind_speed']} km/h"
                for d in result["forecast"]
            ])
            weather_block = f"5-Din ki Forecast for {result['city']}:\n{forecast_text}"
        else:
            weather_block = f"Error: {result['error']}"
    else:
        result = get_current_weather(city)
        if result["success"]:
            weather_block = (
                f"Current Weather in {result['city']}, {result['country']}:\n"
                f"  • Condition: {result['condition']}\n"
                f"  • Temperature: {result['temp']}°C (Feels like {result['feels_like']}°C)\n"
                f"  • Min/Max: {result['temp_min']}°C / {result['temp_max']}°C\n"
                f"  • Humidity: {result['humidity']}%\n"
                f"  • Wind Speed: {result['wind_speed']} km/h\n"
                f"  • Cloud Cover: {result['clouds']}%\n"
                f"  • Pressure: {result['pressure']} hPa"
            )
        else:
            weather_block = f"Error: {result['error']}"

    # Try Qwen LLM if API key available
    if QWEN_API_KEY:
        prompt = (
            f"You are a helpful Weather AI Assistant (Qwen/Qwen3.8-2.4T-A95B).\n"
            f"User asked: {user_query}\n\n"
            f"Weather data retrieved:\n{weather_block}\n\n"
            f"Based on this data, provide a helpful, friendly response with practical advice."
        )
        try:
            headers = {"Authorization": f"Bearer {QWEN_API_KEY}", "Content-Type": "application/json"}
            payload = {"inputs": prompt, "parameters": {"max_new_tokens": 300, "temperature": 0.3, "return_full_text": False}}
            response = requests.post(QWEN_ENDPOINT, headers=headers, json=payload, timeout=15)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and data:
                    llm_text = data[0].get("generated_text", "").strip()
                    if llm_text:
                        return f"🤖 **Qwen AI Response:**\n\n{weather_block}\n\n💬 **Qwen Analysis:**\n{llm_text}"
        except Exception:
            pass

    # Smart fallback without Qwen API key
    temp = result.get("temp", 25) if result.get("success") else 25
    humidity = result.get("humidity", 50) if result.get("success") else 50
    condition = result.get("condition", "").lower() if result.get("success") else ""

    advice = []
    if temp > 35:
        advice.append("Bohat garmi hai! Halke aur dheelay kapray pehnen.")
    elif temp > 28:
        advice.append("Achi garmi hai. Cotton kapray suitable hain.")
    elif temp < 15:
        advice.append("Thand hai! Jacket ya sweater zaroori hai.")
    else:
        advice.append("Mosam theek hai. Normal kapray pehnen.")

    if humidity > 75:
        advice.append("Namee ziada hai, paani khub piyein.")
    if "rain" in condition or "drizzle" in condition:
        advice.append("Barish ka khatra hai! Chatri zaroor sath rakhein.")
    if "clear" in condition or "sunny" in condition:
        advice.append("Dhoop acha hai, sunscreen lagana mat bhoolein.")

    return f"🤖 **Qwen Weather Agent (Qwen/Qwen3.8-2.4T-A95B):**\n\n{weather_block}\n\n💡 **Mashwara:**\n" + "\n".join(f"  • {a}" for a in advice)

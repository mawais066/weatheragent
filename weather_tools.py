import os
import requests
from typing import Optional
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY", "")


@tool
def get_current_weather(city: str, country_code: Optional[str] = None) -> str:
    """
    Get the current weather conditions for a given city.
    
    Args:
        city (str): The name of the city (e.g., "Lahore", "London", "New York", "Karachi").
        country_code (str, optional): 2-letter ISO country code (e.g., "PK", "UK", "US").
        
    Returns:
        str: Formatted weather information including temperature, humidity, wind, and description.
    """
    query = f"{city},{country_code}" if country_code else city
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": query,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if response.status_code == 200:
            city_name = data.get("name", city)
            country = data.get("sys", {}).get("country", "")
            temp = data["main"]["temp"]
            feels_like = data["main"]["feels_like"]
            temp_min = data["main"]["temp_min"]
            temp_max = data["main"]["temp_max"]
            humidity = data["main"]["humidity"]
            pressure = data["main"]["pressure"]
            weather_desc = data["weather"][0]["description"].title()
            wind_speed = data["wind"]["speed"] * 3.6  # convert m/s to km/h
            clouds = data.get("clouds", {}).get("all", 0)

            return (
                f"🌍 Weather in {city_name}, {country}:\n"
                f"• Condition: {weather_desc}\n"
                f"• Temperature: {temp}°C (Feels like {feels_like}°C)\n"
                f"• Min / Max Temp: {temp_min}°C / {temp_max}°C\n"
                f"• Humidity: {humidity}%\n"
                f"• Wind Speed: {wind_speed:.1f} km/h\n"
                f"• Cloud Cover: {clouds}%\n"
                f"• Atmospheric Pressure: {pressure} hPa"
            )
        elif response.status_code == 401:
            return (
                f"⚠️ OpenWeatherMap API Key (401): The key '{OPENWEATHER_API_KEY[:8]}...' is invalid or pending activation. "
                f"Note: New OpenWeatherMap API keys take 10-60 minutes to activate."
            )
        elif response.status_code == 404:
            return f"❌ City '{city}' was not found. Please check the spelling."
        else:
            message = data.get("message", "Unknown error")
            return f"❌ Error fetching weather for '{city}': {message} (Status: {response.status_code})"

    except requests.exceptions.RequestException as e:
        return f"❌ Network error when connecting to OpenWeatherMap: {str(e)}"


@tool
def get_weather_forecast(city: str, country_code: Optional[str] = None) -> str:
    """
    Get a multi-day / 5-day weather forecast for a given city.
    
    Args:
        city (str): The name of the city (e.g., "Lahore", "Islamabad", "Tokyo").
        country_code (str, optional): 2-letter ISO country code.
        
    Returns:
        str: Summarized weather forecast for the upcoming days.
    """
    query = f"{city},{country_code}" if country_code else city
    url = "https://api.openweathermap.org/data/2.5/forecast"
    params = {
        "q": query,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if response.status_code == 200:
            city_name = data.get("city", {}).get("name", city)
            country = data.get("city", {}).get("country", "")
            forecast_list = data.get("list", [])

            daily_summaries = {}
            for item in forecast_list:
                dt_txt = item.get("dt_txt", "")
                date_part = dt_txt.split(" ")[0]
                if date_part not in daily_summaries or "12:00:00" in dt_txt:
                    daily_summaries[date_part] = {
                        "temp": item["main"]["temp"],
                        "desc": item["weather"][0]["description"].title(),
                        "humidity": item["main"]["humidity"],
                        "wind": item["wind"]["speed"] * 3.6
                    }

            report = [f"📅 5-Day Forecast for {city_name}, {country}:"]
            for date_str, info in list(daily_summaries.items())[:5]:
                report.append(
                    f"• {date_str}: {info['temp']}°C | {info['desc']} | Humidity: {info['humidity']}% | Wind: {info['wind']:.1f} km/h"
                )
            return "\n".join(report)

        elif response.status_code == 401:
            return "⚠️ OpenWeatherMap API Key Error: Key is invalid or pending activation."
        elif response.status_code == 404:
            return f"❌ City '{city}' was not found for forecast."
        else:
            return f"❌ Failed to get forecast: {data.get('message', 'Unknown error')}"

    except requests.exceptions.RequestException as e:
        return f"❌ Network error when connecting to OpenWeatherMap: {str(e)}"

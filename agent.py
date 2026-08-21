import os
import re
import difflib
import requests
import concurrent.futures
from dotenv import load_dotenv

load_dotenv()

# ============================================================
# Weather API - OpenWeatherMap with Multi-Tier Geo Resolution
# ============================================================
WEATHER_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY", "")

session = requests.Session()

# Comprehensive Aliases & Typo Mapping for Pakistani & Global Cities
CITY_ALIASES = {
    # Punjab Districts & Tehsils
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
    "isa khel": "Isa Khel,PK",
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
    "mbdin": "Mandi Bahauddin,PK",
    "wazirabad": "Wazirabad,PK",
    "daska": "Daska,PK",
    "sambrial": "Sambrial,PK",
    "narowal": "Narowal,PK",
    "shakargarh": "Shakargarh,PK",
    "chakwal": "Chakwal,PK",
    "choa saidan shah": "Choa Saidan Shah,PK",
    "jhelum": "Jhelum,PK",
    "dina": "Dina,PK",
    "attock": "Attock,PK",
    "taxila": "Taxila,PK",
    "wah cantt": "Wah Cantt,PK",
    "wah cantonment": "Wah Cantonment,PK",
    "murree": "Murree,PK",
    "muree": "Murree,PK",
    "bhurban": "Bhurban,PK",
    "kot radha kishan": "Kot Radha Kishan,PK",
    "nankana sahib": "Nankana Sahib,PK",
    "chunian": "Chunian,PK",
    "arifwala": "Arifwala,PK",
    "pakpattan": "Pakpattan,PK",
    "hasilpur": "Hasilpur,PK",
    "yazman": "Yazman,PK",
    "haroonabad": "Haroonabad,PK",
    "chishtian": "Chishtian,PK",
    "fort abbas": "Fort Abbas,PK",
    "ahmadpur east": "Ahmedpur East,PK",
    "ahmedpur east": "Ahmedpur East,PK",

    # Sindh Districts & Cities
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
    "sehwan sharif": "Sehwan,PK",
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
    "islamkot": "Islamkot,PK",
    "badin": "Badin,PK",
    "thatta": "Thatta,PK",
    "sujawal": "Sujawal,PK",
    "matiari": "Matiari,PK",
    "hala": "Hala,PK",
    "tando allahyar": "Tando Allahyar,PK",
    "tando muhammad khan": "Tando Muhammad Khan,PK",
    "shahdadkot": "Shahdadkot,PK",
    "kamber": "Kamber,PK",

    # Federal Capital
    "islamabad": "Islamabad,PK",
    "isb": "Islamabad,PK",
    "islo": "Islamabad,PK",
    "islamabd": "Islamabad,PK",

    # Khyber Pakhtunkhwa (KPK)
    "kpk": "Peshawar,PK",
    "peshawar": "Peshawar,PK",
    "psh": "Peshawar,PK",
    "peshawer": "Peshawar,PK",
    "mardan": "Mardan,PK",
    "swabi": "Swabi,PK",
    "topi": "Topi,PK",
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
    "shogran": "Shogran,PK",
    "nathia gali": "Nathia Gali,PK",
    "ayubia": "Ayubia,PK",
    "battagram": "Battagram,PK",
    "shangla": "Shangla,PK",
    "swat": "Swat,PK",
    "mingora": "Mingora,PK",
    "saidu sharif": "Saidu Sharif,PK",
    "kabal": "Kabal,PK",
    "matta": "Matta,PK",
    "malam jabba": "Malam Jabba,PK",
    "buner": "Buner,PK",
    "daggar": "Daggar,PK",
    "malakand": "Malakand,PK",
    "batkhela": "Batkhela,PK",
    "dir": "Dir,PK",
    "upper dir": "Dir,PK",
    "lower dir": "Timergara,PK",
    "timergara": "Timergara,PK",
    "kumrat": "Kumrat Valley,PK",
    "kumrat valley": "Kumrat Valley,PK",
    "chitral": "Chitral,PK",
    "drosh": "Drosh,PK",
    "booni": "Booni,PK",
    "bajaur": "Khar,PK",
    "mohmand": "Ghalanai,PK",
    "khyber": "Landi Kotal,PK",
    "landikotal": "Landi Kotal,PK",
    "jamrud": "Jamrud,PK",
    "parachinar": "Parachinar,PK",
    "kurram": "Parachinar,PK",
    "miranshah": "Miranshah,PK",
    "wana": "Wana,PK",

    # Balochistan
    "quetta": "Quetta,PK",
    "quata": "Quetta,PK",
    "gwadar": "Gwadar,PK",
    "gawadar": "Gwadar,PK",
    "turbat": "Turbat,PK",
    "kech": "Turbat,PK",
    "pasni": "Pasni,PK",
    "ormara": "Ormara,PK",
    "jiwani": "Jiwani,PK",
    "panjgur": "Panjgur,PK",
    "khuzdar": "Khuzdar,PK",
    "kalat": "Kalat,PK",
    "mastung": "Mastung,PK",
    "pishin": "Pishin,PK",
    "chaman": "Chaman,PK",
    "qila abdullah": "Qila Abdullah,PK",
    "qila saifullah": "Qila Saifullah,PK",
    "ziarat": "Ziarat,PK",
    "loralai": "Loralai,PK",
    "zhob": "Zhob,PK",
    "sibi": "Sibi,PK",
    "kohlu": "Kohlu,PK",
    "dera bugti": "Dera Bugti,PK",
    "hub": "Hub,PK",
    "lasbela": "Bela,PK",
    "bela": "Bela,PK",
    "awaran": "Awaran,PK",
    "kharan": "Kharan,PK",
    "nushki": "Nushki,PK",
    "chagai": "Chagai,PK",
    "dera murad jamali": "Dera Murad Jamali,PK",
    "dera allah yar": "Dera Allah Yar,PK",

    # Gilgit Baltistan
    "gilgit": "Gilgit,PK",
    "skardu": "Skardu,PK",
    "hunza": "Hunza,PK",
    "karimabad": "Karimabad,PK",
    "aliabad": "Aliabad,PK",
    "nagar": "Nagar,PK",
    "chilas": "Chilas,PK",
    "diamer": "Chilas,PK",
    "astore": "Astore,PK",
    "ghizer": "Gahkuch,PK",
    "gahkuch": "Gahkuch,PK",
    "khaplu": "Khaplu,PK",
    "ghanche": "Khaplu,PK",
    "shigar": "Shigar,PK",
    "kharmang": "Kharmang,PK",

    # Azad Jammu & Kashmir (AJK)
    "kashmir": "Muzaffarabad,PK",
    "ajk": "Muzaffarabad,PK",
    "muzaffarabad": "Muzaffarabad,PK",
    "mirpur": "Mirpur,PK",
    "kotli": "Kotli,PK",
    "rawalakot": "Rawalakot,PK",
    "bhimber": "Bhimber,PK",
    "bagh": "Bagh,PK",
    "haveli": "Forward Kahuta,PK",
    "forward kahuta": "Forward Kahuta,PK",
    "pallandri": "Pallandri,PK",
    "sudhanoti": "Pallandri,PK",
    "neelum": "Athmuqam,PK",
    "athmuqam": "Athmuqam,PK",
    "sharda": "Sharda,PK",
    "kel": "Kel,PK",
    "hattian bala": "Hattian Bala,PK",

    # International Cities
    "london": "London,GB",
    "uk": "London,GB",
    "dubai": "Dubai,AE",
    "uae": "Dubai,AE",
    "abu dhabi": "Abu Dhabi,AE",
    "sharjah": "Sharjah,AE",
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
    "oman": "Muscat,OM",
    "bahrain": "Manama,BH",
    "manama": "Manama,BH",
    "istanbul": "Istanbul,TR",
    "turkey": "Istanbul,TR",
    "ankara": "Ankara,TR",
    "new york": "New York,US",
    "nyc": "New York,US",
    "los angeles": "Los Angeles,US",
    "la": "Los Angeles,US",
    "chicago": "Chicago,US",
    "houston": "Houston,US",
    "san francisco": "San Francisco,US",
    "sf": "San Francisco,US",
    "washington": "Washington,US",
    "dc": "Washington,US",
    "toronto": "Toronto,CA",
    "canada": "Toronto,CA",
    "vancouver": "Vancouver,CA",
    "sydney": "Sydney,AU",
    "melbourne": "Melbourne,AU",
    "australia": "Sydney,AU",
    "tokyo": "Tokyo,JP",
    "japan": "Tokyo,JP",
    "beijing": "Beijing,CN",
    "china": "Beijing,CN",
    "shanghai": "Shanghai,CN",
    "kuala lumpur": "Kuala Lumpur,MY",
    "kl": "Kuala Lumpur,MY",
    "malaysia": "Kuala Lumpur,MY",
    "singapore": "Singapore,SG",
    "bangkok": "Bangkok,TH",
    "thailand": "Bangkok,TH",
    "delhi": "Delhi,IN",
    "new delhi": "New Delhi,IN",
    "mumbai": "Mumbai,IN",
    "paris": "Paris,FR",
    "france": "Paris,FR",
    "berlin": "Berlin,DE",
    "germany": "Berlin,DE",
    "rome": "Rome,IT",
    "italy": "Rome,IT",
    "madrid": "Madrid,ES",
    "spain": "Madrid,ES",
    "moscow": "Moscow,RU",
    "russia": "Moscow,RU",
    "cairo": "Cairo,EG",
    "egypt": "Cairo,EG"
}

ALL_KNOWN_KEYS = list(CITY_ALIASES.keys())
ALL_KNOWN_DISPLAY = list(set([v.split(",")[0] for v in CITY_ALIASES.values()] + [k.title() for k in CITY_ALIASES.keys()]))


def _resolve_coordinates(city_name: str):
    """Resolve latitude and longitude using OpenWeatherMap Direct Geocoding API."""
    try:
        geo_url = "https://api.openweathermap.org/geo/1.0/direct"
        params = {"q": city_name, "limit": 1, "appid": WEATHER_API_KEY}
        r = session.get(geo_url, params=params, timeout=6)
        if r.status_code == 200 and r.json():
            geo = r.json()[0]
            return geo.get("lat"), geo.get("lon"), geo.get("name", city_name), geo.get("country", "")
    except Exception:
        pass
    return None, None, None, None


def get_current_weather(city: str) -> dict:
    """Get current weather for a city with multi-tier resolution."""
    c_lower = city.strip().lower()
    target_city = CITY_ALIASES.get(c_lower, city.strip())

    candidates = [target_city]
    if "," not in target_city:
        candidates.append(f"{target_city},PK")

    # 1. Direct API calls
    for cand in candidates:
        try:
            url = "https://api.openweathermap.org/data/2.5/weather"
            params = {"q": cand, "appid": WEATHER_API_KEY, "units": "metric"}
            r = session.get(url, params=params, timeout=6)
            data = r.json()
            if r.status_code == 200:
                return {
                    "success": True,
                    "city": data["name"],
                    "country": data["sys"].get("country", ""),
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
        except Exception:
            pass

    # 2. Geocoding API
    lat, lon, geo_name, geo_country = _resolve_coordinates(target_city)
    if lat is not None and lon is not None:
        try:
            url = "https://api.openweathermap.org/data/2.5/weather"
            params = {"lat": lat, "lon": lon, "appid": WEATHER_API_KEY, "units": "metric"}
            r = session.get(url, params=params, timeout=6)
            data = r.json()
            if r.status_code == 200:
                return {
                    "success": True,
                    "city": geo_name or data["name"],
                    "country": geo_country or data["sys"].get("country", ""),
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
        except Exception:
            pass

    # 3. Fuzzy match fallback
    matches = difflib.get_close_matches(c_lower, ALL_KNOWN_KEYS, n=1, cutoff=0.75)
    if matches and matches[0] != c_lower:
        return get_current_weather(matches[0])

    return {"success": False, "error": f"City '{city}' not found"}


def get_forecast(city: str) -> dict:
    """Get 5-day forecast for a city with multi-tier resolution."""
    c_lower = city.strip().lower()
    target_city = CITY_ALIASES.get(c_lower, city.strip())

    candidates = [target_city]
    if "," not in target_city:
        candidates.append(f"{target_city},PK")

    # 1. Direct API calls
    for cand in candidates:
        try:
            url = "https://api.openweathermap.org/data/2.5/forecast"
            params = {"q": cand, "appid": WEATHER_API_KEY, "units": "metric"}
            r = session.get(url, params=params, timeout=6)
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
                return {
                    "success": True,
                    "city": data["city"]["name"],
                    "country": data["city"].get("country", ""),
                    "forecast": list(daily.values())[:5]
                }
        except Exception:
            pass

    # 2. Geocoding API
    lat, lon, geo_name, geo_country = _resolve_coordinates(target_city)
    if lat is not None and lon is not None:
        try:
            url = "https://api.openweathermap.org/data/2.5/forecast"
            params = {"lat": lat, "lon": lon, "appid": WEATHER_API_KEY, "units": "metric"}
            r = session.get(url, params=params, timeout=6)
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
                return {
                    "success": True,
                    "city": geo_name or data["city"]["name"],
                    "country": geo_country or data["city"].get("country", ""),
                    "forecast": list(daily.values())[:5]
                }
        except Exception:
            pass

    # 3. Fuzzy match fallback
    matches = difflib.get_close_matches(c_lower, ALL_KNOWN_KEYS, n=1, cutoff=0.75)
    if matches and matches[0] != c_lower:
        return get_forecast(matches[0])

    return {"success": False, "error": f"Forecast for '{city}' not found"}


# ============================================================
# Stop Words & Natural Language Parser
# ============================================================
STOP_WORDS = {
    # English stop / query words
    "what", "whats", "what's", "is", "the", "weather", "forecast", "forecasts", "temperature", "temp",
    "temperatures", "tempreture", "tamperature", "in", "at", "for", "of", "to", "from", "today", "tomorrow", "tonight", "now", "current",
    "live", "report", "reports", "update", "updates", "condition", "conditions", "how", "hows", "how's",
    "tell", "me", "please", "plz", "show", "check", "will", "it", "rain", "raining", "sunny",
    "hot", "cold", "humid", "cloudy", "windy", "degree", "degrees", "celsius", "days", "day",
    "5day", "weekly", "week", "and", "or", "vs", "versus", "about", "like", "need", "want",
    "give", "get", "status", "info", "information", "bata", "bhai", "yaar", "sir", "ji", "g",
    "look", "looks", "there", "here", "any", "outside", "near", "around", "trip", "visit", "tour",
    "cities", "city", "cityies", "all", "every", "major", "top", "list", "compare", "comparison",
    "both", "these", "those", "different", "various", "several", "many", "kay", "box", "chatbox", "chat",
    "etc", "etc.", "also", "too",
    # Urdu / Roman Urdu words
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
}

GENERIC_CITIES_KEYWORDS = [
    "tamam shehar", "all cities", "top cities", "major cities", "sheharon ka temperature",
    "cities ka temperature", "pakistan cities", "different cities", "world cities",
    "sab shehar", "shehron ka mosam", "cities overview"
]

DEFAULT_TOP_CITIES = [
    "Islamabad", "Lahore", "Karachi", "Rawalpindi", "Faisalabad",
    "Multan", "Peshawar", "Quetta", "Sialkot", "London", "Dubai"
]


def is_generic_cities_query(query: str) -> bool:
    """Detect if the user is asking generally for all/major cities without specifying names."""
    lower = query.lower().strip()
    for kw in GENERIC_CITIES_KEYWORDS:
        if kw in lower:
            return True

    clean_str = re.sub(r"[^a-zA-Z\s]", " ", lower)
    tokens = [t for t in clean_str.split() if len(t) > 1]
    non_stop = [t for t in tokens if t not in STOP_WORDS]
    # If no non-stop tokens left and contains generic word
    return len(non_stop) == 0 and any(w in lower for w in ["cities", "shehar", "shehron", "all", "tamam"])


def extract_cities_from_query(query: str) -> list:
    """Intelligently extract one or more city names from natural language queries."""
    if not query or not query.strip():
        return []

    text = query.strip()
    lower_text = text.lower()
    extracted = []
    seen = set()

    def add_city(c_name):
        c_clean = c_name.strip()
        c_key = c_clean.lower()
        if c_key and c_key not in seen and c_key not in STOP_WORDS and len(c_clean) > 1:
            seen.add(c_key)
            extracted.append(c_clean)

    # 1. Match multi-word aliases first (e.g., 'rahim yar khan', 'dera ghazi khan', 'new york')
    sorted_multi_aliases = sorted([k for k in CITY_ALIASES.keys() if " " in k], key=len, reverse=True)
    for alias in sorted_multi_aliases:
        pattern = r"\b" + re.escape(alias) + r"\b"
        if re.search(pattern, lower_text):
            target = CITY_ALIASES[alias].split(",")[0]
            add_city(target)
            lower_text = re.sub(pattern, " ", lower_text)

    # 2. Tokenize remaining words & filter stop words
    clean_text = re.sub(r"[^a-zA-Z\s]", " ", lower_text)
    tokens = [t for t in clean_text.split() if len(t) > 1 and t not in STOP_WORDS]

    for t in tokens:
        if t in CITY_ALIASES:
            add_city(CITY_ALIASES[t].split(",")[0])
        else:
            # Fuzzy match against known aliases/cities
            matches = difflib.get_close_matches(t, ALL_KNOWN_KEYS, n=1, cutoff=0.75)
            if matches:
                target = CITY_ALIASES[matches[0]].split(",")[0]
                add_city(target)
            elif len(t) >= 3 and t not in STOP_WORDS:
                add_city(t.title())

    return extracted


def extract_city_from_query(query: str) -> str:
    """Extract first city name for backward compatibility."""
    cities = extract_cities_from_query(query)
    return cities[0] if cities else ""


# ============================================================
# Qwen Agent & Multi-City Fetcher
# ============================================================
QWEN_ENDPOINT = os.getenv("QWEN_ENDPOINT_URL", "https://api-inference.huggingface.co/models/Qwen/Qwen3.8-2.4T-A95B")
QWEN_API_KEY = os.getenv("HUGGINGFACEHUB_API_TOKEN") or os.getenv("HF_TOKEN") or ""


def get_multiple_cities_weather(cities: list) -> str:
    """Fetch live temperature and conditions for multiple cities concurrently."""
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=min(10, len(cities))) as executor:
        future_to_city = {executor.submit(get_current_weather, c): c for c in cities}
        for future in concurrent.futures.as_completed(future_to_city):
            orig_city = future_to_city[future]
            try:
                data = future.result()
                if data and data.get("success"):
                    results[orig_city] = data
            except Exception:
                pass

    if not results:
        return "❌ Sheharon ka mosam fetch karne mein masla pesh aaya. Barah-e-karam shehar ka naam check karein."

    lines = ["🌍 **Sheharon (Cities) ka Live Temperature & Mosam Update:**\n"]
    temps = []

    for c in cities:
        if c in results:
            res = results[c]
            city_label = f"{res['city']}" + (f", {res['country']}" if res.get('country') else "")
            temp = res['temp']
            feels = res['feels_like']
            cond = res['condition']
            hum = res['humidity']
            wind = res['wind_speed']

            emoji = "☀️"
            cond_l = cond.lower()
            if "rain" in cond_l or "drizzle" in cond_l:
                emoji = "🌧️"
            elif "cloud" in cond_l:
                emoji = "⛅"
            elif "thunder" in cond_l or "storm" in cond_l:
                emoji = "⛈️"
            elif "snow" in cond_l:
                emoji = "❄️"
            elif "fog" in cond_l or "mist" in cond_l or "haze" in cond_l:
                emoji = "🌫️"

            lines.append(f"  • 🏙️ **{city_label}:** **{temp}°C** | {cond} {emoji} *(Feels like {feels}°C | Humidity: {hum}% | Wind: {wind} km/h)*")
            temps.append((res['city'], temp))

    if len(temps) > 1:
        warmest = max(temps, key=lambda x: x[1])
        coolest = min(temps, key=lambda x: x[1])
        lines.append(f"\n📊 **Khulasa (Summary):**")
        lines.append(f"  🔥 **Sab se garam:** {warmest[0]} ({warmest[1]}°C)")
        lines.append(f"  ❄️ **Sab se thanda:** {coolest[0]} ({coolest[1]}°C)")

    lines.append("\n💡 *Kisi specific shehar ka 5-din forecast ya tafseel dekhne ke liye likhein, maslan: 'Lodhran forecast' ya 'Vehari weather'*")
    return "\n".join(lines)


def ask_qwen_agent(user_query: str) -> str:
    """
    Main agent function: dynamically detects single/multiple cities or generic cities query,
    fetches real weather, and generates an intelligent response.
    """
    query_lower = user_query.lower()

    # 1. Check if user is asking for generic cities overview
    if is_generic_cities_query(user_query):
        return get_multiple_cities_weather(DEFAULT_TOP_CITIES)

    # 2. Extract cities from query
    cities = extract_cities_from_query(user_query)

    # If no city detected at all in user's query
    if not cities:
        return (
            "🤖 **Weather Assistant:**\n\n"
            "Aap kis shehar (city) ka mosam jaanna chahte hain? 🌦️\n\n"
            "Barah-e-karam shehar ka naam likhein ya tamam cities ka temperature poochein:\n"
            "• **Lodhran, Karachi, Vehari** ka temperature\n"
            "• **Lahore aur Islamabad** ka mosam\n"
            "• **Peshawar** 5-din forecast\n"
            "• **Sialkot** ka mosam kaisa hai?"
        )

    # 3. If multiple cities detected, return multi-city comparison
    if len(cities) > 1:
        return get_multiple_cities_weather(cities)

    # 4. Single city detailed response
    city = cities[0]

    # Determine if forecast or current weather
    is_forecast = any(word in query_lower for word in ["forecast", "week", "days", "upcoming", "kal", "aane wala", "future", "5 din", "5-din"])

    if is_forecast:
        result = get_forecast(city)
        if not result["success"]:
            return f"❌ **{city}** ka forecast data nahi mil saka: {result.get('error', 'City not found')}\nBarah-e-karam shehar ka naam ya spelling check karein."

        forecast_text = "\n".join([
            f"  • {d['date']}: {d['temp']}°C | {d['condition']} | Humidity: {d['humidity']}% | Wind: {d['wind_speed']} km/h"
            for d in result["forecast"]
        ])
        weather_block = f"📅 **5-Din ki Forecast ({result['city']}):**\n{forecast_text}"
    else:
        result = get_current_weather(city)
        if not result["success"]:
            return f"❌ **{city}** shehar ka mosam nahi mil saka: {result.get('error', 'City not found')}\nBarah-e-karam shehar ka naam ya spelling check karein."

        weather_block = (
            f"🌍 **{result['city']}, {result['country']} ka Mosam:**\n"
            f"  • Halat: {result['condition']}\n"
            f"  • Temperature: {result['temp']}°C (Feels like {result['feels_like']}°C)\n"
            f"  • Min / Max: {result['temp_min']}°C / {result['temp_max']}°C\n"
            f"  • Humidity (Namee): {result['humidity']}%\n"
            f"  • Wind Speed: {result['wind_speed']} km/h\n"
            f"  • Cloud Cover: {result['clouds']}%\n"
            f"  • Pressure: {result['pressure']} hPa"
        )

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
                        return f"🤖 **Qwen AI Response:**\n\n{weather_block}\n\n💬 **Analysis:**\n{llm_text}"
        except Exception:
            pass

    # Smart response with weather advice
    temp = result.get("temp", 25) if (result.get("success") and "temp" in result) else (result["forecast"][0]["temp"] if result.get("success") and "forecast" in result and result["forecast"] else 25)
    humidity = result.get("humidity", 50) if (result.get("success") and "humidity" in result) else 50
    condition = result.get("condition", "").lower() if (result.get("success") and "condition" in result) else ""

    advice = []
    if temp > 35:
        advice.append("Bohat garmi hai! Halke aur dheelay kapray pehnen aur khoob paani piyein. 💧")
    elif temp > 28:
        advice.append("Achi garmi hai. Cotton kapray suitable hain. Dhoop mein sunscreen zaroori hai. ☀️")
    elif temp < 15:
        advice.append("Thand hai! Jacket ya sweater pehanna zaroori hai. 🧥")
    else:
        advice.append("Mosam khushgawar hai. Normal kapray munasib hain. 🌤️")

    if humidity > 75:
        advice.append("Namee (Humidity) ziada hai — hydration ka khayal rakhein.")
    if "rain" in condition or "drizzle" in condition:
        advice.append("Barish ka imkaan hai! Chatri (Umbrella) zaroor sath rakhein. ☂️")
    if "clear" in condition or "sunny" in condition:
        advice.append("Khula aasman aur dhoop hai. ☀️")

    return f"🤖 **Weather Agent:**\n\n{weather_block}\n\n💡 **Mashwara:**\n" + "\n".join(f"  • {a}" for a in advice)

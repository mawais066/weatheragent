# 🌦️ LangChain Weather Agent (Qwen LLM)

Yeh aik Python Weather Agent hai jo **LangChain**, **Qwen LLM (`Qwen/Qwen3.8-2.4T-A95B`)**, aur **OpenWeatherMap API** ko use karta hai.

---

## 📁 Project Structure

```
weather agent/
│
├── weather_tools.py   # OpenWeatherMap API tools (Current weather & 5-day forecast)
├── agent.py           # LangChain Agent initialization (Tool calling with Qwen)
├── main.py            # CLI & interactive chat interface
├── .env               # API keys and Model configurations
└── requirements.txt   # Required Python libraries
```

---

## ⚙️ Setup & Installation

### 1. Dependencies Install karein:
```bash
pip install -r requirements.txt
```

### 2. `.env` File Configure karein:
File `.env` open karein aur apna LLM API key add karein:

```env
OPENWEATHERMAP_API_KEY=your_openweather_api_key_here
MODEL_NAME=Qwen/Qwen3.8-2.4T-A95B
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=your_openrouter_or_llm_api_key_here
```

> **Note on Providers:**
> - Agar aap **OpenRouter** use kar rahe hain to `OPENAI_BASE_URL=https://openrouter.ai/api/v1` aur `OPENAI_API_KEY=sk-or-v1-...` set karein.
> - Agar aap **Ollama** (Local Qwen) use kar rahe hain to `OPENAI_BASE_URL=http://localhost:11434/v1` aur `OPENAI_API_KEY=ollama` set karein.
> - Agar aap **HuggingFace** use kar rahe hain to `OPENAI_BASE_URL=https://api-inference.huggingface.co/v1` aur HF token set karein.

---

## 🚀 Run the Agent

### Interactive Chat Mode:
```bash
python main.py
```

### Single Query Mode:
```bash
python main.py "Lahore ka mosam kaisa hai aur kya mujhe jacket pehanni chahiye?"
```

---

## 🌟 Features

- **Live Weather Updates:** Temperature (°C), Feels Like, Humidity, Wind Speed, Cloud Cover, and Pressure.
- **5-Day Weather Forecast:** Daily forecasts for planning trips.
- **Intelligent Recommendations:** Qwen LLM interprets weather conditions and advises on clothing, travel, rain precautions, etc.
- **Chat History Support:** Remembers previous questions in the conversation.

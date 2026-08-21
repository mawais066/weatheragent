"""
Weather Agent - Flask Web Server
Powered by Qwen/Qwen3.8-2.4T-A95B + OpenWeatherMap
"""
from flask import Flask, render_template, request, jsonify
from agent import ask_qwen_agent, get_current_weather, get_forecast

app = Flask(__name__, template_folder="templates", static_folder=".", static_url_path="")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/weather")
def weather():
    city = request.args.get("city", "Lahore")
    current = get_current_weather(city)
    forecast = get_forecast(city)
    return jsonify({"current": current, "forecast": forecast})


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"error": "Empty message"}), 400
    reply = ask_qwen_agent(user_message)
    return jsonify({"reply": reply})


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    print("=" * 60)
    print(f"  Weather Agent Running on port {port}!")
    print("=" * 60)
    app.run(host="0.0.0.0", port=port, debug=False)


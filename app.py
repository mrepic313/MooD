from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from flask import Flask, request, jsonify, render_template
import requests
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")


pipe = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions")

app = Flask(__name__)

def gemini_api(emotions):
    emotion_text = ", ".join(f"{emotion}: {score:.2f}" for emotion, score in emotions)
    prompt = f"The following emotions are prevalent: {emotion_text}. What activities should I perform based on these emotions? Please do not use markdown in this response."
    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content(prompt)
        print("Gemini API response:", response)

        feedback_text = response.candidates[0].content.parts[0].text
        return feedback_text
    except Exception as e:
        print("Error calling Gemini API:", e)
        return {"error": str(e)}

def analyze_emotions(text):
    results = pipe(text, top_k=None)  
    emotion_counts = {}

    for result in results:
        emotion = result['label']
        score = result['score']
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + score

    prevalent_emotions = sorted(emotion_counts.items(), key=lambda x: x[1], reverse=True)
    top_5_emotions = prevalent_emotions[:5]
    return top_5_emotions

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['file']
    if file:
        text = file.read().decode("utf-8")
        emotions = analyze_emotions(text)
        feedback = gemini_api(emotions)
        feedback_filename = "feedback.txt"
        with open(feedback_filename, "w") as f:
            f.write(feedback)

        return jsonify({
            "emotions": emotions,
            "feedback": feedback
        })

    return jsonify({"error": "No file uploaded"}), 400

if __name__ == '__main__':
    app.run(debug=True)

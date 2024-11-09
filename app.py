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
    prompt = f"Based on the emotions: {emotion_text}, what is your advice?"

    try:
        response = genai.generate_text(model="gemini-1.5-flash", prompt=prompt)
        return response['text'] if 'text' in response else "No response text found"
    except Exception as e:
        return {"Error": str(e)}

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
        return jsonify({
            "emotions": emotions,
            "feedback": feedback
        })

    return jsonify({"error": "No file uploaded"}), 400

if __name__ == '__main__':
    app.run(debug=True)

from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from flask import Flask, request, jsonify, render_template
import requests
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key='AIzaSyAAootsUofMe5Z6BOe0rWP8ZZ87_-eqJlE')

pipe = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions")

app = Flask(__name__)

def gemini_api(emotions):
    emotion_text = ", ".join(f"{emotion}: {score:.2f}" for emotion, score in emotions)
    prompt = (
        f"A user's recent journal entry reveals the following emotions and intensities: {emotion_text}. "
        "Please provide thoughtful and supportive advice tailored to help the user. "
        "Your response should acknowledge the mixed emotions and offer guidance that encourages well-being, "
        "suggests helpful actions, or provides comforting words. Eliminate All the asterisks in the output text and format the response."
    )


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
    return prevalent_emotions


@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()  # Use request.get_json() to read JSON data
    if not data or 'content' not in data:
        return jsonify({"error": "Content is required"}), 400
    content = data['content']
    emotions = analyze_emotions(content)
    feedback = gemini_api(emotions)
    return jsonify({
        "emotions": emotions,
        "suggestion": feedback
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)

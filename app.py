from transformers import pipeline
from flask import Flask, request, jsonify, render_template

pipe = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions")

app = Flask(__name__)

def analyze_emotions(text):
    results = pipe(text, top_k=None)  
    emotion_counts = {}

    for result in results:
        emotion = result['label']
        score = result['score']
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + score

    prevalent_emotions = sorted(emotion_counts.items(), key=lambda x: x[1], reverse=True)
    return prevalent_emotions

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()  # Use request.get_json() to read JSON data
    if data and 'content' in data:
        text = data['content']
        emotions = analyze_emotions(text)
        return jsonify(emotions)

    return jsonify({"error": "Content not provided"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)

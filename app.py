from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
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
    file = request.files['file']
    if file:
        text = file.read().decode("utf-8")
        emotions = analyze_emotions(text)
        return jsonify(emotions)

    return jsonify({"error": "No file uploaded"}), 400

if __name__ == '__main__':
    app.run(debug=True)

# MooD

MooD is your next best friend and the only mental health app you'll ever need. Featuring your own personal journals that are encrypted and your own personal AI that can suggest mood-boosting activities and ensure your emotional wellbeing

## Features

- An AI-powered chatbot that users can interact with to reflect on their day, discuss emotions, or ask for advice. The Chatbot’s tone adapts to the user’s mood, offering empathetic or cheerful responses based on the context.
- Analyze the user's entries for mood-indicative keywords and phrases to gauge the user’s overall emotional state.
- Mood Insight Dashboard and schedule for better planning and organization
- Strong data encryption and privacy options, ensuring that users’ diary entries and mood data remain confidential, with biometric data or a custom PIN


## Technologies Used

- **Frontend:** Built using React, CSS and JavaScript
- **Backend:** Built using Python, PyTorch, TensorFlow, and JavaScript
- **Database:** Built using MongoDB
- **Custom Trained Text Classification Model:** Meta's roBERTa-base (https://github.com/facebookresearch/fairseq/tree/main/examples/roberta)
- **Dataset and Chatbot:** Google Gemini AI for Chatbot and Emotions Dataset (https://huggingface.co/datasets/google-research-datasets/go_emotions)

## Team Members

- Gavin Wang
- Patrick Sun
- Frank Sun
- Joshua Hoang

## Getting Started

To get started with MooD, you can follow these steps:

1.  Clone the repository: git clone https://github.com/yourusername/MooD.git
2.  Navigate to the project directory: cd MooD
3.  Install dependencies:
4.    Frontend: npm install
5.  Start the frontend and backend servers:
6.    Frontend: npm start
7.  Access the application in your browser at http://localhost:5002.

## Contributing

We welcome suggestions and contributions from the community to improve Moo-D. To contribute, follow these steps:

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/NewFeature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/NewFeature`
5. Submit a pull request.

Please ensure your code adheres to our coding standards and practices.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

Thanks to the following groups:
- Meta for the roBERTa text classification model
- Google for the emotion dataset used to train the model
- Open-source contributors for their contributions to the tools and libraries used in this project.

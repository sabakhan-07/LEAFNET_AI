from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
# Enable CORS so your HTML file can communicate with this server
CORS(app)

# PASTE YOUR GEMINI API KEY HERE
GEMINI_API_KEY = "AIzaSyCg9MSYDgerdZmsIb22bpAPvG7-g33CNas" 
genai.configure(api_key=GEMINI_API_KEY)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    selected_model = data.get('model', 'chatgpt') # 'chatgpt' is just your default UI dropdown value

    if not user_message:
        return jsonify({'error': 'Message is required'}), 400

    # System prompts to simulate the different agricultural models
    system_prompts = {
        'chatgpt': "You are a helpful general agricultural assistant.",
        'agrillm': "You are AgriLLM, trained by CGIAR. Provide advisory services for farmers in the Global South. Focus on practical, low-cost farming techniques.",
        'agrigpt': "You are AgriGPT, using a Tri-RAG framework. Provide highly technical, step-by-step reasoning for crop disease diagnosis and soil management.",
        'agrimllm': "You are AgriM-LLM, specializing in multimodal vision and crop diseases. When answering, assume the user is describing visual symptoms on leaves or stems."
    }

    prompt = system_prompts.get(selected_model, system_prompts['chatgpt'])

    try:
        # Initialize the Gemini model with the specific persona instruction
        # We use gemini-1.5-flash as it is lightning fast and perfect for chat
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            system_instruction=prompt
        )
        
        # Call the Gemini API
        response = model.generate_content(user_message)
        
        return jsonify({'reply': response.text})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Runs the server on port 5000
    app.run(debug=True, port=5000)

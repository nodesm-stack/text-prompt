from flask import Flask, request, jsonify
from flask_cors import CORS
from config import API_KEY, MODEL_URL
from prompt_templates import enhance_prompt
from gemini import generate_gemini_content
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True, allow_headers="*")
import argparse

@app.route('/api/gemini', methods=['POST'])
def gemini_api():
    
    data = request.json
    prompt = data.get('prompt', '')
    prompt = enhance_prompt(prompt)
    result = generate_gemini_content(prompt, API_KEY, MODEL_URL)
    # Extract and print only the LLM response text
    try:
        llm_text = result['candidates'][0]['content']['parts'][0]['text']
        print(llm_text.strip())
    except (KeyError, IndexError, TypeError):
        print("Error: Unexpected response format.")
        llm_text = "Error: Unexpected response format."
    # Ensure llm_text is always a string
    if not isinstance(llm_text, str):
        llm_text = str(llm_text)
    # Return as a JSON object with the key 'optimizedPrompt' for frontend compatibility
    return jsonify({
        'optimizedPrompt': llm_text
    })

if __name__ == '__main__':
    app.run(port='5050')

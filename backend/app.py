from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True, allow_headers="*")


@app.route('/api/optimize', methods=['POST', 'OPTIONS'])
def optimize():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.json
    prompt = data.get('prompt', '')
    if not prompt.strip():
        return jsonify({'error': 'Prompt is empty'}), 400
    # Dummy analysis logic
    print(f"Received prompt: {prompt}")
    return jsonify({
        'clarity': 7,
        'specificity': 8,
        'context': 6,
        'optimizedPrompt': prompt + ' (Optimized)'
    })

if __name__ == '__main__':
    app.run(port='5000')

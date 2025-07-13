from flask import Blueprint, request, jsonify
from llm.llm import generate_response
from _pinecone.retreiver import upsert_text_to_pinecone

llm_bp = Blueprint('llm_bp', __name__)

@llm_bp.route('/llm/query', methods=['POST'])
def llm_query():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be a JSON object"}), 400
    if 'topic' not in data or 'sub_topics' not in data:
        return jsonify({"error": "Request body must contain 'topic' (string) and 'sub_topics' (list)"}), 400

    try:
        response = generate_response(data)

        # Split the response by comma and pass the list to upsert_text_to_pinecone
        response_list = response.split(',')
        upsert_text_to_pinecone(response_list)

        return jsonify({"response": response_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500 
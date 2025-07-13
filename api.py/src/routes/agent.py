import os
from flask import Blueprint, request, jsonify
from _pinecone.retreiver import get_retrieval_results

agents_bp = Blueprint('agents_bp', __name__)

@agents_bp.route('/search/keywords', methods=['POST'])
def retrive_keywords():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be a JSON object"}), 400

    if 'keywords' not in data:
        return jsonify({"error": "Request body must contain 'keywords' as a JSON array of strings"}), 400
    
    keywords_list = data["keywords"]

    results = get_retrieval_results(keywords_list)

    return jsonify({"response": results}), 201

import os
from flask import Blueprint, request, jsonify
from _pinecone.retreiver import query_keywords_from_pinecone, search_keywords

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
    
    # Optional parameters for the new method (removed top_k)
    similarity_threshold = data.get("similarity_threshold", 0.2)
    namespace = data.get("namespace", "")

    try:
        # Use the new query_keywords_from_pinecone method
        results = query_keywords_from_pinecone(
            keywords=keywords_list,
            similarity_threshold=similarity_threshold,
            namespace=namespace
        )
        
        return jsonify({
            "response": results,
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@agents_bp.route('/search/keywords-direct', methods=['POST'])
def search_keywords_direct():
    """
    Direct keyword search using Pinecone index - returns raw text content.
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be a JSON object"}), 400

    if 'keywords' not in data:
        return jsonify({"error": "Request body must contain 'keywords' as a JSON array of strings"}), 400
    
    keywords_list = data["keywords"]
    
    # Optional parameters
    top_k = data.get("top_k", 5)
    similarity_threshold = data.get("similarity_threshold", 0.0)
    namespace = data.get("namespace", "")

    try:
        results = search_keywords(
            keywords=keywords_list,
            top_k=top_k,
            similarity_threshold=similarity_threshold,
            namespace=namespace
        )
        
        return jsonify({
            "success": True,
            "response": results,
            "count": len(results),
            "query_info": {
                "keywords": keywords_list,
                "top_k": top_k,
                "similarity_threshold": similarity_threshold,
                "namespace": namespace
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

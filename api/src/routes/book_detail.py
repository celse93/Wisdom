from flask import jsonify, request
import requests
import os
from flask_jwt_extended import jwt_required
import re
import json


google_books_url = "https://www.googleapis.com/books/v1/"

def book_detail_route(app):
    @jwt_required()
    @app.route("/book_detail/<path:path>", methods=["GET"])
    def book_detail(path):
        url = f"{google_books_url}{path}"
        params = dict(request.args)
        api_key = os.getenv("GOOGLE_API_KEY")
        
        if not api_key:
             return jsonify({"error": "GOOGLE_API_KEY not found in environment variables."}), 500
        
        params["key"] = api_key

        try:
            response = requests.get(url, params=params, timeout=10)

            book = response.json()
            volume_info = book.get("volumeInfo", {})
            image_links = volume_info.get("imageLinks", {})
            description_data = volume_info.get("description", "")
            
            # Regex to find content between < > and replaces with nothing
            cleaned_text = re.sub('<[^>]+>', '', description_data) 
            
            # Replaces multiple spaces with a single space.
            cleaned_text = re.sub(r'\s{2,}', ' ', cleaned_text).strip()

            results = {
                "author": volume_info.get("authors", ["N/A"]),
                "description": cleaned_text,
                "title": volume_info.get("title", "N/A"),
                "cover": image_links.get("thumbnail", "N/A"),
                "book_id": book.get("id", "N/A"),
                "publish_year": volume_info.get("publishedDate", "N/A"),
            }
            return jsonify(results), response.status_code
        except requests.RequestException:
            return jsonify({"error": "Failed to fetch from OpenLibrary."}), 502

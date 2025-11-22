import requests
from flask import request, jsonify
import os
from flask_jwt_extended import jwt_required

google_books_url = "https://www.googleapis.com/books/v1/"

def books_search_routes(app):
    @jwt_required()
    @app.route("/books_search/<path:path>", methods=["GET"])
    def search_books(path):
        url = f"{google_books_url}{path}"
        params = dict(request.args)
        params["printType"] = "books"
        params["projection"] = "lite"
        api_key = os.getenv("GOOGLE_API_KEY")
        
        if not api_key:
             return jsonify({"error": "GOOGLE_API_KEY not found in environment variables."}), 500
        
        params["key"] = api_key

        try:
            response = requests.get(url, params=params, timeout=10)

            if response.status_code != 200:
                return jsonify(
                    {"error": "Failed to get the information from OpenLibrary"}
                ), response.status_code

            data = response.json()
            
            if "items" not in data:
                return jsonify({"message": "Search successful, but no books found.", "data": data}), 200

            books = data["items"]
            results = []

            for book in books:
                volume_info = book.get("volumeInfo", {})
                image_links = volume_info.get("imageLinks", {})
                image_link = image_links.get("thumbnail", "N/A")
                image = image_link.replace("http", "https")
                
                results.append(
                    {
                        "title": volume_info.get("title", "N/A"),
                        "author": volume_info.get("authors", ["N/A"]),
                        "publish_year": volume_info.get("publishedDate", "N/A"),
                        "image": image,
                        "book_id": book.get("id", "N/A"),
                        "description": volume_info.get("description", "N/A"),
                    }
                )
            return jsonify(results), response.status_code

        except Exception as e:
            return jsonify({"error": f"Unexpected error: {str(e)}"}), 500



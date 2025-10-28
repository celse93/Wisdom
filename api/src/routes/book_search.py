import requests
from flask import request, jsonify
import os
from flask_jwt_extended import jwt_required

open_library_url = "https://www.googleapis.com/books/v1/"

def books_search_routes(app):
    @jwt_required()
    @app.route("/books_search/<path:path>", methods=["GET"])
    def search_books(path):
        url = f"{open_library_url}{path}"
        print(url)
        params = dict(request.args)
        api_key = os.getenv("GOOGLE_API_KEY")
        params["key"] = api_key
        print(params)

        try:
            response = requests.get(url, params=params, timeout=10)

            if response.status_code != 200:
                return jsonify(
                    {"error": "Failed to get the information from OpenLibrary"}
                ), response.status_code

            data = response.json()
            books = data["items"]
            results = []

            for x in range(8):
                results.append(
                    {
                        "title": books[x]["title"],
                        "author": books[x]["authors"][0],
                        "first_publish_year": books[x]["publishedDate"],
                        "cover_id": books[x]["imageLinks"]["thumbnail"],
                        "book_id": books[x]["id"],
                    }
                )
            return jsonify(books), response.status_code

        except Exception as e:
            return jsonify({"error": f"Unexpected error: {str(e)}"}), 500



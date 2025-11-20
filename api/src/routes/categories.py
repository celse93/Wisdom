from flask import request, jsonify
from src.db import db
from src.models.models import Categories, Users
from sqlalchemy import select
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)


def categories_routes(app):
    @app.route("/categories", methods=["GET", "POST"])
    @jwt_required()
    def all_categories():
        # method to create new categories
        if request.method == "POST":
            data = request.get_json()
            user_id = get_jwt_identity()

            if not data["labels"]:
                return jsonify({"error": "Missing required fields"}), 400

            labels = data["labels"]

            user = db.session.execute(
                select(Users).where(
                    Users.id == user_id,
                )
            ).scalar_one_or_none()

            if not user:
                return jsonify({"error": "Not user"}), 404

            new_labels = [Categories(label=label) for label in labels]
            db.session.bulk_save_objects(new_labels)
            db.session.commit()

            return jsonify({"message": "Labels saved successfully"}), 201

        # method to GET all categories
        if request.method == "GET":
            categories = db.session.execute(select(Categories)).scalars().all()

            if not categories:
                return jsonify({"error": "Categories list was not found."}), 404

            response_body = [category.serialize() for category in categories]

            return jsonify(response_body), 200

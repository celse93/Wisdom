from flask import request, jsonify
from src.db import db
from src.models.models import Profiles
from sqlalchemy import select
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)


def profiles_routes(app):
    @app.route("/profiles/user", methods=["PATCH", "GET"])
    @jwt_required()
    def profile():
        # method for updating profile
        if request.method == "PATCH":
            data = request.get_json()
            required_fields = ["username"]

            if not any(field in data for field in required_fields):
                return jsonify({"error": "Missing required fields"}), 400

            username = data["username"]
            user_id = get_jwt_identity()

            update_profile = db.session.get(Profiles, user_id)
            update_profile.username = username
            db.session.commit()

            return jsonify({"message": "Profile updated successfully"}), 201

        # method to get profiles by name
        elif request.method == "GET":
            user_id = get_jwt_identity()
            profile = db.session.get(Profiles, user_id)

            if not profile:
                return jsonify(
                    {"error": f"Profile with ID {user_id} was not found."}
                ), 404

            response_body = profile.serialize()

            return jsonify(response_body), 200

    @app.route("/profiles", methods=["GET"])
    @jwt_required()
    def all_profiles():
        profiles = db.session.execute(select(Profiles)).scalars().all()

        if not profiles:
            return jsonify({"error": "Profiles list was not found."}), 404

        response_body = [profile.serialize() for profile in profiles]

        return jsonify(response_body), 200

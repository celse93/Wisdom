from flask import request, jsonify
from src.db import db
from src.models.models import Recommendations
from datetime import date
import datetime
from sqlalchemy import select, and_
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)


def recommendations_routes(app):
    @app.route("/recommendations/user", methods=["POST", "DELETE", "GET"])
    @jwt_required()
    def recommendations():
        # method to save book in Recommendation
        if request.method == "POST":
            data = request.get_json()
            book_id = data["book_id"]
            user_id = get_jwt_identity()

            if not book_id:
                return jsonify({"error": "Missing book ID"}), 400

            existing_book = db.session.execute(
                select(Recommendations).where(
                    and_(
                        Recommendations.user_id == user_id,
                        Recommendations.book_id == book_id,
                    )
                )
            ).scalar_one_or_none()

            if existing_book:
                return jsonify({"error": "Book already registered"}), 400

            new_book = Recommendations(
                book_id=book_id, user_id=user_id, content_type="recommendation"
            )
            db.session.add(new_book)
            db.session.commit()
            return jsonify({"message": "Book saved successfully"}), 201

        # method to delete book from Recommendation
        elif request.method == "DELETE":
            data = request.get_json()
            book_id = data["book_id"]
            user_id = get_jwt_identity()

            existing_book = db.session.execute(
                select(Recommendations).where(
                    and_(
                        Recommendations.user_id == user_id,
                        Recommendations.book_id == book_id,
                    )
                )
            ).scalar_one_or_none()

            if not existing_book:
                return jsonify(
                    {"error": f"Book ID {book_id} isn't on this user's list."}
                ), 404

            delete_book = db.session.get(Recommendations, existing_book.id)
            db.session.delete(delete_book)
            db.session.commit()
            return jsonify({"message": "Book deleted successfully"}), 200

        # method to get all books from Recommendation list of a user
        elif request.method == "GET":
            user_id = get_jwt_identity()
            recommendations = (
                db.session.execute(
                    select(Recommendations).where(Recommendations.user_id == user_id)
                )
                .scalars()
                .all()
            )

            if not recommendations:
                return jsonify({"error": "Recommendation list not found"}), 404

            response_body = [item.serialize() for item in recommendations]
            return jsonify(response_body), 200

    @app.route("/recommendations", methods=["GET"])
    @jwt_required()
    def all_recommendations():
        today = date.today()
        last_week = datetime.datetime(today.year, today.month, today.day -7) 
        recommendations = (
            db.session.execute(
                select(Recommendations).where(
                    Recommendations.created_at >= last_week
                )
            )
            .scalars()
            .all()
        )
        if not recommendations:
            return jsonify({"error": "Recommendation list not found"}), 404

        response_body = [item.serialize() for item in recommendations]
        return jsonify(response_body), 200
    
    @app.route("/recommendations/follow/<int:followId>", methods=["GET"])
    @jwt_required()
    def follow_recommendations(followId):
        recommendations = (
            db.session.execute(
                select(Recommendations).where(
                    Recommendations.user_id == followId
                )
            )
            .scalars()
            .all()
        )
        if not recommendations:
            return jsonify({"error": "Recommendation list not found"}), 404

        response_body = [item.serialize() for item in recommendations]
        return jsonify(response_body), 200

from flask import request, jsonify
from src.db import db
from src.models.models import Reviews
from datetime import date
import datetime
from sqlalchemy import select, and_
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)


def reviews_routes(app):
    @app.route("/reviews/user", methods=["POST", "DELETE", "GET", "PATCH"])
    @jwt_required()
    def reviews():
        # method to save review in Review list
        if request.method == "POST":
            data = request.get_json()
            required_fields = ["book_id", "text"]
            user_id = get_jwt_identity()

            if not all(field in data for field in required_fields):
                return jsonify({"error": "Missing required fields"}), 400

            book_id = data["book_id"]
            text = data["text"]

            existing_book = db.session.execute(
                select(Reviews).where(
                    and_(
                        Reviews.user_id == user_id,
                        Reviews.book_id == book_id,
                    )
                )
            ).scalar_one_or_none()

            if existing_book:
                return jsonify({"error": "Book already rated"}), 400

            new_book = Reviews(
                text=text, book_id=book_id, user_id=user_id, content_type="review"
            )
            db.session.add(new_book)
            db.session.commit()
            return jsonify({"message": "Review saved successfully"}), 201

        # method to update review in Review list
        elif request.method == "PATCH":
            data = request.get_json()
            required_fields = ["book_id", "text"]

            if not any(field in data for field in required_fields):
                return jsonify({"error": "Missing at least one required field"}), 400

            book_id = data["book_id"]
            text = data["text"]
            user_id = get_jwt_identity()

            existing_review = db.session.execute(
                select(Reviews).where(
                    and_(Reviews.user_id == user_id, Reviews.book_id == book_id)
                )
            ).scalar_one_or_none()

            if not existing_review:
                return jsonify(
                    {"error": "Book review doesn't exist for this user."}
                ), 400

            existing_review.text = text
            db.session.commit()

            return jsonify({"message": "Review updated successfully"}), 201

        # method to delete review from Review list
        elif request.method == "DELETE":
            data = request.get_json()
            book_id = data["book_id"]
            user_id = get_jwt_identity()

            existing_book = db.session.execute(
                select(Reviews).where(
                    and_(Reviews.user_id == user_id, Reviews.book_id == book_id)
                )
            ).scalar_one_or_none()

            if not existing_book:
                return jsonify(
                    {"error": f"Book ID {book_id}  isn't on this user's list."}
                ), 404

            delete_book = db.session.get(Reviews, existing_book.id)
            db.session.delete(delete_book)
            db.session.commit()

            return jsonify({"message": "Book deleted successfully"}), 200

        # method to get all books from Review list of a user
        elif request.method == "GET":
            user_id = get_jwt_identity()
            review_list = (
                db.session.execute(select(Reviews).where(Reviews.user_id == user_id))
                .scalars()
                .all()
            )
            if not review_list:
                return jsonify({"error": "Review list not found"}), 404

            response_body = [item.serialize() for item in review_list]

            return jsonify(response_body), 200

    @app.route("/reviews", methods=["GET"])
    @jwt_required()
    def all_reviews():
        today = date.today()
        last_week = datetime.datetime(today.year, today.month, today.day -7) 
        review_list = (
            db.session.execute(
                select(Reviews).where(Reviews.created_at >= last_week)
            )
            .scalars()
            .all()
        )
        if not review_list:
            return jsonify({"error": "Review list not found"}), 404

        response_body = [item.serialize() for item in review_list]

        return jsonify(response_body), 200

from flask import request, jsonify
from src.db import db
from src.models.models import Quotes
from datetime import date, timedelta
import datetime
from sqlalchemy import select, and_
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)


def quotes_routes(app):
    @app.route("/quotes/user", methods=["POST", "DELETE", "GET"])
    @jwt_required()
    def quotes():
        # method to save book in Quote list
        if request.method == "POST":
            data = request.get_json()
            required_fields = ["book_id", "text", "category_id"]
            user_id = get_jwt_identity()

            if not all(field in data for field in required_fields):
                return jsonify({"error": "Missing required fields"}), 400

            book_id = data["book_id"]
            text = data["text"]
            category_id = data["category_id"]

            new_quote = Quotes(
                book_id=book_id,
                user_id=user_id,
                text=text,
                category_id=category_id,
                content_type="quote",
            )
            db.session.add(new_quote)
            db.session.commit()

            return jsonify({"message": "Quote saved successfully"}), 201

        # method to delete book from Quote list
        elif request.method == "DELETE":
            data = request.get_json()
            required_fields = ["book_id", "text"]
            user_id = get_jwt_identity()

            if not all(field in data for field in required_fields):
                return jsonify({"error": "Missing required fields"}), 400

            text = data["text"]
            book_id = data["book_id"]

            existing_quote = db.session.execute(
                select(Quotes).where(
                    and_(
                        Quotes.user_id == user_id,
                        Quotes.book_id == book_id,
                        Quotes.text == text,
                    )
                )
            ).scalar_one_or_none()

            if not existing_quote:
                return jsonify({"error": "Quote isn't on this user's list."}), 404

            delete_quote = db.session.get(Quotes, existing_quote.id)
            db.session.delete(delete_quote)
            db.session.commit()
            return jsonify({"message": "Quote deleted successfully"}), 200

        # method to get all quotes from Quotes list of a user
        elif request.method == "GET":
            user_id = get_jwt_identity()
            quote_list = (
                db.session.execute(select(Quotes).where(Quotes.user_id == user_id))
                .scalars()
                .all()
            )
            if not quote_list:
                return jsonify({"error": "Quotes list not found"}), 404

            response_body = [item.serialize() for item in quote_list]
            return jsonify(response_body), 200

    @app.route("/quotes", methods=["GET"])
    @jwt_required()
    def all_quotes():
        today = date.today()
        last_week = today - timedelta(days=7)
        quote_list = (
            db.session.execute(select(Quotes).where(Quotes.created_at >= last_week))
            .scalars()
            .all()
        )
        if not quote_list:
            return jsonify({"error": "Quotes list not found"}), 404

        response_body = [item.serialize() for item in quote_list]
        return jsonify(response_body), 200

    @app.route("/quotes/follow/<int:followId>", methods=["GET"])
    @jwt_required()
    def follow_quotes(followId):
        quote_list = (
            db.session.execute(select(Quotes).where(Quotes.user_id == followId))
            .scalars()
            .all()
        )
        if not quote_list:
            return jsonify({"error": "Quotes list not found"}), 404

        response_body = [item.serialize() for item in quote_list]
        return jsonify(response_body), 200
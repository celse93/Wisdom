from flask import request, jsonify
from src.db import db
from src.models.models import ReadingList
from datetime import date, timedelta
import datetime
from sqlalchemy import select, and_
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)


def reading_list_routes(app):
    @app.route("/reading_list/user", methods=["POST", "DELETE", "GET"])
    @jwt_required()
    def reading_list():
        # method to save book in ReadingList
        if request.method == "POST":
            data = request.get_json()
            book_id = data["book_id"]
            user_id = get_jwt_identity()

            if not book_id:
                return jsonify({"error": "Missing book ID"}), 400

            existing_book = db.session.execute(
                select(ReadingList).where(
                    and_(ReadingList.user_id == user_id, ReadingList.book_id == book_id)
                )
            ).scalar_one_or_none()

            if existing_book:
                return jsonify({"error": "Book already registered"}), 400

            new_book = ReadingList(
                book_id=book_id, user_id=user_id, content_type="reading"
            )
            db.session.add(new_book)
            db.session.commit()

            return jsonify({"message": "Book saved successfully"}), 201

        # method to delete book from ReadingList
        elif request.method == "DELETE":
            data = request.get_json()
            book_id = data["book_id"]
            user_id = get_jwt_identity()

            existing_book = db.session.execute(
                select(ReadingList).where(
                    and_(ReadingList.user_id == user_id, ReadingList.book_id == book_id)
                )
            ).scalar_one_or_none()

            if not existing_book:
                return jsonify(
                    {"error": f"Book ID {book_id}  isn't on this user's list."}
                ), 404

            delete_book = db.session.get(ReadingList, existing_book.id)
            db.session.delete(delete_book)
            db.session.commit()

            return jsonify({"message": "Book deleted successfully"}), 200

        # method to get all books from ReadingList of a user
        elif request.method == "GET":
            user_id = get_jwt_identity()
            reading_list = (
                db.session.execute(
                    select(ReadingList).where(ReadingList.user_id == user_id)
                )
                .scalars()
                .all()
            )
            if not reading_list:
                return jsonify({"error": "Reading list not found"}), 404

            response_body = [item.serialize() for item in reading_list]

            return jsonify(response_body), 200

    @app.route("/reading_list", methods=["GET"])
    @jwt_required()
    def all_reading_list():
        today = date.today()
        last_week = today - timedelta(days=7)
        reading_list = (
            db.session.execute(
                select(ReadingList).where(ReadingList.created_at >= last_week)
            )
            .scalars()
            .all()
        )
        if not reading_list:
            return jsonify({"error": "Reading list not found"}), 404

        response_body = [item.serialize() for item in reading_list]

        return jsonify(response_body), 200

    @app.route("/reading_list/follow/<int:followId>", methods=["GET"])
    @jwt_required()
    def follow_reading_list(followId):
        reading_list = (
            db.session.execute(
                select(ReadingList).where(ReadingList.user_id == followId)
            )
            .scalars()
            .all()
        )
        if not reading_list:
            return jsonify({"error": "Reading list not found"}), 404

        response_body = [item.serialize() for item in reading_list]

        return jsonify(response_body), 200
from flask import request, jsonify
from src.db import db
from src.models.models import Recommendations, Books
from datetime import date, timedelta
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
            required_fields = ["book_id", "title", "author", "description", "date", "image"]
            user_id = get_jwt_identity()
            if not any(field in data for field in required_fields):
                return jsonify({"error": "Missing required fields"}), 400
            
            book_id = data["book_id"]
            title = data["title"]
            author = data["author"]
            description = data['description']
            date = data['date']
            image = data['image']

            existing_recom = db.session.execute(
                select(Recommendations).where(
                    and_(
                        Recommendations.user_id == user_id,
                        Recommendations.book_id == book_id,
                    )
                )
            ).scalar_one_or_none()

            if existing_recom:
                return jsonify({"error": "Book already registered"}), 400
            
            existing_book = db.session.execute(
                select(Books).where(
                        Books.book_id == book_id,
                )
            ).scalar_one_or_none()
            
            # if book exists in Books table save data only in Recom table
            if existing_book:
                new_recom = Recommendations(
                    book_id=book_id, user_id=user_id, content_type="recommendation"
                )
                db.session.add(new_recom)
                db.session.commit()
                return jsonify({"message": "Book saved successfully"}), 201
            
            if not existing_book:
                new_book = Books(
                    book_id=book_id, title=title, author=author, description=description,
                    published_date=date, image=image
                )
                
                new_recom = Recommendations(
                    book_id=book_id, user_id=user_id, content_type="recommendation"
                )
                db.session.add(new_book)
                db.session.add(new_recom)
                db.session.commit()
                return jsonify({"message": "Book saved successfully"}), 201

        # method to delete book from Recommendation
        elif request.method == "DELETE":
            data = request.get_json()
            book_id = data["book_id"]
            user_id = get_jwt_identity()

            existing_recom = db.session.execute(
                select(Recommendations).where(
                    and_(
                        Recommendations.user_id == user_id,
                        Recommendations.book_id == book_id,
                    )
                )
            ).scalar_one_or_none()

            if not existing_recom:
                return jsonify(
                    {"error": f"Book ID {book_id} isn't on this user's list."}
                ), 404
            
            existing_book = db.session.execute(
                select(Books).where(
                        Books.book_id == book_id,
                )
            ).scalar_one_or_none()
            
            followers_count = db.session.execute(
                select(func.count())
                .select_from(Follows)
                .where(Follows.following_id == user_id)
                ).scalar()
            
            
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
        last_week = today - timedelta(days=7)
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

from flask import request, jsonify
from src.db import db
from src.models.models import Recommendations, Books, Reviews, Quotes, ReadingList
from datetime import date, timedelta
import datetime
from sqlalchemy import select, and_
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)

def get_all_user_routes(app):
    @app.route("/get_all_user", methods=["GET"])
    @jwt_required()
    def get_all_user():
        # method to get all data from current logged in profile
        if request.method == "GET":
            user_id = get_jwt_identity()
            reviews = (
                db.session.execute(select(Reviews).where(Reviews.user_id == user_id))
                .scalars()
                .all()
            )
            recommendations = (
                db.session.execute(
                    select(Recommendations).where(Recommendations.user_id == user_id))
                .scalars()
                .all()
            )
            quotes = (
                db.session.execute(select(Quotes).where(Quotes.user_id == user_id))
                .scalars()
                .all()
            )
            reading_list = (
                db.session.execute(
                    select(ReadingList).where(ReadingList.user_id == user_id))
                .scalars()
                .all()
            )
            
            if not (reviews or recommendations or quotes or reading_list):
                return jsonify({"error": "No lists were found"}), 404

            all_tables = reviews + recommendations + quotes + reading_list
            
            # to obtain the list of books linked to the tables above
            book_ids = []
            for item in all_tables:
                book_ids.append(item.book_id)  
            
                # to remove duplicated book IDs
            books_set = set((book_ids)) 
            
            all_books = []
            for book in books_set:
                all_books.append(db.session.execute(
                        select(Books).where(Books.book_id == book)
                    ).scalar_one_or_none())
            

            response_tables = [item.serialize() for item in all_tables]
            response_books = [item.serialize() for item in all_books]

            return jsonify({"tables": response_tables, "books": response_books}), 200


          
            

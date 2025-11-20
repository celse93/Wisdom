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

def get_all_routes(app):
    @app.route("/get_all", methods=["GET"])
    @jwt_required()
    def get_all():
        # method to get all data from all tables from the last 7 days
        if request.method == "GET":
            today = date.today()
            last_week = today - timedelta(days=7)
            reviews = (
                db.session.execute(
                    select(Reviews).where(Reviews.created_at >= last_week)
                )
                .scalars()
                .all()
            )
            recommendations = (
                db.session.execute(
                    select(Recommendations).where(
                        Recommendations.created_at >= last_week
                    )
                )
                .scalars()
                .all()
            )
            quotes = (
                db.session.execute(select(Quotes).where(Quotes.created_at >= last_week))
                .scalars()
                .all()
            )
            reading_list = (
                db.session.execute(
                    select(ReadingList).where(ReadingList.created_at >= last_week)
                )
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


          
            

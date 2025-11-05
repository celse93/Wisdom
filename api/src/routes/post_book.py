from flask import request, jsonify
from src.db import db
from src.models.models import Recommendations, Books, ReadingList, Quotes, Reviews
from datetime import date, timedelta
import datetime
from sqlalchemy import select, and_
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)


def posts_routes(app):
    @app.route("/posts", methods=["POST"])
    @jwt_required()
    def posts():
        if request.method == "POST":
            data = request.get_json()
            required_fields = ["book_id", "type"]
            user_id = get_jwt_identity()
            
            if not all(field in data for field in required_fields):
                return jsonify({"error": "Missing book ID or type"}), 400
            
            book_id = data.get("book_id")
            title = data.get("title")
            author = data.get("author", ["N/A"])
            description = data.get('description')
            date = data.get('date')
            image = data.get('image')
            type = data.get('type')
            text = data.get('text')
            category_id = data.get('category_id')
            print(data)

            if type == 'recommendation':
                existing_recom = db.session.execute(
                    select(Recommendations).where(
                        and_(
                            Recommendations.user_id == user_id,
                            Recommendations.book_id == book_id,
                        )
                    )
                ).scalar_one_or_none()

                if existing_recom:
                    return jsonify({"error": "Book already registered in Recomendations"}), 400
                
                existing_book = db.session.execute(
                    select(Books).where(
                            Books.book_id == book_id,
                    )
                ).scalar_one_or_none()
                
                # if book exists in Books table save data in Recom table only
                if existing_book:
                    new_recom = Recommendations(
                        book_id=book_id, user_id=user_id, content_type="recommendation"
                    )
                    db.session.add(new_recom)
                    db.session.commit()
                    return jsonify({"message": "Book saved successfully in Recomendations"}), 201
                
                # if book not exists in Books table save data in Recom + Books table
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
                    return jsonify({"message": "Book saved successfully in Recomendations and Books table"}), 201
                
            if type == 'reading':
                existing_reading = db.session.execute(
                    select(ReadingList).where(
                        and_(
                            ReadingList.user_id == user_id,
                            ReadingList.book_id == book_id,
                        )
                    )
                ).scalar_one_or_none()

                if existing_reading:
                    return jsonify({"error": "Book already registered in Reading list"}), 400
                
                existing_book = db.session.execute(
                    select(Books).where(
                            Books.book_id == book_id,
                    )
                ).scalar_one_or_none()
                
                # if book exists in Books table save data in ReadingList table only
                if existing_book:
                    new_reading = ReadingList(
                        book_id=book_id, user_id=user_id, content_type="reading_list"
                    )
                    db.session.add(new_reading)
                    db.session.commit()
                    return jsonify({"message": "Book saved successfully in Reading list"}), 201
                
                # if book not exists in Books table save data in ReadingList + Books table
                if not existing_book:
                    new_book = Books(
                        book_id=book_id, title=title, author=author, description=description,
                        published_date=date, image=image
                    )
                    
                    new_reading = Recommendations(
                        book_id=book_id, user_id=user_id, content_type="reading_list"
                    )
                    db.session.add(new_book)
                    db.session.add(new_reading)
                    db.session.commit()
                    return jsonify({"message": "Book saved successfully in Reading list and Books table"}), 201

            if type == 'quote':
                if text != None: 
                    existing_book = db.session.execute(
                        select(Books).where(
                                Books.book_id == book_id,
                        )
                    ).scalar_one_or_none()
                    
                    # if book exists in Books table save data in Quotes table only
                    if existing_book:
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
                    
                    # if book not exists in Books table save data in ReadingList + Books table
                    if not existing_book:
                        new_book = Books(
                            book_id=book_id, title=title, author=author, description=description,
                            published_date=date, image=image
                        )
                        
                        new_quote = Quotes(
                            book_id=book_id,
                            user_id=user_id,
                            text=text,
                            category_id=category_id,
                            content_type="quote",
                        )
                        db.session.add(new_book)
                        db.session.add(new_quote)
                        db.session.commit()
                        return jsonify({"message": "Book saved successfully in Quotes and Books table"}), 201
                else:
                    return jsonify({"error": "Missing quote text"}), 400
            
            if type == 'review': 
                if text != None:
                    existing_review = db.session.execute(
                        select(Reviews).where(
                            and_(
                                Reviews.user_id == user_id,
                                Reviews.book_id == book_id,
                            )
                        )
                    ).scalar_one_or_none()

                    if existing_review:
                        return jsonify({"error": "Book already rated"}), 400
                    
                    existing_book = db.session.execute(
                        select(Books).where(
                                Books.book_id == book_id,
                        )
                    ).scalar_one_or_none()
                    
                    # if book exists in Books table save data in Reviews table only
                    if existing_book:
                        new_review = Reviews(
                            text=text, book_id=book_id, user_id=user_id, content_type="review"
                        )
                        db.session.add(new_review)
                        db.session.commit()
                        return jsonify({"message": "Review saved successfully"}), 201
                    
                    # if book not exists in Books table save data in Reviews + Books table
                    if not existing_book:
                        new_book = Books(
                            book_id=book_id, title=title, author=author, description=description,
                            published_date=date, image=image
                        )
                        
                        new_review = Reviews(
                            text=text, book_id=book_id, user_id=user_id, content_type="review"
                        )
                        db.session.add(new_book)
                        db.session.add(new_review)
                        db.session.commit()
                        return jsonify({"message": "Book saved successfully in Reading list and Books table"}), 201
                else:
                    return jsonify({"error": "Missing review text"}), 400
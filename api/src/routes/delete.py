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


def delete_routes(app):
    @app.route("/delete", methods=["DELETE"])
    @jwt_required()
    def delete():
        if request.method == "DELETE":
            data = request.get_json()
            required_fields = ["book_id", "type"]
            user_id = get_jwt_identity()
            
            if not all(field in data for field in required_fields):
                return jsonify({"error": "Missing book ID or type"}), 400
            
            book_id = data.get("book_id")
            text = data.get("text")
            type = data.get("type")

            if type == 'recommendation':
                existing_recom = (db.session.execute(
                        select(Recommendations).where(
                            and_(
                                Recommendations.book_id == book_id,
                            )
                        )
                    )
                    .scalars()
                    .all()
                )
                
                existing_reading = db.session.execute(
                    select(ReadingList).where(
                        and_(
                            ReadingList.book_id == book_id,
                        )
                    )
                ).scalar_one_or_none()
                
                existing_quote = db.session.execute(
                    select(Quotes).where(
                        and_(
                            Quotes.book_id == book_id,
                        )
                    )
                ).scalar_one_or_none()
                
                existing_review = db.session.execute(
                        select(Reviews).where(
                            and_(
                                Reviews.book_id == book_id,
                            )
                        )
                    ).scalar_one_or_none()
                
                existing_book = db.session.execute(
                    select(Books).where(
                            Books.book_id == book_id,
                    )
                ).scalar_one_or_none()
                
                print(len(existing_recom))
                
                # if book doesn't exist in any other table and doesn't exist twice in 
                # Recom table, delete user book in Recom + Books table
                if not(existing_review or existing_reading or existing_quote) and len(existing_recom)==1:
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
                            {"error": f"Book {book_id} doesn't exist in any list."}
                        ), 404
                        
                    delete_recom = db.session.get(Recommendations, existing_recom.id)
                    delete_book = db.session.get(Books, existing_book.id)
                    db.session.delete(delete_recom)
                    db.session.delete(delete_book)
                    db.session.commit()
                    return jsonify({"message": "Book deleted successfully in Recomendations and Books table"}), 201
                
                # if book exists in any other table or twice in Recom table,
                # delete user book in Recom table only
                else:
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
                            {"error": f"Book ID {book_id} isn't on this user's recommendation list."}
                        ), 404
                        
                    delete_recom = db.session.get(Recommendations, existing_recom.id)
                    db.session.delete(delete_recom)
                    db.session.commit()
                    return jsonify({"message": "Book deleted successfully in Recomendations table"}), 201
                
            if type == 'reading':
                existing_reading = (db.session.execute(
                    select(ReadingList).where(
                        and_(
                            ReadingList.book_id == book_id,
                        )
                    )
                )
                .scalars()
                .all()
                )

                existing_recom = db.session.execute(
                    select(Recommendations).where(
                        and_(
                            Recommendations.book_id == book_id,
                        )
                    )
                ).scalar_one_or_none()
                
                existing_quote = db.session.execute(
                    select(Quotes).where(
                        and_(
                            Quotes.book_id == book_id,
                        )
                    )
                ).scalar_one_or_none()
                
                existing_review = db.session.execute(
                        select(Reviews).where(
                            and_(
                                Reviews.book_id == book_id,
                            )
                        )
                    ).scalar_one_or_none()
                
                existing_book = db.session.execute(
                    select(Books).where(
                            Books.book_id == book_id,
                    )
                ).scalar_one_or_none()
                
                print(len(existing_reading))
                
                # if book doesn't exist in any other table and doesn't exist twice in 
                # Reading table, delete user book in Reading + Books table
                if not(existing_review or existing_recom or existing_quote) and len(existing_reading)==1:
                    existing_reading = db.session.execute(
                        select(ReadingList).where(
                            and_(
                                ReadingList.user_id == user_id,
                                ReadingList.book_id == book_id,
                            )
                        )
                    ).scalar_one_or_none()

                    if not existing_reading:
                        return jsonify(
                            {"error": f"Book {book_id} doesn't exist in any list."}
                        ), 404
                    
                    delete_reading = db.session.get(ReadingList, existing_reading.id)
                    delete_book = db.session.get(Books, existing_book.id)
                    db.session.delete(delete_reading)
                    db.session.delete(delete_book)
                    db.session.commit()
                    return jsonify({"message": "Book deleted successfully in Reading and Books table"}), 201
                
                # if book exists in any other table or twice in Reading table,
                # delete user book in Reading table only
                else:
                    existing_reading = db.session.execute(
                        select(ReadingList).where(
                            and_(
                                ReadingList.user_id == user_id,
                                ReadingList.book_id == book_id,
                            )
                        )
                    ).scalar_one_or_none()

                    if not existing_reading:
                        return jsonify(
                            {"error": f"Book ID {book_id} isn't on this user's reading list."}
                        ), 404
                        
                    delete_reading = db.session.get(ReadingList, existing_reading.id)
                    db.session.delete(delete_reading)
                    db.session.commit()
                    return jsonify({"message": "Book deleted successfully in Reading table"}), 201
           
            if type == 'quote':
                if text != None: 
                    existing_quote = (db.session.execute(
                        select(Quotes).where(
                            and_(
                                Quotes.book_id == book_id,
                            )
                        )
                    )
                    .scalars()
                    .all()
                    )
                    
                    existing_recom = db.session.execute(
                        select(Recommendations).where(
                            and_(
                                Recommendations.book_id == book_id,
                            )
                        )
                    ).scalar_one_or_none()
                    
                    existing_reading = db.session.execute(
                        select(ReadingList).where(
                            and_(
                                ReadingList.book_id == book_id,
                            )
                        )
                    ).scalar_one_or_none()
                    
                    existing_review = db.session.execute(
                            select(Reviews).where(
                                and_(
                                    Reviews.book_id == book_id,
                                )
                            )
                        ).scalar_one_or_none()
                    
                    existing_book = db.session.execute(
                        select(Books).where(
                                Books.book_id == book_id,
                        )
                    ).scalar_one_or_none()
                    
                    print(len(existing_quote))
                    
                    # if book doesn't exist in any other table and doesn't exist twice in 
                    # Quote table, delete user book in Quote + Books table
                    if not(existing_review or existing_recom or existing_reading) and len(existing_quote)==1:
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
                            return jsonify(
                                {"error": f"Quote & Book not fount on this user's list."}
                            ), 404
                        
                        delete_quote = db.session.get(Quotes, existing_quote.id)
                        delete_book = db.session.get(Books, existing_book.id)
                        db.session.delete(delete_quote)
                        db.session.delete(delete_book)
                        db.session.commit()
                        return jsonify({"message": "Book deleted successfully in Quote and Books table"}), 201
                    
                    # if book exists in any other table or twice in Quote table,
                    # delete user book in Quote table only
                    else:
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
                            return jsonify(
                                {"error": f"Quote isn't on this user's quote list."}
                            ), 404
                            
                        delete_quote = db.session.get(Quotes, existing_quote.id)
                        db.session.delete(delete_quote)
                        db.session.commit()
                        return jsonify({"message": "Book deleted successfully in Quote table"}), 201
                else:
                    return jsonify({"error": "Missing quote text"}), 404
            
            if type == 'review': 
                    existing_review = (db.session.execute(
                            select(Reviews).where(
                                and_(
                                    Reviews.book_id == book_id,
                                )
                            )
                        )
                        .scalars()
                        .all()
                    )
                    
                    existing_recom = db.session.execute(
                        select(Recommendations).where(
                            and_(
                                Recommendations.book_id == book_id,
                            )
                        )
                    ).scalar_one_or_none()
                    
                    existing_reading = db.session.execute(
                        select(ReadingList).where(
                            and_(
                                ReadingList.book_id == book_id,
                            )
                        )
                    ).scalar_one_or_none()
                    
                    existing_quote = db.session.execute(
                        select(Quotes).where(
                            and_(
                                Quotes.book_id == book_id,
                            )
                        )
                    ).scalar_one_or_none()
                    
                    existing_book = db.session.execute(
                        select(Books).where(
                                Books.book_id == book_id,
                        )
                    ).scalar_one_or_none()
                    
                    print(len(existing_review))
                    
                    # if book doesn't exist in any other table and doesn't exist twice in 
                    # Review table, delete user book in Review + Books table
                    if not(existing_quote or existing_recom or existing_reading) and len(existing_review)==1:
                        existing_review = db.session.execute(
                            select(Reviews).where(
                                and_(
                                    Reviews.user_id == user_id,
                                    Reviews.book_id == book_id,
                                )
                            )
                        ).scalar_one_or_none()

                        if not existing_review:
                            return jsonify(
                                {"error": f"Book {book_id} doesn't exist in any list."}
                            ), 404
                        
                        delete_review = db.session.get(Reviews, existing_review.id)
                        delete_book = db.session.get(Books, existing_book.id)
                        db.session.delete(delete_review)
                        db.session.delete(delete_book)
                        db.session.commit()
                        return jsonify({"message": "Book deleted successfully in Review and Books table"}), 201
                    
                    # if book exists in any other table or twice in Review table,
                    # delete user book in Review table only
                    else:
                        existing_review = db.session.execute(
                            select(Reviews).where(
                                and_(
                                    Reviews.user_id == user_id,
                                    Reviews.book_id == book_id,
                                )
                            )
                        ).scalar_one_or_none()

                        if not existing_review:
                            return jsonify(
                                {"error": f"Book ID {book_id} isn't on this user's review list."}
                            ), 404
                            
                        delete_review = db.session.get(Reviews, existing_review.id)
                        db.session.delete(delete_review)
                        db.session.commit()
                        return jsonify({"message": "Book deleted successfully in Review table"}), 201
from sqlalchemy import String, VARCHAR, ForeignKey, Date, JSON
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import db
from typing import List


class Users(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    email: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(VARCHAR(60), nullable=False)
    profile: Mapped["Profiles"] = relationship(back_populates="user")

    def __repr__(self):
        return f"<User: {self.email}>"

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }


class Follows(db.Model):
    __tablename__ = "follows"

    id: Mapped[int] = mapped_column(primary_key=True)
    follower_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"))
    following_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"))

    def serialize(self):
        return {
            "follower_id": self.follower_id,
            "following_id": self.following_id,
        }


class Profiles(db.Model):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), primary_key=True, nullable=False
    )
    username: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    user: Mapped["Users"] = relationship(back_populates="profile")
    recommendation: Mapped["Recommendations"] = relationship(back_populates="profile")
    readinglist: Mapped["ReadingList"] = relationship(back_populates="profile")
    review: Mapped["Reviews"] = relationship(back_populates="profile")
    quote: Mapped["Quotes"] = relationship(back_populates="profile")

    # Relationship for "followings": people this profile follows
    followings: Mapped[List["Profiles"]] = relationship(
        secondary="follows",
        primaryjoin=Follows.follower_id == id,
        secondaryjoin=Follows.following_id == id,
        back_populates="followers",
    )

    # Relationship for "followers": people who follow this profile
    followers: Mapped[List["Profiles"]] = relationship(
        secondary="follows",
        primaryjoin=Follows.follower_id == id,
        secondaryjoin=Follows.following_id == id,
        back_populates="followings",
    )

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
        }


class ReadingList(db.Model):
    __tablename__ = "readinglist"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    book_id: Mapped[str] = mapped_column(String(50), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"))
    content_type: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[date] = mapped_column(Date, default=date.today)
    profile: Mapped[List["Profiles"]] = relationship(back_populates="readinglist")

    def serialize(self):
        return {
            "id": self.id,
            "book_id": self.book_id,
            "user_id": self.user_id,
            "content_type": self.content_type,
            "created_at": self.created_at.isoformat(),
        }


class Recommendations(db.Model):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    book_id: Mapped[str] = mapped_column(String(50), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"))
    content_type: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[date] = mapped_column(Date, default=date.today)
    profile: Mapped[List["Profiles"]] = relationship(back_populates="recommendation")

    def serialize(self):
        return {
            "id": self.id,
            "book_id": self.book_id,
            "user_id": self.user_id,
            "content_type": self.content_type,
            "created_at": self.created_at.isoformat(),
        }


class Reviews(db.Model):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    text: Mapped[str] = mapped_column(String(1500), nullable=False)
    book_id: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"))
    content_type: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[date] = mapped_column(Date, default=date.today)
    profile: Mapped[List["Profiles"]] = relationship(back_populates="review")

    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "book_id": self.book_id,
            "user_id": self.user_id,
            "content_type": self.content_type,
            "created_at": self.created_at.isoformat(),
        }


class Quotes(db.Model):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    text: Mapped[str] = mapped_column(String(1500), nullable=False)
    book_id: Mapped[str] = mapped_column(String(50), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"))
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=True)
    content_type: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[date] = mapped_column(Date, default=date.today)
    profile: Mapped[List["Profiles"]] = relationship(back_populates="quote")
    category: Mapped[List["Categories"]] = relationship(back_populates="quote")

    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "book_id": self.book_id,
            "user_id": self.user_id,
            "content_type": self.content_type,
            "category_id": self.category_id,
            "created_at": self.created_at.isoformat(),
        }


class Categories(db.Model):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    label: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    quote: Mapped["Quotes"] = relationship(back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "label": self.label,
        }

class Books(db.Model):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    book_id: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(250), nullable=True)
    author: Mapped[list[str]] = mapped_column(JSON, nullable=True)
    description: Mapped[str] = mapped_column(String(5000), nullable=True)
    published_date: Mapped[str] = mapped_column(String(50), nullable=True)
    image: Mapped[str] = mapped_column(String(250), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "book_id": self.book_id,
            "title": self.title,
            "author": self.author,
            "description": self.description,
            "published_date": self.published_date,
            "image": self.image,
        }
"""SQLAlchemy models for WasteNought"""

from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class PasswordManager:
    def __init__(self):
        self.bcrypt = bcrypt

    def hash_password(self, password):
        return self.bcrypt.generate_password_hash(password).decode('utf-8')
    
    def verify_password(self, hashed_password, password):
        """used to check the hashed version of a password versus what is hashed in the db"""
        return self.bcrypt.check_password_hash(hashed_password, password)

class User(db.Model):
    """User in the system."""
# Current Issues:
# Seed file (1st:*dev*/prod) -- Celsius in user pref/others

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    email = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    password = db.Column(
        db.Text,
        nullable=False,
    )

    security_question = db.Column(
        db.Text,
        nullable=False,
    )

    security_answer = db.Column(
        db.Text,
        nullable=False,
    )

    temperature_readings = db.relationship('TemperatureReading', backref='user', lazy='dynamic')



class TemperatureReading(db.Model):
    """Keeps temperature and timestamp data"""

    __tablename__ = 'temperature_readings'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=False,
    )

    timestamp = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    temperature = db.Column(
        db.Float,
        nullable=False,
    )

#think of tables as individual things -- organization, users, refrigerators, if_admin, if_user kinda thing

def connect_db(app):

    db.app = app
    db.init_app(app)
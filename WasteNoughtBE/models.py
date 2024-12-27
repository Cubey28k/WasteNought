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
        return self.bcrypt.check_password_hash(hashed_password, password)

class User(db.Model):
    """User in the system."""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text, nullable=False, unique=True)
    username = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)
    security_question = db.Column(db.Text, nullable=False)
    security_answer = db.Column(db.Text, nullable=False)

    # Relationship to manage the user's specific refrigeration units
    refrigeration_units = db.relationship('UserRefrigerationUnit', back_populates='user')
    pass
user_demo_units = db.Table(
    'user_demo_units',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('refrigeration_unit_id', db.Integer, db.ForeignKey('refrigeration_units.id'), primary_key=True)
)


class RefrigerationUnit(db.Model):
    """Refrigeration unit with a name and temperature readings."""
    __tablename__ = 'refrigeration_units'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    is_demo = db.Column(db.Boolean, default=False)

    temperature_readings = db.relationship('TemperatureReading', backref='refrigeration_unit', lazy='dynamic')

class TemperatureReading(db.Model):
    """Temperature data and timestamp associated with a refrigeration unit."""
    __tablename__ = 'temperature_readings'

    id = db.Column(db.Integer, primary_key=True)
    refrigeration_unit_id = db.Column(db.Integer, db.ForeignKey('refrigeration_units.id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    temperature = db.Column(db.Float, nullable=False)

class UserRefrigerationUnit(db.Model):
    """Join table with additional data for user's specific refrigeration units."""
    __tablename__ = 'user_refrigeration_units'
    __table_args__ = (db.UniqueConstraint('user_id', 'refrigeration_unit_id', name='unique_user_unit'),)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    refrigeration_unit_id = db.Column(db.Integer, db.ForeignKey('refrigeration_units.id'), primary_key=True)
    access_granted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship('User', back_populates='refrigeration_units')
    refrigeration_unit = db.relationship('RefrigerationUnit', backref='user_refrigeration_units')

# Connect the database to the Flask app
def connect_db(app):
    """Connect this database to the provided Flask app."""
    db.app = app
    db.init_app(app)

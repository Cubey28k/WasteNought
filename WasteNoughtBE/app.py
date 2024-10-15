import os
from flask import Flask, request, jsonify, session, g
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, connect_db, User, PasswordManager, TemperatureReading
from dotenv import load_dotenv
from flask_cors import CORS
from flask_migrate import Migrate  # Import Flask-Migrate

# Load environment variables from .env file
load_dotenv()

CURR_USER_KEY = "curr_user"

app = Flask(__name__)

# Enable CORS for the Railway frontend URL
CORS(app, resources={r"/*": {"origins": [
    "https://wastenought-production.up.railway.app",
    "http://10.5.1.240"
]}})

# Use environment variables for configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')  # Secret key for sessions and security
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql:///wastenought')  # Database URL from environment or local fallback
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt_secret_key')  

# Connect database to app
connect_db(app)

# Initialize Flask-JWT and Flask-Migrate
jwt = JWTManager(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate

password_manager = PasswordManager()

@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""
    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])
    else:
        g.user = None

def do_login(user):
    """Log in user."""
    session[CURR_USER_KEY] = user.id

def do_logout():
    """Logout user."""
    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]

# Example route for testing
@app.route('/test', methods=['POST'])
def test_route():
    return jsonify({"message": "Test route works!"}), 200

# Registration route
@app.route('/register', methods=['POST'])
def register():
    print(request.json)
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')
    security_question = request.json.get('security_question')
    security_answer = request.json.get('security_answer')

    if not username or not email or not password or not security_question or not security_answer:
        return jsonify({"error": "All fields are required"}), 400
    
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "User already exists"}), 400
    
    hashed_password = password_manager.hash_password(password)
    hashed_security_answer = password_manager.hash_password(security_answer)
    
    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        security_question=security_question,
        security_answer=hashed_security_answer
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Login route
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).first()

    if user and password_manager.verify_password(user.password, password):
        access_token = create_access_token(identity=user.id)
        do_login(user)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Forgot password route
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    email = request.json.get('email')
    security_answer = request.json.get('security_answer')
    new_password = request.json.get('new_password')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    valid_security_answer = password_manager.verify_password(user.security_answer, security_answer)
    if not valid_security_answer:
        return jsonify({"error": "Invalid security answer"}), 400
    
    hashed_password = password_manager.hash_password(new_password)
    user.password = hashed_password
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200

# Add temperature reading route (requires JWT)
@app.route('/metric', methods=['POST'])
@jwt_required()
def add_temperature():
    current_user_id = get_jwt_identity()
    data = request.json
    temperature = data.get('temperature')
    timestamp = data.get('timestamp')

    if temperature is None or timestamp is None:
        return jsonify({"error": "Temperature and timestamp are required"}), 400

    reading = TemperatureReading(user_id=current_user_id, temperature=temperature, timestamp=timestamp)

    db.session.add(reading)
    db.session.commit()

    return jsonify({"status": "success", "temperature": temperature, "timestamp": reading.timestamp.isoformat()})

# Get temperature readings route (requires JWT)
@app.route('/metric', methods=['GET'])
@jwt_required()
def get_temperatures():
    current_user_id = get_jwt_identity()
    readings = TemperatureReading.query.filter_by(user_id=current_user_id).all()
    result = [{"type": "temperature", "value": reading.temperature, "timestamp": reading.timestamp.isoformat()} for reading in readings]
    return jsonify(result)

# Run the app
if __name__ == '__main__':
    app.run(debug=False, port=5500, host="0.0.0.0")

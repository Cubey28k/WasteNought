import os
from flask import Flask, request, jsonify, session, g, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, connect_db, User, PasswordManager, TemperatureReading, RefrigerationUnit, UserRefrigerationUnit
from dotenv import load_dotenv
from flask_cors import CORS
from flask_migrate import Migrate, upgrade as _upgrade
import re

load_dotenv()

CURR_USER_KEY = "curr_user"

app = Flask(__name__)

CORS(app, resources={
   r"/*": {
       "origins": ["https://wastenought-production.up.railway.app"],
       "methods": ["GET", "POST", "OPTIONS"],
       "allow_headers": ["Content-Type", "Authorization"],
       "supports_credentials": True
   }
})

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql:///wastenought')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt_secret_key')  

connect_db(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
password_manager = PasswordManager()

@app.before_request
def handle_preflight():
   if request.method == "OPTIONS":
       response = make_response()
       response.headers["Access-Control-Allow-Origin"] = "https://wastenought-production.up.railway.app"
       response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
       response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
       response.headers["Access-Control-Allow-Credentials"] = "true"
       return response, 200

@app.before_request
def add_user_to_g():
   if CURR_USER_KEY in session:
       g.user = User.query.get(session[CURR_USER_KEY])
   else:
       g.user = None

def do_login(user):
   session[CURR_USER_KEY] = user.id

def do_logout():
   if CURR_USER_KEY in session:
       del session[CURR_USER_KEY]

def validate_password(password):
   regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
   return re.match(regex, password) is not None

@app.route('/test', methods=['POST', 'OPTIONS'])
def test_route():
   if request.method == "OPTIONS":
       return handle_preflight()
   return jsonify({"message": "Test route works!"}), 200

@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
   if request.method == "OPTIONS":
       return handle_preflight()
       
   print(request.json)
   username = request.json.get('username')
   email = request.json.get('email')
   password = request.json.get('password')
   security_question = request.json.get('security_question')
   security_answer = request.json.get('security_answer')

   if not username or not email or not password or not security_question or not security_answer:
       return jsonify({"error": "All fields are required"}), 400
   
   if not validate_password(password):
       return jsonify({"error": "Password must be at least 8 characters, include uppercase, lowercase, number, and special character" }), 400
   
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

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
   if request.method == "OPTIONS":
       return handle_preflight()
       
   username = request.json.get('username')
   password = request.json.get('password')
   user = User.query.filter_by(username=username).first()

   if not username or not password:
       return jsonify({"error": "Username and password are required"}), 400

   if user and password_manager.verify_password(user.password, password):
       access_token = create_access_token(identity=user.id)
       do_login(user)
       return jsonify(access_token=access_token), 200
   else:
       return jsonify({"error": "Invalid credentials"}), 401

@app.route('/forgot-password', methods=['POST', 'OPTIONS'])
def forgot_password():
   if request.method == "OPTIONS":
       return handle_preflight()
       
   email = request.json.get('email')
   security_answer = request.json.get('security_answer')
   new_password = request.json.get('new_password')

   if not email or not security_answer or not new_password:
       return jsonify({"error": "All fields are required"}), 400

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

@app.route('/add-unit', methods=['POST', 'OPTIONS'])
@jwt_required()
def add_unit():
   if request.method == "OPTIONS":
       return handle_preflight()
       
   current_user_id = get_jwt_identity()
   unit_id = request.json.get('unit_id')
   
   if not unit_id:
       return jsonify({"error": "Unit ID is required"}), 400
   
   unit = RefrigerationUnit.query\
       .filter_by(id=unit_id)\
       .filter_by(is_demo=False)\
       .first()
   
   if not unit:
       return jsonify({"error": "Invalid unit ID or unit not found"}), 404
   
   existing_assignment = UserRefrigerationUnit.query\
       .filter_by(user_id=current_user_id, refrigeration_unit_id=unit_id)\
       .first()
   
   if existing_assignment:
       return jsonify({"error": "Unit already assigned to user"}), 400
   
   new_assignment = UserRefrigerationUnit(
       user_id=current_user_id,
       refrigeration_unit_id=unit_id
   )
   
   db.session.add(new_assignment)
   db.session.commit()
   
   return jsonify({
       "message": "Unit added successfully", 
       "unit": {
           "id": unit.id,
           "name": unit.name
       }
   }), 201

@app.route('/metric', methods=['POST', 'OPTIONS'])
@jwt_required()
def add_temperature():
   if request.method == "OPTIONS":
       return handle_preflight()
       
   current_user_id = get_jwt_identity()
   data = request.json
   temperature = data.get('temperature')
   timestamp = data.get('timestamp')
   unit_id = data.get('unit_id')

   if not all([temperature, timestamp, unit_id]):
       return jsonify({"error": "Temperature, timestamp, and unit_id are required"}), 400

   access = UserRefrigerationUnit.query\
       .filter_by(user_id=current_user_id, refrigeration_unit_id=unit_id)\
       .first()
   
   if not access:
       return jsonify({"error": "Unauthorized access to unit"}), 403

   reading = TemperatureReading(
       refrigeration_unit_id=unit_id,
       temperature=temperature,
       timestamp=timestamp
   )

   db.session.add(reading)
   db.session.commit()

   return jsonify({
       "status": "success",
       "temperature": temperature,
       "timestamp": reading.timestamp.isoformat()
   })

@app.route('/metric', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_temperatures():
   if request.method == "OPTIONS":
       return handle_preflight()
       
   current_user_id = get_jwt_identity()
   
   user_units = db.session.query(RefrigerationUnit)\
       .join(UserRefrigerationUnit)\
       .filter(UserRefrigerationUnit.user_id == current_user_id)\
       .all()
   
   demo_units = RefrigerationUnit.query.filter_by(is_demo=True).all()
   
   def format_unit_data(unit):
       readings = TemperatureReading.query\
           .filter_by(refrigeration_unit_id=unit.id)\
           .order_by(TemperatureReading.timestamp.desc())\
           .limit(100)\
           .all()
           
       return {
           "id": unit.id,
           "name": unit.name,
           "is_demo": unit.is_demo,
           "readings": [{
               "temperature": reading.temperature,
               "timestamp": reading.timestamp.isoformat()
           } for reading in readings]
       }
   
   user_units_data = [format_unit_data(unit) for unit in user_units]
   demo_units_data = [format_unit_data(unit) for unit in demo_units]
   
   return jsonify({
       "user_units": user_units_data,
       "demo_units": demo_units_data
   })

if __name__ == '__main__':
   app.run(debug=False, port=5500, host="0.0.0.0")
import pytest
from app import app, db
from models import User, TemperatureReading

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['JWT_SECRET_KEY'] = 'test_jwt_secret'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
        db.drop_all()

def test_register(client):
    response = client.post('/register', json={
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'password123',
        'security_question': 'Favorite color?',
        'security_answer': 'blue'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'User registered successfully'

def test_login(client):
    # Create a user for login
    user = User(username='testuser', email='testuser@example.com', password='password123')
    db.session.add(user)
    db.session.commit()

    # Attempt to log in
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'access_token' in data

def test_add_temperature(client):
    # Register and log in to get JWT
    client.post('/register', json={
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'password123',
        'security_question': 'Favorite color?',
        'security_answer': 'blue'
    })
    login_response = client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    access_token = login_response.get_json()['access_token']

    # Add temperature reading
    response = client.post('/metric', json={
        'temperature': 25.5,
        'timestamp': '2024-10-03T12:00:00Z'
    }, headers={'Authorization': f'Bearer {access_token}'})
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'

def test_get_temperatures(client):
    # Register and log in to get JWT
    client.post('/register', json={
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'password123',
        'security_question': 'Favorite color?',
        'security_answer': 'blue'
    })
    login_response = client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    access_token = login_response.get_json()['access_token']

    # Add temperature reading
    client.post('/metric', json={
        'temperature': 25.5,
        'timestamp': '2024-10-03T12:00:00Z'
    }, headers={'Authorization': f'Bearer {access_token}'})

    # Get temperature readings
    response = client.get('/metric', headers={'Authorization': f'Bearer {access_token}'})
    
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['type'] == 'temperature'
    assert data[0]['value'] == 25.5

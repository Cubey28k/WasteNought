import Adafruit_DHT
import time
import requests
from datetime import datetime
import logging

# DHT11 sensor setup
DHT_SENSOR = Adafruit_DHT.DHT11
DHT_PIN = 4  # GPIO pin number

# Backend API URLs
API_URL = "https://wastenought-be-production.up.railway.app/metric"  # Your metric endpoint
LOGIN_URL = "https://wastenought-be-production.up.railway.app/login"  # Your login endpoint

# Raspberry Pi login credentials
USERNAME = "raspberrypi"
PASSWORD = "raspberry"

# Store the JWT token here after login
jwt_token = None

# Logging setup
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s: %(message)s',
    handlers=[
        logging.FileHandler("sensor_data.log"),
        logging.StreamHandler()  # This will output to the console
    ]
)
logger = logging.getLogger()

# Read temperature from DHT11 sensor
def read_temperature():
    humidity, temperature = Adafruit_DHT.read(DHT_SENSOR, DHT_PIN)
    logger.info(temperature)
    retries = 5  # Number of retries if reading fails
    while (humidity is None or temperature is None) and retries > 0:
        logger.warning("Failed to retrieve data from DHT11 sensor, retrying...")
        time.sleep(2)  # Wait before retrying
        humidity, temperature = Adafruit_DHT.read(DHT_SENSOR, DHT_PIN)
        logger.info(temperature)
        retries -= 1

    if humidity is not None and temperature is not None:
        return temperature
    else:
        logger.error("Failed to retrieve data from DHT11 sensor after multiple attempts")
        return None

# Authenticate and get the JWT token
def login():
    global jwt_token
    data = {
        'username': USERNAME,
        'password': PASSWORD
    }
    
    try:
        response = requests.post(LOGIN_URL, json=data)
        if response.status_code == 200:
            jwt_token = response.json().get('access_token')
            logger.info("Login successful, JWT token acquired.")
        else:
            logger.error(f"Error logging in: {response.status_code} - {response.text}")
            jwt_token = None
    except Exception as e:
        logger.error(f"Error logging in: {e}")
        jwt_token = None

# Send temperature data to the backend
def send_to_backend(temperature):
    global jwt_token
    data = {
        'temperature': temperature,
        'timestamp': datetime.utcnow().isoformat()
    }
    headers = {
        'Authorization': f'Bearer {jwt_token}',  # Include the JWT token
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(API_URL, json=data, headers=headers)
        
        # Check for JWT expiration
        if response.status_code == 401:
            logger.warning("JWT token expired. Trying to re-login...")
            login()
            if jwt_token:  # Retry after re-login
                headers['Authorization'] = f'Bearer {jwt_token}'
                response = requests.post(API_URL, json=data, headers=headers)
                if response.status_code == 200:
                    logger.info(f"Temperature {temperature}°C sent to backend after re-login")
                else:
                    logger.error(f"Error sending data after re-login: {response.status_code} - {response.text}")
            else:
                logger.error("Re-login failed. Unable to send data.")
        
        elif response.status_code == 200:
            logger.info(f"Temperature {temperature}°C sent to backend")
        else:
            logger.error(f"Error sending data to backend: {response.status_code} - {response.text}")
    
    except Exception as e:
        logger.error(f"Error sending data to backend: {e}")

# Main program
def main():
    interval = 300  # 5 minutes is 300, 5 seconds for testing the readout
    
    # First, log in to get the token
    login()
    
    if jwt_token:
        while True:
            temp = read_temperature()
            if temp is not None:
                logger.info(f"Current temperature: {temp:.1f} °C")
                send_to_backend(temp)
            
            time.sleep(interval)
    else:
        logger.error("Unable to log in. Exiting.")

if __name__ == "__main__":
    main()


# Walk-In Fridge Sensor

## Overview
The WasteNought Walk-In Fridge Sensor project aims to monitor the temperature of walk-in refrigeration units using a Raspberry Pi equipped with DHT11 sensors. The temperature readings are posted to a backend API, and the data is accessible for review and analysis, with the end user in mind being a brewer, a chef, or anyone who is looking after their inventory.

This is the second capstone I created for Springboard, an online software engineering bootcamp.

Enjoy and I will continue to polish.

Please note! The sensor doesn't appear to be working correctly -- as in, a hardware issue! I will be getting a new one in the near future, but rest assured the values seen on login are valid.

There are plenty of things which will be fixed and are not currently where they should be, but this represents a MVP.

## Features
- **Temperature Monitoring:** Collect temperature data from DHT11 sensors.
- **Data Storage:** Store temperature readings in a PostgreSQL database.
- **API Integration:** Communicate with a Flask backend using JWT for secure data transmission.
- **Real-Time Monitoring:** Fetch and display temperature readings on a web application.

## Deployed Site
[Walk-In Fridge Sensor Application](https://wastenought-production.up.railway.app/)

## Setup Instructions (brief)
- **Frontend**
  - Install JS dependencies with the command "npm install" in your CLI.
  - Use the command npm start.

- **Backend**
  - After cloning the repository, use CLI to navigate to WasteNoughtBE
  - Activate a virtual environment within the folder (different for macOS/Linux versus Windows search online if you're unsure how to do this)
  - Install requirements.txt using pip
  - This setup uses Postgres, use the command "flask db upgrade" in your CLI and then use flask run -- I named the database "wastenought", you can configure something different in a .env file.

- **Variables**
  - You will want three variables in a .env : SECRET_KEY, DATABASE_URL, JWT_SECRET_KEY

- **This project was setup with Vite**


## Technologies Used
- **Frontend**:
  - React
  - Material UI
  - Axios
  - Chart.js

- **Backend**:
  - Flask
  - PostgreSQL
  - JWT for authentication
  - Flask-Migrate for database migrations

- **Hardware**:
  - Raspberry Pi Zero W
  - DHT11 Temperature Sensor
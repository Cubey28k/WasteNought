// src/api/auth.jsx
import axios from 'axios';

// Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use import.meta.env for Vite

// Function to handle user login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

// Function to handle user registration
export const registerUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, credentials);
    return response.data;
  } catch (error) {
    throw new Error('Registration failed');
  }
};

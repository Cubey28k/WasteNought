import React, { useState } from 'react';
import { TextField, Button, Box, Card, CardContent, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email,
        security_answer: securityAnswer,
        new_password: newPassword,
      });

      if (response.status === 200) {
        setSuccessMessage('Password updated successfully!');
        navigate('/login');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Password reset failed');
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  }

  return (
    <Container>
      <Card variant="outlined" sx={{ margin: '20px auto', maxWidth: 400 }}>
        <CardContent>
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
              Forgot Password
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {successMessage && <Typography color="primary">{successMessage}</Typography>}
            <form onSubmit={handleForgotPassword}>
              <Box mb={2}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Security Answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  fullWidth
                  required
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  required
                />
              </Box>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Reset Password
              </Button>
            </form>
            <Button onClick={handleHomeClick}>Go Back</Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ForgotPassword;

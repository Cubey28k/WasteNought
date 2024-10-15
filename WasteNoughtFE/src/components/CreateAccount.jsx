import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth'; // Ensure this function exists for API interaction

const CreateAccount = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      const response = await registerUser({
        username,
        email,
        password,
        security_question: securityQuestion,
        security_answer: securityAnswer,
      });

      if (response.status === 201) {
        // Redirect to login or dashboard after successful registration
        navigate('/dashboard'); // Adjust the route as needed
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Create Account</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
            />
          </Box>
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
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Security Question"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
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
          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateAccount;

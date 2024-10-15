import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/auth';
import { Button, TextField, Typography, Container, Box, Card, CardContent } from '@mui/material';

function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      await loginUser({ username, password });
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid credentials, please try again.');
      console.error('Login failed', error);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Reset success message

    try {
      const response = await registerUser({
        username,
        email,
        password,
        security_question: securityQuestion,
        security_answer: securityAnswer,
      });
      
      if (response.status === 201) {
        setSuccessMessage('Registration Successful!'); // Set success message
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed, you can only register once.');
      console.error('Registration failed', error);
    }
  };

  const handleLearnMoreClick = () => {
    navigate('/learn-more');
  };

  const handleExampleClick = () => {
    navigate('/example-dash');
  }

  return (
    <Container>
      <Card variant="outlined" sx={{ margin: '5px auto', maxWidth: 600 }}>
        <CardContent>
          <Box my={4}>
            <Typography variant="h2" align="center" gutterBottom>
              Is Your Refrigerator Running?
            </Typography>
            <Typography variant="h5" align="center" gutterBottom>
              WasteNought is a hardware and software package that allows businesses with walk-in coolers to catch refrigeration failures, saving thousands of dollars.
            </Typography>

            <Box textAlign="center" mb={1.5}>
              <Button variant="contained" onClick={handleLearnMoreClick}>
                Learn More
              </Button>
            </Box>
            <Box textAlign="center" mb={2}>
              <Button variant="contained" onClick={handleExampleClick}>
                Example and Start Guide
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Login/Register Card */}
      <Card variant="outlined" sx={{ margin: '20px auto', maxWidth: 400 }}>
        <CardContent>
          <Box textAlign="center">
            <Typography variant="h4">{isRegistering ? 'Register' : 'Login'}</Typography>
            {error && <Typography color="error">{error}</Typography>}
            {successMessage && <Typography color="success.main">{successMessage}</Typography>} {/* Render success message */}
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
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
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
              </Box>
              {isRegistering && (
                <>
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
                </>
              )}
              <Button variant="contained" color="primary" type="submit">
                {isRegistering ? 'Register' : 'Login'}
              </Button>
            </form>

            {/* Forgot Password Link */}
            {!isRegistering && (
              <Box mt={2}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </Typography>
              </Box>
            )}

            <Box mt={2}>
              <Button variant="outlined" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Already have an account? Login' : 'Create Account'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;

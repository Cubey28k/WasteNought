import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from '../components/Chart';
import 'chart.js/auto';
import 'chartjs-adapter-luxon';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  styled
} from '@mui/material';
import { InfoOutlined, Add as AddIcon } from '@mui/icons-material';

// Styled components
const StyledCard = styled(Card)(({ theme, demo }) => ({
  margin: theme.spacing(2, 0),
  borderLeft: demo ? `4px solid ${theme.palette.error.light}` : 'none',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const OnboardingMessage = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2, 0),
  border: `2px dashed ${theme.palette.divider}`,
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

function Dashboard() {
  const [userUnits, setUserUnits] = useState([]);
  const [demoUnits, setDemoUnits] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [unitIdToAdd, setUnitIdToAdd] = useState('');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const getToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      const savedUsername = localStorage.getItem('username');
      if (savedUsername === 'raspberrypi') {
        return await login('raspberrypi', 'raspberry');
      }
      return null;
    }
  };

  const login = async (loginUsername, loginPassword) => {
    try {
      const response = await axios.post('https://wastenought-be-production.up.railway.app/login', {
        username: loginUsername,
        password: loginPassword,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('username', loginUsername);
      setError(null);
      return access_token;
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials.');
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const token = await login(username, password);
    if (token) {
      await fetchTemperatureReadings(token);
    }
  };

  const handleAddUnit = async () => {
    try {
      const token = await getToken();
      await axios.post('https://wastenought-be-production.up.railway.app/add-unit', 
        { unit_id: unitIdToAdd },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh data after adding unit
      await fetchTemperatureReadings(token);
      setIsAddUnitOpen(false);
      setUnitIdToAdd('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add unit. Please try again.');
    }
  };

  const fetchTemperatureReadings = async (token) => {
    try {
      const response = await axios.get('https://wastenought-be-production.up.railway.app/metric', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { user_units, demo_units } = response.data;
      setUserUnits(user_units);
      setDemoUnits(demo_units);
      setError(null);
    } catch (error) {
      console.error('Error fetching temperature readings:', error);
      setError('Failed to fetch temperature readings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const token = await getToken();
      if (token) {
        await fetchTemperatureReadings(token);
      } else {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const AddUnitDialog = () => (
    <Dialog open={isAddUnitOpen} onClose={() => setIsAddUnitOpen(false)}>
      <DialogTitle>Add Refrigeration Unit</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Unit ID"
          type="text"
          value={unitIdToAdd}
          onChange={(e) => setUnitIdToAdd(e.target.value)}
          sx={{ mt: 2 }}
          helperText="Enter the ID provided by your unit administrator"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsAddUnitOpen(false)}>Cancel</Button>
        <Button onClick={handleAddUnit} variant="contained" color="primary">
          Add Unit
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>

        {!localStorage.getItem('token') ? (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleLogin}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Login
                </Button>
              </Box>
            </form>
          </Paper>
        ) : (
          <Box mb={3}>
            <Button
              variant="outlined"
              color="primary"
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography>This dashboard is currently in development...</Typography>
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {localStorage.getItem('token') && (
          <>
            <Box mb={4}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Your Refrigeration Units</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAddUnitOpen(true)}
                >
                  Add Unit
                </Button>
              </Box>
              
              {userUnits.length > 0 ? (
                userUnits.map((unit) => (
                  <StyledCard key={unit.id}>
                    <CardHeader
                      title={unit.name}
                      subheader={`Unit ID: ${unit.id}`}
                    />
                    <CardContent>
                      <Chart 
                        chartData={{
                          labels: unit.readings.map(r => r.timestamp),
                          datasets: [
                            {
                              label: 'Temperature (°F)',
                              data: unit.readings.map(r => r.temperature),
                              fill: false,
                              backgroundColor: 'rgba(75,192,192,0.2)',
                              borderColor: 'rgba(75,192,192,1)',
                              pointBackgroundColor: 'rgba(75,192,192,1)',
                              pointBorderColor: '#fff',
                              pointHoverBackgroundColor: '#fff',
                              pointHoverBorderColor: 'rgba(75,192,192,1)',
                              lineTension: 0,
                            },
                            {
                              label: 'Target Temperature (°F)',
                              data: Array(unit.readings.length).fill(40),
                              fill: false,
                              borderColor: 'rgba(128,128,128,1)',
                              borderDash: [5, 5],
                              pointStyle: 'dash',
                            },
                          ],
                        }}
                      />
                    </CardContent>
                  </StyledCard>
                ))
              ) : (
                <OnboardingMessage elevation={0}>
                  <InfoOutlined color="action" sx={{ fontSize: 40 }} />
                  <Typography variant="h6" color="textSecondary">
                    Your units will be displayed here when you add them.
                  </Typography>
                </OnboardingMessage>
              )}
            </Box>

            <Box mb={4}>
              <Typography variant="h4" gutterBottom>
                Demo Units
              </Typography>
              {demoUnits.map((unit) => (
                <StyledCard key={unit.id} demo={1}>
                  <CardHeader
                    title={unit.name}
                    subheader="Demo Unit"
                  />
                  <CardContent>
                    <Chart 
                      chartData={{
                        labels: unit.readings.map(r => r.timestamp),
                        datasets: [
                          {
                            label: 'Temperature (°F)',
                            data: unit.readings.map(r => r.temperature),
                            fill: false,
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            borderColor: 'rgba(255,99,132,1)',
                            pointBackgroundColor: 'rgba(255,99,132,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(255,99,132,1)',
                            lineTension: 0,
                          },
                          {
                            label: 'Target Temperature (°F)',
                            data: Array(unit.readings.length).fill(40),
                            fill: false,
                            borderColor: 'rgba(128,128,128,1)',
                            borderDash: [5, 5],
                            pointStyle: 'dash',
                          },
                        ],
                      }}
                    />
                  </CardContent>
                </StyledCard>
              ))}
            </Box>
          </>
        )}

        <AddUnitDialog />
      </Box>
    </Container>
  );
}

export default Dashboard;
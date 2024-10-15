import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Chart from '../components/Chart';
import 'chart.js/auto';
import '../styles/Dashboard.css';

function ExampleDash() {
  const [walkIns, setWalkIns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWalkIn, setNewWalkIn] = useState({
    name: '',
    phone: '',
    email: '',
    targetTemp: '',
    alertPref: '',
    alertMethod: '',
  });
  const [error, setError] = useState('');

  const addWalkIn = () => {
    if (!newWalkIn.name || !newWalkIn.phone || !newWalkIn.email || !newWalkIn.targetTemp || !newWalkIn.alertMethod) {
      setError('Please fill out all fields.');
      return;
    }

    const newEntry = {
      id: walkIns.length + 1,
      name: newWalkIn.name,
      phone: newWalkIn.phone,
      email: newWalkIn.email,
      chartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Temperature (°F)',
            data: [30, 35, 32, 38, 37, 36, 34],
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
          },
          {
            label: 'Target Temperature (°F)',
            data: Array(7).fill(newWalkIn.targetTemp), // Mock target temperature
            fill: false,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Temperature Over Time' },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: { stepSize: 5, callback: (value) => value + '°F' },
          },
        },
        layout: { padding: { left: 20, right: 20, top: 20, bottom: 20 } },
      },
    };

    setWalkIns([...walkIns, newEntry]);
    setNewWalkIn({ name: '', phone: '', email: '', targetTemp: '', alertPref: '', alertMethod: '' });
    setIsModalOpen(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWalkIn({ ...newWalkIn, [name]: value });
  };

  return (
    <div className="dashboard">
      <h1>Example Dashboard and Set-Up Procedure</h1>
      
      {/* Explainer Card */}
      <Box sx={{ bgcolor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" component="h3">How WasteNought is Set Up</Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          <strong>1. Consultation</strong>  -- We will discuss your specific requirements and preferences.
        </Typography>
        <Typography variant="body2">
          <strong>2. Equipment Setup</strong>  -- We will install your device with a sensor and gather essential details like a name for your system and alert preferences.
        </Typography>
        <Typography variant="body2">
          <strong>3. Personalized Dashboard</strong>  -- Your dashboard will be configured based on the information gathered during our consultation.
        </Typography>
        <Typography variant="body2">
          <strong>4. Ongoing Support</strong>  -- We'll provide continuous support to ensure everything runs smoothly.
        </Typography>
      </Box>

      {walkIns.length === 0 ? (
        <p>Click the button below to add a walk-in. Your information isn't saved in this example dashboard and nothing will happen.
            It's purely for visualization purposes and to grasp what information we will need.</p>
      ) : (
        walkIns.map((walkIn) => (
          <div key={walkIn.id} className="walk-in-info">
            <h2>{walkIn.name}</h2>
            <p><strong>Phone:</strong> {walkIn.phone}</p>
            <p><strong>Email:</strong> {walkIn.email}</p>
            <Chart chartData={walkIn.chartData} chartOptions={walkIn.chartOptions} />
            <Button variant="outlined" onClick={() => setWalkIns(walkIns.filter((w) => w.id !== walkIn.id))}>
              Delete sample Walk-in
            </Button>
          </div>
        ))
      )}
      <Button variant="contained" onClick={() => setIsModalOpen(true)}>
        Add sample Walk-in
      </Button>

      {/* Modal for Adding Walk-in */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6" component="h2">Add New Walk-in</Typography>
            <Button onClick={() => setIsModalOpen(false)}>X</Button>
          </Box>

          {error && <Typography color="error">{error}</Typography>}

          <TextField
            label="Walk-in Name"
            name="name"
            value={newWalkIn.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Servicer Phone"
            name="phone"
            value={newWalkIn.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Servicer E-mail"
            name="email"
            value={newWalkIn.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Target Temperature (°F)"
            name="targetTemp"
            value={newWalkIn.targetTemp}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Alert Preferences
          </Typography>
          <RadioGroup
            name="alertPref"
            value={newWalkIn.alertPref}
            onChange={handleInputChange}
          >
            <FormControlLabel value="email" control={<Radio />} label="E-mail Alert" />
            <FormControlLabel value="phone" control={<Radio />} label="Phone Alert" />
          </RadioGroup>

          {newWalkIn.alertPref && (
            <TextField
              label={`Preferred ${newWalkIn.alertPref === 'email' ? 'E-mail' : 'Phone'} for Alerts`}
              name="alertMethod"
              value={newWalkIn.alertMethod}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
          )}

          <Button variant="contained" onClick={addWalkIn} sx={{ mt: 2 }}>
            Save Walk-in
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ExampleDash;

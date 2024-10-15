import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import logo from '../assets/Waste.jpg';

const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Box display="flex" alignItems="center">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box
              component="img"
              src={logo}
              alt="WasteNought Logo"
              sx={{
                height: '120px', // Adjust the logo size here
                width: 'auto',
                marginRight: '10px',
              }}
            />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

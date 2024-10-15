import { createTheme } from '@mui/material/styles';

export const themeOptions = {
  palette: {
    mode: 'light', // Changed from 'type' to 'mode' for MUI v5
    primary: {
      main: '#fc5652',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#8bc9e5',
    },
  },
  typography: {
    fontFamily: '"Jost", sans-serif', // Set Jost as the default font for the entire app
  },
};

const theme = createTheme(themeOptions);
export default theme;

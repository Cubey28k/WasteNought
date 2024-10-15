import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import LearnMore from "./pages/LearnMore";
import Setup from "./pages/Setup";
import Header from "./components/Header"; // Importing Header
import CreateAccount from "./components/CreateAccount";
import ForgotPassword from "./pages/ForgotPassword";
import ExampleDash from "./pages/ExampleDash";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import theme from './components/Theme';
import './styles/App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header /> {/* Adding Header here */}
        <Container>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/initial-setup" element={<Setup />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/example-dash" element ={<ExampleDash/>} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;

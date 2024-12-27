import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import LearnMore from "./pages/LearnMore";
import Setup from "./pages/Setup";
import Header from "./components/Header";
import CreateAccount from "./components/CreateAccount";
import ForgotPassword from "./pages/ForgotPassword";
import ExampleDash from "./pages/ExampleDash";
import NotFound from "./pages/NotFound"; // Import the 404 page
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import theme from './components/Theme';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Header />
          <Container>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/initial-setup" element={<Setup />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/example-dash" element={<ExampleDash />} />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} /> {/* This will match all unknown routes */}
            </Routes>
          </Container>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

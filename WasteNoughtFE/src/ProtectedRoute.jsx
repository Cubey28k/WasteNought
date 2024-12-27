import React, { useContext } from "react";
import { Navigate } from "react-router-dom"; // Use Navigate instead of Redirect
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useContext(AuthContext);

  // If there is no user, redirect to login page
  if (!user) {
    return <Navigate to="/" />; // Redirects using Navigate
  }

  return element;
};

export default ProtectedRoute;

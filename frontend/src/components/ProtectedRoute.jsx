import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("adminToken"); // or your auth logic

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;

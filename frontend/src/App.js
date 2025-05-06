import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPasswordPopup from "./components/ForgotPasswordPopup";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetPasswordPopup from "./components/ResetPasswordPopup";
import Dashboard from "./pages/Dashboard";
import BuildPizza from "./pages/BuildPizza";
import OrderHistory from "./components/OrderHistory";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRegistration from "./components/AdminRegistration";
import { ToastContainer } from 'react-toastify';
import CartPage from "./pages/CartPage";
import 'react-toastify/dist/ReactToastify.css';

// Create a Layout component to wrap around the routes
const Layout = ({ children }) => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [showResetPasswordPopup, setShowResetPasswordPopup] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const location = useLocation();

  const hideLoginButton = [
    '/admin/login', 
    '/dashboard', 
    '/admin/dashboard',
    '/build',
    '/order-history'
  ];

  const shouldShowLoginButton = !hideLoginButton.includes(location.pathname);

  return (
    <div>
      {shouldShowLoginButton && (
        <div className="login-button-container">
          <button 
            className="login-button" 
            onClick={() => setShowLoginPopup(true)}
          >
            Log In
          </button>
        </div>
      )}

      {showLoginPopup && (
        <Login 
          isOpen={showLoginPopup} 
          onClose={() => setShowLoginPopup(false)} 
          onForgotPasswordClick={() => {
            setShowLoginPopup(false);
            setShowForgotPasswordPopup(true);
          }}
        />
      )}

<>
  {showForgotPasswordPopup && (
    <ForgotPasswordPopup
      isOpen={showForgotPasswordPopup}
      onClose={() => setShowForgotPasswordPopup(false)}
      onShowResetPassword={() => {
        setShowForgotPasswordPopup(false);
        setShowResetPasswordPopup(true);
      }}
      setResetToken={setResetToken}
    />
  )}

  {showResetPasswordPopup && (
    <ResetPasswordPopup
      isOpen={showResetPasswordPopup}
      onClose={() => setShowResetPasswordPopup(false)}
      token={resetToken}
    />
  )}
</>

      {/* Always render children (the main app routes) */}
      {children}
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      <ToastContainer />
      <Router>
        <Layout>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
            <Route path="/admin/register" element={<AdminRegistration />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/build"
              element={
                <ProtectedRoute>
                  <BuildPizza />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-history"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
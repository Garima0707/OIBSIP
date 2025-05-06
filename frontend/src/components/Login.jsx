import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import "../styles/Login.css";

const Login = ({ isOpen, onClose, onForgotPasswordClick }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      const userData = res.data.user;
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      toast.success("Login successful!", { position: "top-center" });

      navigate("/dashboard");
      onClose && onClose(); // Close popup if onClose is provided
      setFormData({ email: "", password: "" });
    } catch (err) {
      toast.error("Login failed", { position: "bottom-center" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Reusable content for both regular and popup modes
  const renderLoginForm = () => (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Username</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your username"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {message && <p className="success-message">{message}</p>}
        <button type="submit" className="auth-button">
          Login
        </button>
        <div className="auth-links">
          {isOpen ? (
            <button 
              onClick={onForgotPasswordClick} 
              className="link-button"
              type="button"
            >
              Forgot Password?
            </button>
          ) : (
            <Link to="/forgot-password" className="link-button">
              Forgot Password?
            </Link>
          )}
        </div>
        <div className="auth-links" style={{ marginTop: '10px' }}>
          {isOpen ? (
            <button 
              onClick={() => navigate('/register')} 
              className="link-button"
              type="button"
            >
              Register Now
            </button>
          ) : (
            <Link to="/register" className="link-button">
              Register Now
            </Link>
          )}
        </div>
      </form>
    </div>
  );

  // Render left panel with illustration
  const renderLeftPanel = () => (
    <div className="login-left-panel">
      <img src="../images/logo.png" alt="Logo" className="login-logo" />
      <div className="login-bubble-bg">
        <div className="login-bubble login-bubble-1"></div>
        <div className="login-bubble login-bubble-2"></div>
        <div className="login-bubble login-bubble-3"></div>
        <div className="login-bubble login-bubble-4"></div>
        <div className="login-bubble login-bubble-5"></div>
      </div>
      <img 
        src={require("../images/pizzaBg.png")}
        alt="Pizza Illustration" 
        className="login-illustration" 
      />
    </div>
  );


  // If this is not used as a popup, render normally
  if (!isOpen) {
    return (
      <div className="login-container">
        {renderLeftPanel()}
        <div className="login-right-panel">
          {renderLoginForm()}
        </div>
      </div>
    );
  }

  // Render as popup
  return (
    <div className="login-popup-overlay" onClick={onClose}>
      <div className="login-popup" onClick={(e) => e.stopPropagation()}>
        <button className="login-close-btn" onClick={onClose}>×</button>
        {renderLeftPanel()}
        <div className="login-right-panel">
          {renderLoginForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;
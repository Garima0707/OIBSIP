import React, { useState } from "react";
import api from "../api";
import "../styles/Login.css"; // Assuming your popup styles are here

const ResetPasswordPopup = ({ token, isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        password,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="login-popup-overlay" onClick={onClose}>
      <div className="login-popup" onClick={(e) => e.stopPropagation()}>
        <button className="login-close-btn" onClick={onClose}>×</button>
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Update Password</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ResetPasswordPopup;

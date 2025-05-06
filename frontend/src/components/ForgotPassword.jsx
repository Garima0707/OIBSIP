import React, { useState } from "react";
import api from "../api";

const ForgotPassword = ({ isOpen, onClose, onShowResetPassword, setResetToken }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showResetLink, setShowResetLink] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setShowResetLink(false); // don't show reset popup manually
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };
  

  return (
    <div className="popup">
      <div className="popup-content">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <p>{message}</p>
      </div>
    </div>
  );
};

export default ForgotPassword;

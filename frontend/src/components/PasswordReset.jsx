// pages/PasswordResetRequest.jsx
import React, { useState } from "react";
import api from "../api";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");

  const handleResetRequest = async () => {
    try {
      await api.post("/admin/auth/reset-password-request", { email });
      alert("Password reset email sent.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleResetRequest}>Send Reset Link</button>
    </div>
  );
};

export default PasswordResetRequest;

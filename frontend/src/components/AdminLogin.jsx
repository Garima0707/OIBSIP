import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();  // Using useNavigate for redirect

  const handleLogin = async () => {
    try {
      console.log("Logging in with", { email, password });
      const res = await api.post("/admin/auth/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      onLogin(); // Calls the onLogin function passed as a prop

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminLogin;

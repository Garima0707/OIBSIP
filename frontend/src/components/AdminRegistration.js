import React, { useState } from "react";
import api from "../api";
import { ClipLoader } from "react-spinners"; // For the loading spinner

const AdminRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters with letters and numbers
    if (password.length === 0) return "";
    if (strongRegex.test(password)) return "Strong";
    if (password.length >= 6) return "Medium";
    return "Weak";
  };

  const handleRegister = async () => {
    setError("");
    setSuccess(false);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/admin/auth/register", { email, password });

      // Registration successful
      setSuccess(true);
      setError("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message = err.response?.data?.error || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Admin Registration</h2>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      {/* Password Strength Indicator */}
      <div>
        {password && (
          <p>
            Password Strength:{" "}
            <span
              style={{
                color:
                  checkPasswordStrength(password) === "Strong"
                    ? "green"
                    : checkPasswordStrength(password) === "Medium"
                    ? "orange"
                    : "red",
              }}
            >
              {checkPasswordStrength(password)}
            </span>
          </p>
        )}
      </div>

      {/* Confirm Password Input */}
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      {/* Error or Success Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Registration successful!</p>}

      {/* Loading Spinner or Register Button */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <ClipLoader color="#00C49F" size={50} />
        </div>
      ) : (
        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#00C49F",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      )}
    </div>
  );
};

export default AdminRegistration;

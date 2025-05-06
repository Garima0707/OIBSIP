import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import api from "../api";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <AuthForm formType="register" formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
      <p>{message}</p>
    </div>
  );
};

export default Register;

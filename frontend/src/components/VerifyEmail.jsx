import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      api
        .get(`/auth/verify-email?token=${token}`)
        .then((res) => {
          setMessage("Email verified successfully! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 3000); // redirect after 3 seconds
        })
        .catch((err) => {
          setMessage(err.response?.data?.message || "Verification failed");
        });
    }
  }, [params, navigate]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;

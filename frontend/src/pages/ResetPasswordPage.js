// pages/ResetPasswordPage.js
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ResetPasswordPopup from "../components/ResetPasswordPopup"; // <-- use the popup

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urlToken = searchParams.get("token");
    const email = searchParams.get("email");

    if (urlToken && email) {
      api
        .get(`/auth/validate-reset-token?token=${urlToken}&email=${email}`)
        .then(() => {
          setToken(urlToken);
          setIsValid(true);
          setIsOpen(true);
        })
        .catch(() => {
          setMessage("Invalid or expired reset link");
        });
    }
  }, []);

  return (
    <>
      {isValid && (
        <ResetPasswordPopup
        
          token={token}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {!isValid && <p>{message}</p>}
    </>
  );
};

export default ResetPasswordPage;

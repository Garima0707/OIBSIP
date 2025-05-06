import React from "react";
import ForgotPassword from "./ForgotPassword";
import "../styles/Login.css";

const ForgotPasswordPopup = ({ isOpen, onClose, onShowResetPassword, setResetToken }) => {
  if (!isOpen) return null;

  return (
    <div className="login-popup-overlay" onClick={onClose}>
      <div className="login-popup" onClick={(e) => e.stopPropagation()}>
      <button className="login-close-btn" onClick={onClose}>×</button>
        <ForgotPassword 
          isOpen={isOpen}
          onClose={onClose}
          onShowResetPassword={onShowResetPassword}
          setResetToken={setResetToken}
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;

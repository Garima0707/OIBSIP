const express = require("express");
const router = express.Router();
const { register, verifyEmail, login, forgotPassword, resetPassword,validateResetToken } = require("../controllers/authController");

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/validate-reset-token", validateResetToken);

module.exports = router;

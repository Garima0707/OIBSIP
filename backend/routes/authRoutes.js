const express = require("express");
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/reset/:token", resetPassword);

module.exports = router;

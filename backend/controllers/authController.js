const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const user = await User.create({
      name,
      email,
      password: hashed,
      verificationToken: token,
    });

    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await sendEmail(email, "Verify your email", `<a href="${url}">Click to verify</a>`);

    res.status(201).json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(401).json({ message: "Invalid credentials or not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate JWT token (expires in 15 minutes)
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

  // Construct the reset link
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${email}`;

  // Send email
  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
  });
  
  res.status(200).json({ message: "Reset link sent to email" });
};

// GET /auth/validate-reset-token?token=...&email=...
exports.validateResetToken = async (req, res) => {
  const { token, email } = req.query;
  console.log("Received token validation request", token, email);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== email) {
      return res.status(400).json({ message: "Invalid token" });
    }

    res.status(200).json({ message: "Token valid" });
  } catch (err) {
    console.error("Token validation failed", err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};


// POST /auth/reset-password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password; // hash via pre-save middleware
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

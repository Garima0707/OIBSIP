const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { getPaymentStats } = require("../controllers/adminController");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email });
  
      if (!admin) {
        console.log("Admin not found for email:", email);
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const isMatch = await admin.comparePassword(password);
      console.log("Password match result:", isMatch);  // Debugging log
  
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
  
      res.json({ token });
    } catch (err) {
      console.error("Admin login error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  

  router.post("/auth/register", async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
  
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists" });
      }
  
      const admin = new Admin({ email, password });
  
      const savedAdmin = await admin.save(); // <--- await and store result
  
      console.log("Admin saved:", savedAdmin); // Debug log
  
      res.status(201).json({ message: "Admin registered successfully" });
    } catch (err) {
      console.error("Admin registration error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
 
  router.post("/reset-password-request", async (req, res) => {
    const { email } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
  
      const token = crypto.randomBytes(20).toString("hex");
      admin.resetPasswordToken = token;
      admin.resetPasswordExpire = Date.now() + 3600000; // 1 hour
  
      await admin.save();
  
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        to: admin.email,
        from: process.env.EMAIL_USER,
        subject: "Password Reset",
        text: `You requested a password reset. Click the link to reset your password: ${process.env.BASE_URL}/admin/reset-password/${token}`,
      };
  
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).json({ error: "Error sending email" });
        }
        res.status(200).json({ message: "Password reset email sent" });
      });
    } catch (err) {
      console.error("Password reset request error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // routes/adminAuthRoutes.js
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      const admin = await Admin.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!admin) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }
  
      admin.password = await bcrypt.hash(newPassword, 10);
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;
  
      await admin.save();
      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.error("Password reset error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  router.post("/refresh-token", async (req, res) => {
    const refreshToken = req.body.refreshToken;
  
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const newAccessToken = jwt.sign({ adminId: decoded.adminId }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
  
      res.json({ newAccessToken });
    } catch (err) {
      res.status(403).json({ error: "Invalid refresh token" });
    }
  });
  
router.get("/payment-stats", getPaymentStats);

module.exports = router;

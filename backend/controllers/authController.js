const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
    });

    const verificationLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
    await sendEmail(email, "Verify your email", `<a href="${verificationLink}">Click to verify</a>`);

    res.status(201).json({ msg: "Registered. Check email for verification." });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

  user.verified = true;
  user.verificationToken = "";
  await user.save();

  res.json({ msg: "Email verified!" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    if (!user.verified) return res.status(400).json({ msg: "Email not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail(email, "Reset your password", `<a href="${resetLink}">Reset Password</a>`);

  res.json({ msg: "Reset link sent to email." });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  res.json({ msg: "Password reset successful." });
};

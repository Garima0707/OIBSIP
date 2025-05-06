// razorpayConfig.js
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID (from Razorpay dashboard)
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

module.exports = razorpayInstance;

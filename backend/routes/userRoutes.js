const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const razorpay = require("../config/razorpayConfig");
const Payment = require("../models/Payment");
const { getPizzaVarieties, buildCustomPizza } = require("../controllers/userController");
const { getOrderHistory } = require("../controllers/userController");

router.get("/pizzas", authMiddleware, getPizzaVarieties);
router.post("/build", authMiddleware, buildCustomPizza);

// Create a new Razorpay order
router.post("/create-order", async (req, res) => {
    try {
      // Get the amount in paise (INR * 100)
      const { amount } = req.body;
  
      // Create an order with Razorpay API
      const options = {
        amount: amount, // amount in paise
        currency: "INR", // currency type
        receipt: `order_${Math.floor(Math.random() * 1000000)}`, // unique receipt ID
        payment_capture: 1, // automatic capture
      };
  
      // Create the order
      const order = await razorpay.orders.create(options);
  
      // Send the order details back to the frontend
      res.json({
        orderId: order.id,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID, // Razorpay key
      });
    } catch (err) {
      console.error("Error creating order:", err);
      res.status(500).json({ error: "Error creating order" });
    }
  });

  
// Successful Payment
router.post("/payment-success", authMiddleware, async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, pizza } = req.body;
      await Payment.create({
        user: req.user.id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        amount,
        pizza,
        status: "success",
      });
      res.status(200).json({ message: "Payment saved successfully" });
    } catch (err) {
      console.error("Payment success save error:", err);
      res.status(500).json({ error: "Could not save successful payment" });
    }
  });

  // Failed Payment
router.post("/payment-failed", authMiddleware, async (req, res) => {
    try {
      const { orderId, amount } = req.body;
      await Payment.create({
        user: req.user.id,
        orderId,
        amount,
        status: "failed",
      });
      res.status(200).json({ message: "Failed payment saved" });
    } catch (err) {
      console.error("Payment failure save error:", err);
      res.status(500).json({ error: "Could not save failed payment" });
    }
  });

  router.get("/order-history", authMiddleware, getOrderHistory);
  
module.exports = router;

const Pizza = require("../models/Pizza");
const CustomPizza = require("../models/CustomPizza");
const razorpayInstance = require("../config/razorpayConfig");
const Payment = require("../models/Payment");

const getPizzaVarieties = async (req, res) => {
    try {
      const pizzas = await Pizza.find({ isAvailable: true });
      res.json(pizzas);
    } catch (err) {
      res.status(500).json({ message: "Error fetching pizzas" });
    }
  };
  

// Pricing rules (basic)
const prices = {
    base: 100,
    sauce: 40,
    cheese: 60,
    veggie: 20, // per veggie
  };
  
  const buildCustomPizza = async (req, res) => {
    try {
      const { base, sauce, cheese, veggies } = req.body;
  
      const totalPrice =
        prices.base + prices.sauce + prices.cheese + (veggies.length * prices.veggie);
  
      const newPizza = new CustomPizza({
        user: req.user.id,
        base,
        sauce,
        cheese,
        veggies,
        price: totalPrice,
      });
  
      await newPizza.save();
  
      res.json({ message: "Custom pizza created", pizza: newPizza });
    } catch (err) {
      console.error("Error building pizza:", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  };
  

  // Handler for creating a Razorpay order
exports.createOrder = async (req, res) => {
    const { amount } = req.body; // This amount should be calculated on the frontend (in paise)
  
    try {
      const options = {
        amount: amount * 100, // amount in paise
        currency: "INR",
        receipt: "order_rcptid_11", // You can use your own receipt ID logic
        payment_capture: 1, // 1: auto-capture, 0: manual capture
      };
  
      razorpayInstance.orders.create(options, (err, order) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID,
        });
      });
    } catch (err) {
      console.error("Error creating order:", err);
      res.status(500).json({ message: "Error creating Razorpay order" });
    }
  };

  const getOrderHistory = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const filter = { user: req.user.id, status: "success" };
  
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
  
      const payments = await Payment.find(filter).sort({ createdAt: -1 });
      res.status(200).json(payments);
    } catch (err) {
      console.error("Error fetching order history:", err);
      res.status(500).json({ error: "Could not fetch order history" });
    }
  };
  

  module.exports = {
    getPizzaVarieties,
    buildCustomPizza,
    getOrderHistory,
  };
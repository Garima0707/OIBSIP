const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const Razorpay = require("razorpay");
require("dotenv").config();

const app = express();
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminInventoryRoutes = require('./routes/adminInventoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
connectDB();

app.use(cors());
app.use(express.json());

// Initialize Razorpay with the credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

app.use("/api/auth", require("./routes/authRoutes"));
//app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", adminRoutes );
app.use("/api/user", userRoutes);

app.use('/api/admin/inventory', adminInventoryRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

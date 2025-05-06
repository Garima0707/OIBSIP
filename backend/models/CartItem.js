// models/CartItem.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pizzaId: { type: String, required: true },
  name: String,
  description: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('CartItem', CartItemSchema);

const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String, // optional image URL
  category: String, // veg, non-veg, classic, etc.
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Pizza", pizzaSchema);

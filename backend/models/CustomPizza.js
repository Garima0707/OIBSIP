const mongoose = require("mongoose");

const CustomPizzaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  base: String,
  sauce: String,
  cheese: String,
  veggies: [String],
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CustomPizza", CustomPizzaSchema);

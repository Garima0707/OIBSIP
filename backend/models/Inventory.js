// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  base: { type: Number, default: 100 },
  sauce: { type: Number, default: 100 },
  cheese: { type: Number, default: 100 },
  veggies: { type: Number, default: 100 },
  meat: { type: Number, default: 100 },
});

module.exports = mongoose.model('Inventory', inventorySchema);

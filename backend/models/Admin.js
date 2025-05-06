// models/Admin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    console.log("Hashing password before save"); // Debug
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  

// Method to compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log("Password match result:", isMatch); // Debugging line
    return isMatch;
  };
  
  

module.exports = mongoose.model("Admin", adminSchema);

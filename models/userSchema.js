const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  address: {
    type: String,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
  },
  role: {
    type: String,
    default: "user",
  },
});

module.exports = mongoose.model("user", userSchema);

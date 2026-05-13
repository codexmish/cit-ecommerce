const express = require("express")
const { signUp, verifyOtp } = require("../controllers/authController")
const route = express.Router()


route.post("/signup", signUp)
route.post("/verify-otp", verifyOtp)


module.exports = route
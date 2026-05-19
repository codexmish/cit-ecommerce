const express = require("express")
const { signUp, verifyOtp, resendOtp } = require("../controllers/authController")
const route = express.Router()


route.post("/signup", signUp)
route.post("/verify-otp", verifyOtp)
route.post("/resend-otp", resendOtp)


module.exports = route
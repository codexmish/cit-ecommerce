const express = require("express")
const { signUp, verifyOtp, resendOtp, signIn } = require("../controllers/authController")
const route = express.Router()


route.post("/signup", signUp)
route.post("/verify-otp", verifyOtp)
route.post("/resend-otp", resendOtp)
route.post("/signin", signIn)


module.exports = route
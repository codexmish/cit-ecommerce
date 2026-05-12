const {
  isValidateEmail,
  isValidatePassword,
  generateOTP,
} = require("../helpers/utils");
const userSchema = require("../models/userSchema");
const { OTPMailTemp } = require("../helpers/emailTemplates");

const { otpMailSender } = require("../helpers/mailService");

const signUp = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    // -------name validation
    if (!fullname)
      return res
        .status(400)
        .send({ success: false, message: "Full Name Required" });

    // -------email validation
    if (!email)
      return res
        .status(400)
        .send({ success: false, message: "Email is Required" });

    if (!isValidateEmail(email))
      return res
        .status(400)
        .send({ success: false, message: "Email not valid" });

    // -------password validation
    if (!password)
      return res
        .status(400)
        .send({ success: false, message: "Password is Required" });

    if (!isValidatePassword(password))
      return res
        .status(400)
        .send({ success: false, message: "Password is not valid" });

    // ---------checking if email already exist
    const existEmail = await userSchema.findOne({ email });
    if (existEmail)
      return res
        .status(400)
        .send({ success: false, message: "This email already exist" });

    // otp generate
    const otp = generateOTP();

    // user create
    const user = userSchema.create({
      fullname,
      email,
      password,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    otpMailSender({
      email,
      subject: "verify your OTP",
      template: OTPMailTemp(otp),
    });

    res.status(200).send({
      success: true,
      message: "SignUp successfull, verify your email",
    });
  } catch (error) {
    console.log(error);

    return res
      .status(400)
      .send({ success: false, message: "Inteernal Server Error" });
  }
};

module.exports = { signUp };

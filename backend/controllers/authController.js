const {
  isValidateEmail,
  isValidatePassword,
  generateOTP,
  generatAccessToken,
  generatRefreshToken,
  coludinaryUpload,
} = require("../helpers/utils");
const userSchema = require("../models/userSchema");
const { OTPMailTemp } = require("../helpers/emailTemplates");

const { otpMailSender } = require("../helpers/mailService");

// --------signup controller
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

    // otp mail send
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
    return res
      .status(400)
      .send({ success: false, message: "Inteernal Server Error" });
  }
};

// ---------verify otp controller
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // checking userdata and update
    const userData = await userSchema.findOneAndUpdate(
      {
        email,
        otp,
        otpExpiry: { $gt: new Date() },
        isVerified: false,
      },
      {
        $set: {
          isVerified: true,
          otp: null,
          otpExpiry: null,
        },
      },
      {
        returnDocument: "after",
      },
    );

    console.log(userData);
    

    // checking if userdata not found
    if (!userData)
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request 4" });

    res
      .status(200)
      .send({ success: true, message: "otp verified successfully" });

    // res.redirect("/login")
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Inteernal Server Error" });
  }
};

// ---------resend otp controller
const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const userData = await userSchema.findOne({ email, isVerified: false });

    if (!userData)
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });

    // otp generate
    const otp = generateOTP();

    userData.otp = otp;
    userData.otpExpiry = Date.now() + 5 * 60 * 1000;
    await userData.save();

    // otp mail send
    otpMailSender({
      email,
      subject: "verify your OTP",
      template: OTPMailTemp(otp),
    });

    res.status(200).send({
      success: true,
      message: "New OTP sent on your email",
    });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Inteernal Server Error" });
  }
};

// ---------cookie config
const cookie_config = {
  httpOnly: false, // Not accessible by client-side JS
  secure: false, // Only sent over HTTPS
  // sameSite: 'Strict' // Only send for same-site requests
};

// ----------sign in controller
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await userSchema.findOne({ email }).select("+password");
    if (!userData) {
      return res.status(400).send({ success: false, message: "no user found" });
    }

    if (userData.isVerified === false) {
      return res
        .status(400)
        .send({ success: false, message: "user not verified" });
    }

    const matchPassword = await userData.comparePassword(password);

    if (!matchPassword) {
      return res.status(400).send({ success: false, message: "Invalid pass" });
    }

    // -----generate jwt token
    const accessToken = generatAccessToken(userData);
    const refreshToken = generatRefreshToken(userData);

    res
      .status(200)
      .cookie("acc_tkn", accessToken, cookie_config)
      .cookie("ref_tkn", refreshToken, cookie_config)
      .send({ success: true, message: "login successfully" });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Inteernal Server Error" });
  }
};

// ---------profile controller
const getProfile = async (req, res) => {
  try {
    console.log(req.user);

    const profileData = await userSchema.findOne(
      { _id: req.user._id },
      { fullname: 1, email: 1, role: 1, avatar: 1, address: 1 },
    );
    if (!profileData)
      return res
        .status(400)
        .send({ success: false, message: "invalid request" });

    return res.status(200).send({ success: true, message: profileData });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Inteernal Server Error" });
  }
};

// --------update profile
const updateProfile = async (req, res) => {
  const { fullname, address } = req.body;
  const avatar = req.file;

  try {
    // checking user
    const userData = await userSchema.findOne({ _id: req.user._id });
    console.log(userData);
    console.log(avatar);
    
    

    if (!userData) {
      return res.status(400).send({ message: "something went wrong" });
    }

    // updating fullname
    if (fullname && fullname.trim()) {
      userData.fullname = fullname;
    }

    // updating address
    if (address && address.trim()) {
      userData.address = address;
    }

    // avatar update

    if(avatar){
      const cloudeRes = coludinaryUpload({mimetype: avatar.mimetype, imgBuffer: avatar.buffer})
    }
    console.log(cloudeRes);
    
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Inteernal Server Error" });
  }
};

module.exports = {
  signUp,
  verifyOtp,
  resendOtp,
  signIn,
  getProfile,
  updateProfile,
};

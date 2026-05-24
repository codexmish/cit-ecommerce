const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cloudinaryConfig = require("../configs/cloudinaryConfig");


// ---email razex
function isValidateEmail(email) {
  const emailRagex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRagex.test(email);
}


// ---password razex
function isValidatePassword(password) {
  const passwordRagex = /^.{6,}$/;
  return passwordRagex.test(password);
}


// ---otp generator
const generateOTP = () => {
  return crypto.randomInt(1000, 10000).toString();
};


// ---access toke generate
const generatAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SEC,
    { expiresIn: "1h" },
  );
};


// ---refresh toke generate
const generatRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SEC,
    { expiresIn: "15d" },
  );
};


// ---cloudinary update
const coludinaryUpload = async (mimetype, imgBuffer)=>{
  const dataUrl = `data:${mimetype}; base64,${imgBuffer.toString("base64")}`

  return await cloudinaryConfig.uploader.upload(dataUrl)
}

module.exports = {
  isValidateEmail,
  isValidatePassword,
  generateOTP,
  generatAccessToken,
  generatRefreshToken,
  coludinaryUpload
};

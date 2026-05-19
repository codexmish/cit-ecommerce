const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function isValidateEmail(email) {
  const emailRagex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRagex.test(email);
}

function isValidatePassword(password) {
  const passwordRagex = /^.{6,}$/;
  return passwordRagex.test(password);
}

const generateOTP = () => {
  return crypto.randomInt(1000, 10000).toString();
};

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

module.exports = {
  isValidateEmail,
  isValidatePassword,
  generateOTP,
  generatAccessToken,
  generatRefreshToken,
};

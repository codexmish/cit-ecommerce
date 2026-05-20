const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  try {
    const { acc_tkn } = req.cookies;

    const decoded = jwt.verify(acc_tkn, process.env.JWT_SEC);

    if (decoded) {
      req.user = decoded;
      next();
    } else {
      res.status(401).send({ success: false, message: "unauthorized request" });
    }
  } catch (error) {
    console.log(error);

    res
      .status(401)
      .send({ success: false, message: "11 unauthorized request" });
  }
};

module.exports = { authMiddleware };

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
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
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
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
      require: true,
      default: "user",
      enum: ["user", "moderator", "admin"],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const round = 10;
    const salt = await bcrypt.genSalt(round);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server Error" });
  }
});

userSchema.methods.comparePassword = async function (plainPass) {
  return await bcrypt.compare(plainPass, this.password);
};

module.exports = mongoose.model("user", userSchema);

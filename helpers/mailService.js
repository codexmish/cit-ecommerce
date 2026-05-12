const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: "",
    pass: "",
  },
});

const otpMailSender = async ({ email, subject, template }) => {
  try {
    await transporter.sendMail({
      from: '"GoCommerce" <team@goCommerce.com>', // sender address
      to: email, // list of recipients
      subject: subject, // subject line
      html: template, // HTML body
    });
  } catch (error) {
    console.log("Error while sending mail", error);
  }
};

module.exports = { otpMailSender };

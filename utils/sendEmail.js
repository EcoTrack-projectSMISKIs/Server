const nodemailer = require("nodemailer");

const sendEmailToMultipleRecipients = async (emails, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM, // Your Gmail account
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  await transporter.sendMail({
    from: `"EcoTrack Admin" <${process.env.EMAIL_FROM}>`,
    to: emails.join(","),
    subject,
    html,
  });
};

module.exports = { sendEmailToMultipleRecipients };
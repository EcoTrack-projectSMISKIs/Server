const axios = require("axios");

const sendVerificationEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "EcoTrack Verification <noreply@ecotrack.online>",
        to: [to],
        subject,
        html,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Verification email sent:", response.data);
  } catch (error) {
    console.error("Failed to send verification email:", error.response?.data || error.message);
  }
};

module.exports = { sendVerificationEmail };
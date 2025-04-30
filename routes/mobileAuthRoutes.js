const express = require("express");
const {
  register,
  login,
  verifyUserWithOTP,
  resendVerification,
  requestOTP,
  resetPasswordWithOTP,
} = require("../controllers/mobileAuthController");

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyUserWithOTP);
router.post("/resend-verification", resendVerification);
router.post("/request-otp", requestOTP);
router.post("/reset-password", resetPasswordWithOTP);

module.exports = router;
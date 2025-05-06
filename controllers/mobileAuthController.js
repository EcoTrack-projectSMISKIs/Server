const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const barangaysInNasugbu = require("../constants/barangays");
const { sendVerificationEmail } = require("../utils/mailer");

// note on line 26

// Generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
exports.register = async (req, res) => {
  const { name, username, phone, email, password, barangay } = req.body;

  try {
    if (!barangaysInNasugbu.includes(barangay)) {
      return res.status(400).json({ message: "Invalid barangay selected" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }, { phone }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);    
    
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      name,
      username,
      phone,
      email,
      password: hashedPassword,
      barangay,
      isVerified: false,
      verificationOTP,
      verificationOTPExpiry: Date.now() + 10 * 60 * 1000, // 10 mins
    });

    const message = `
      <div style="font-family: Arial, sans-serif;">
        <h2>EcoTrack Verification</h2>
        <p>Your OTP code is:</p>
        <h3>${verificationOTP}</h3>
        <p>Expires in 10 minutes.</p>
      </div>
    `;

    await sendVerificationEmail(email, "EcoTrack Account Verification", message);

    res.status(201).json({ message: "User registered. OTP sent to email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }, { phone: identifier }],
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your account first." });
    }

    const token = generateToken(user._id, "user");

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        barangay: user.barangay,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Verify User OTP
exports.verifyUserWithOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email,
      verificationOTP: otp,
      verificationOTPExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpiry = undefined;
    await user.save();

    res.json({ message: "Account verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Resend Verification OTP
exports.resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = otp;
    user.verificationOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `
      <div style="font-family: Arial, sans-serif;">
        <h2>EcoTrack Verification</h2>
        <p>Your OTP code is:</p>
        <h3>${otp}</h3>
        <p>Expires in 10 minutes.</p>
      </div>
    `;

    await sendVerificationEmail(email, "Resend EcoTrack OTP", message);

    res.json({ message: "OTP resent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Request OTP for Password Reset
exports.requestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `
      <div style="font-family: Arial, sans-serif;">
        <h2>EcoTrack Password Reset</h2>
        <p>Your OTP code is:</p>
        <h3>${otp}</h3>
        <p>Expires in 10 minutes.</p>
      </div>
    `;

    await sendVerificationEmail(email, "EcoTrack Password Reset OTP", message);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password with OTP
exports.resetPasswordWithOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
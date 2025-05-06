const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  barangay: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationOTP: String,
  verificationOTPExpiry: Date,
  otp: String,
  otpExpiry: Date,

  // added plugs reference array
  plugs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plug' }]
  // plugs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plug' }]

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
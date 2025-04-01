const mongoose = require("mongoose");

const UserOTPVerificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true }, // OTP must be stored
  createdat: { type: Date, required: true, default: Date.now }, // Auto-set creation date
  expiresat: { type: Date, required: true }, // Expiry time
});

// Define and export the model
const UserOTPVerification = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);
module.exports = UserOTPVerification;

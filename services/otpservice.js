const Otp = require("../models/otpmodel");
const logger = require("../utils/logger");
const bcrypt = require("bcryptjs");

const deleteUserOtpsByUserId = async (userId) => {
  try {
    await Otp.deleteOne({ userId: userId }); // More efficient than deleteMany
    logger.info(`Deleted previous OTP for ${userId}`);
  } catch (err) {
    logger.error(err.message);
    throw new Error("Internal Server Error");
  }
};

const createUserOtp = async (userId) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const newotp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const hashedOTP = await bcrypt.hash(newotp, salt);

    const userOtp = new Otp({
      userId: userId,
      otp: hashedOTP,
      createdat: Date.now(),
      expiresat: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
    });

    await userOtp.save();
    return newotp;
  } catch (err) {
    logger.error(err.message);
    throw new Error("Internal Server Error");
  }
};

const findUserOtpByUserId = async (userId) => {
  try {
    const otpDetail = await Otp.findOne({ userId: userId });

    if (!otpDetail) return null;

    // Check if OTP is expired
    if (otpDetail.expiresat < Date.now()) {
      await Otp.deleteOne({ userId: userId }); // Delete expired OTP
      return null;
    }

    logger.info(`OTP details found for ${userId}`);
    return otpDetail;
  } catch (err) {
    logger.error(err.message);
    throw new Error("Internal Server Error");
  }
};

module.exports = { deleteUserOtpsByUserId, createUserOtp, findUserOtpByUserId };

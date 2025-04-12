require("express-async-errors");
const otpServices = require("../services/otpservice");
const emailServices = require("../services/emailservice");
const userServices = require("../services/userservice");
const logger = require("../utils/logger");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const Feedback = require("../models/feedbackmodel");

const contact = async (req, res, next) => {
  try {
    const { fullName, email, subject, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    // Store feedback in the database
    const newFeedback = new Feedback({
      fullName,
      emailAddress,
      subject,
      message,
    });
    await newFeedback.save();

    // Construct email body
    const emailBody = `
      Full Name: ${fullName}
      Email Address: ${emailAddress}

      Message:
      ${message}
    `;

    // Send email
    await emailServices.sendEmail(
      "yctcscrepository@gmail.com",
      subject,
      emailBody
    );

    return res.status(200).json({
      status: "success",
      message: "Feedback successfully logged and stored",
    });
  } catch (err) {
    logger.error("Customers Feedback:", err);
    next(err);
  }
};

// Signup New User
const signup = async (req, res) => {
  try {
    let { studentStaffID, email, password, confirmPassword, department } = req.body;

    studentStaffID = studentStaffID.trim();
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();
    department = department.trim();


    // Validate input
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Missing a required field." });
    }

    if (!studentStaffID) {
      studentStaffID = null;
      department = null;
      role = 'others'
    } else if (/^F\/(ND|HD)\/\d{2}\/\d+$/.test(studentStaffID)) {
      role = 'student' 
    } else {
      role = 'staff';
    }

    if (role != 'others') {
      const existingUser = await userServices.findUserByOne("$or", [
        { studentStaffID },
        { email },
      ]);

      if (existingUser) {
        return res.status(400).json({ message: "User with this email or Id already exists." });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (isVerified: false)
    const newUser = await userServices.createUser({
      studentStaffID,
      email,
      password: hashedPassword,
      department,
      role
    });

    // Generate OTP
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`; // 6-digit OTP

    // Store hashed OTP in database
    await otpServices.createUserOtp(newUser._id, otp);

    // Send OTP to user's email
    await emailServices.sendOtpEmail(email, otp);

    return res.status(201).json({
      message: "Signup successful. Please verify your email with the OTP sent.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { studentStaffID, otp, email } = req.body;

    // Validate input
    if (!(studentStaffID || email) && !otp) {
      return res.status(400).json({ message: "All required fields are expected to be filled." });
    }

    // Find user by studentStaffID
    let user = await userServices.findUserByOne(
      "studentStaffID",
      studentStaffID
    );

    // Find user by email
    if (!user) {
      user = await userServices.findUserByOne("email", email);
    }

    // User not found
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find OTP record
    const otpRecord = await otpServices.findUserOtpByUserId(user._id);
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Check OTP expiration
    if (Date.now() > otpRecord.expiresat) {
      await otpServices.deleteUserOtpsByUserId(user._id); // Remove expired OTP
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one." });
    }

    // Compare OTP
    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Incorrect OTP." });
    }

    // Update user as verified
    await userServices.updateUserByOne(user._id);

    // Delete OTP after successful verification
    await otpServices.deleteUserOtpsByUserId(user._id);

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Resend OTP
const resendOTPCode = async (req, res, next) => {
  try {
    const { studentStaffID, email } = req.body;

    // Validate input
    if (!(studentStaffID || email)) {
      return res.status(400).json({
        status: "error",
        message: "Student/Staff ID or Email is required.",
      });
    }

    // Find user by studentStaffID
    let user = await userServices.findUserByOne(
      "studentStaffID",
      studentStaffID
    );

    // Find user by email
    if (!user) {
      user = await userServices.findUserByOne("email", email);
    }

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    // Delete existing OTPs associated with the user
    await otpServices.deleteUserOtpsByUserId(user._id);

    // Generate a new OTP
    const otp = await otpServices.createUserOtp(user._id);

    // Send OTP via email
    await emailServices.sendOtpEmail(user.email, otp);
    logger.info(`OTP resent to email: ${user.email}`);

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully. Check your email.",
    });
  } catch (err) {
    logger.error("Error in ResendOTP:", err);
    next(err);
  }
};

// Login User
const login = async (req, res, next) => {
  try {
    const { email, studentStaffID, password } = req.body;

    // Validate input
    if (!(email || studentStaffID) && !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    // Find user by email
    let user = await userServices.findUserByOne("email", email);

    //Find user by studentStaffID
    if (!user) {
      user = await userServices.findUserByOne("studentStaffID", studentStaffID);
    }

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found. Please check your email",
      });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
    }

    // Check if the user has verified their email
    if (!user.isVerified) {
      return res.status(403).json({
        status: "error",
        message:
          "Email not verified. Please verify your email before logging in.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // Return success response with token
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (err) {
    console.error("Error in login function:", err);
    next(err);
  }
};

//Get Users Personalinfo ?? working
const personalInfo = async (req, res, next) => {
  try {
    const user = await userServices.findUserByOne("_id", req.userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User data successfully retrieved",
      data: {
        studentStaffID: user.studentStaffID,
        email: user.email,
        department: user.department,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        role: user.role,
        approved: user.approved,
      },
    });
  } catch (err) {
    logger.error("Settings/personalInfo: ", err);
    next(err);
  }
};

// Update user personalinfo
const updatePersonalInfo = async (req, res, next) => {
  logger.info("Settings/updatePersonalInfo");
  let { department, studentStaffID } = req.body; // Only department can be updated
  try {
    let user = await userServices.findUserById(req.userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Update department if provided
    if (user.approved){
      return res.status(400).json({
        status: "error",
        message: "Attempting to update an already approved account",
      });
    }

    user.department = department || user.department;
    user.studentStaffID = studentStaffID;

    if (!studentStaffID) {
      user.studentStaffID = null;
      user.department = null;
      role = 'others'
    } else if (/^F\/(ND|HD)\/\d{2}\/\d+$/.test(studentStaffID)) {
      role = 'student' 
    } else {
      role = 'staff';
    }

    if (role != 'others') {
      const existingUser = await userServices.findUserByOne(
        "studentStaffID", studentStaffID
      );

      if (existingUser && !existingUser._id.equals(user._id)) {
        return res.status(400).json({ message: "User with this  Id already exists." });
      }
    }
    user.role = role;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "User details successfully updated",
    });
  } catch (err) {
    logger.error("Settings/updatePersonalInfo: ", err);
    next(err);
  }
};

//change user email
const changeEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Check if the new email is already taken
    const existingUser = await userServices.findUserByOne("email", email);
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // Find the authenticated user
    const user = await userServices.findUserByOne("_id", req.userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Mark user as unverified and update email
    user.isVerified = false;
    user.email = email;
    await user.save();

    // Delete old OTPs and send a new OTP
    await otpServices.deleteUserOtpsByUserId(user._id);
    const otp = await otpServices.createUserOtp(user._id);
    await emailServices.sendOtpEmail(email, otp);

    return res.status(200).json({
      status: "success",
      message: "OTP successfully sent",
      data: { email },
    });
  } catch (err) {
    logger.error("user/changeEmail: ", err);
    next(err);
  }
};

//verify new user email
const verifyNewMail = async (req, res, next) => {
  const { otp } = req.body;

  try {
    const userOtpRecord = await otpServices.findUserOtpByUserId(req.userId);
    if (!userOtpRecord) {
      return res.status(403).json({
        status: "error",
        message: "Restricted access to user",
      });
    }

    const { otp: hashedOtp, expiresat } = userOtpRecord;

    // Check if OTP has expired
    if (Date.now() > expiresat) {
      await otpServices.deleteUserOtpsByUserId(req.userId);
      return res.status(400).json({
        status: "error",
        message: "OTP has expired",
      });
    }

    // Validate OTP
    const validOtp = await bcrypt.compare(otp, hashedOtp);
    if (!validOtp) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      });
    }

    // Mark user as verified
    await userServices.updateUserByOne(req.userId);

    // Delete OTP record after successful verification
    await otpServices.deleteUserOtpsByUserId(req.userId);

    return res.status(200).json({
      status: "success",
      message: "User email verified successfully",
    });
  } catch (err) {
    logger.error("user/changeEmail/verify: ", err);
    next(err);
  }
};


const ApproveUser = async (req, res, next) => {
  try {
    const { approved, studentId } = req.body;
    const admin = await userServices.findUserById(req.userId)
    const  user = await findUserById(studentId);
    if (!admin) {
      return res.status(400).json({
        status: "error",
        message: "Admin not found",
      });
    }
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }
    if (admin.role !== "admin") {
      return res.status(400).json({
        status: "error",
        message: "User has no Access",
      });
    }

    user.approved = approved;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "User approved successfully",
    });
  } catch (err) {
    logger.error("user/ApproveUser: ", err);
    next(err);
  }
};

//Logout Users
const logout = async (req, res, next) => {
  try {
    await redisService.delArray(req.userId);

    return res.status(200).json({
      status: "success",
      message: "User successfully logged out",
    });
  } catch (err) {
    logger.error("user/logout: ", err);
    next(err);
  }
};

module.exports = {
  signup,
  verifyOtp,
  resendOTPCode,
  login,
  logout,
  personalInfo,
  updatePersonalInfo,
  changeEmail,
  verifyNewMail,
  contact,
  ApproveUser,
};

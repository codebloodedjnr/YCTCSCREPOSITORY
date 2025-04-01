const express = require("express");
const validate = require("../utils/validate");
const schema = require("../schema/validationschema");
const userController = require("../controllers/usercontroller");
const middleware = require("../utils/middleware");

const userrouter = express.Router();

userrouter.post(
  "/signup",
  validate(schema.signupSchema, "body"),
  userController.signup
);

userrouter.post(
  "/verifyOTP",
  validate(schema.verifyOTPSchema, "body"),
  userController.verifyOtp
);

userrouter.post(
  "/resendOTP",
  validate(schema.resendOTPSchema, "body"),
  userController.resendOTPCode
);

userrouter.post(
  "/login",
  validate(schema.loginSchema, "body"),
  userController.login
);

userrouter.post("/logout", middleware.verifyToken, userController.logout);

userrouter.get(
  "/personalinfo",
  middleware.verifyToken,
  userController.personalInfo
);

userrouter.post(
  "/personalinfo/update",
  validate(schema.personalInfoSchema, "body"),
  middleware.verifyToken,
  userController.updatePersonalInfo
);

userrouter.post(
  "/personalinfo/changeemail",
  validate(schema.changeEmailSchema, "body"),
  middleware.verifyToken,
  userController.changeEmail
);

userrouter.post(
  "/personalinfo/changeemail/verify",
  validate(schema.verifyNewMailSchema, "body"),
  middleware.verifyToken,
  userController.verifyNewMail
);

userrouter.post(
  "/contact",
  validate(schema.contactSchema, "body"),
  userController.contact
);

module.exports = userrouter;

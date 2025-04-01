const Joi = require("joi");

const signupSchema = Joi.object({
  studentStaffID: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});

const verifyOTPSchema = Joi.object({
  studentStaffID: Joi.string().optional(),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be exactly 6 characters",
  }),
});

const resendOTPSchema = Joi.object({
  studentStaffID: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).required(),
});

const changeemailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
});

const verifynewmail = Joi.object({
  otp: Joi.string().max(6).required().messages({
    "string.max": "OTP must not exceed 6 characters",
    "any.required": "OTP is required",
  }),
});

module.exports = {
  signupSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
  changeemailSchema,
  verifynewmail,
};

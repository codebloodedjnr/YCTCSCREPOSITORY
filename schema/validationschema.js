const Joi = require("joi");

const signupSchema = Joi.object({
  studentStaffID: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  department: Joi.string().min(3).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});

const verifyOTPSchema = Joi.object({
  studentStaffID: Joi.string().optional(),
  email: Joi.string().email().optional(),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be exactly 6 characters",
  }),
}).or("studentStaffID", "email");

const resendOTPSchema = Joi.object({
  studentStaffID: Joi.string().optional(),
  email: Joi.string().email().optional(),
}).or("studentStaffID", "email");

const loginSchema = Joi.object({
  studentStaffID: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).required(),
}).or("studentStaffID", "email");

const personalInfoSchema = Joi.object({
  studentStaffID: Joi.string().optional().empty("").default(null),
  department: Joi.string().optional(),
});

const changeEmailSchema = Joi.object({
  studentStaffID: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
}).or("studentStaffID", "email");

const verifyNewMailSchema = Joi.object({
  otp: Joi.string().max(6).required().messages({
    "string.max": "OTP must not exceed 6 characters",
    "any.required": "OTP is required",
  }),
});

const contactSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email format",
  }),
  subject: Joi.string().min(3).required(),
  message: Joi.string().min(3).required(),
});

const createauthor = Joi.object({
  name: Joi.string().min(3).required(),
  bio: Joi.string().min(3).required(),
  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email format",
  }),
  books: Joi.array().items(Joi.string().min(1)).min(1).required().messages({}),
});

const bookSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  cloudinaryUrl: Joi.string().uri().required(),
  keywords: Joi.array().items(Joi.string()).optional(),
  category: Joi.string().valid('OND', 'HND').required(),
  sub_category: Joi.string().valid('PROJECTS', 'LECTURE_NOTES', 'PAST_QUESTION', 'DEPARTMENTAL_PUBLICATIONS').required(),
  downloadCount: Joi.number().default(0).optional(),
  file_size: Joi.number().default(0).optional(),
  approved: Joi.boolean().default(false).optional(),
  uploadedBy: Joi.array().items(Joi.string().length(24).hex()).required()  // assuming user IDs are ObjectIds (24 hex characters)
});

module.exports = {
  signupSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
  changeEmailSchema,
  verifyNewMailSchema,
  personalInfoSchema,
  contactSchema,
  createauthor,
  bookSchema
};

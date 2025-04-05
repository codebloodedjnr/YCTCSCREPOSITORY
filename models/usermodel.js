const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  studentStaffID: { type: String, required: true, unique: true }, // Unique ID for students & staff
  email: { type: String, required: true, unique: true }, // Email for login
  password: { type: String, required: true }, // Hashed password storage
  department: { type: String, default: "Computer Science" }, // Default department
  isVerified: { type: Boolean, default: false }, // Field to track manual verification by admin
  createdAt: { type: Date, default: Date.now }, // Timestamp for user creation
  role: { type: String, enum: ['student', 'admin', 'staff'], default: 'student' },
});

// Convert _id to id and remove unnecessary fields when returning JSON
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);

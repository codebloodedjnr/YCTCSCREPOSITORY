const User = require("../models/user.model");

class AdminService {
  async getAllUsers() {
    try {
      return await User.find({});
    } catch (err) {
      throw new Error("Error retrieving users: " + err.message);
    }
  }

  async approveUser(userId) {
    try {
      return await User.findByIdAndUpdate(userId, { approved: true }, { new: true });
    } catch (err) {
      throw new Error("Error approving user: " + err.message);
    }
  }

  async promoteToAdmin(userId) {
    try {
      return await User.findByIdAndUpdate(userId, { role: "admin" }, { new: true });
    } catch (err) {
      throw new Error("Error promoting user to admin: " + err.message);
    }
  }

  async deleteUser(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (err) {
      throw new Error("Error deleting user: " + err.message);
    }
  }
}

module.exports = new AdminService();

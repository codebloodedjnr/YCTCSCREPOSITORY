const User = require("../models/usermodel");

class AdminService {
  async getAllUsers(approved) {
    try {
        let filter = {};
    
        if (approved !== undefined) {
          // Convert string "true"/"false" to boolean
          filter.approved = approved === 'true';
        }
    
        return await User.find(filter);
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

  async alterUserRole(userId, role) {

    console.log("++++++++++", role)
    try {
      return await User.findByIdAndUpdate(userId, { role: role }, { new: true });
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

  async getAllUnapprovedBooks() {
    try {
      return await Book.find({ approved: false });
    } catch (err) {
      throw new Error("Error retrieving unapproved books: " + err.message);
    }
  }

  async searchUser(query) {
    try {
      return await User.find({ $text: { $search: query } });
    } catch (err) {
      throw new Error("Error searching users: " + err.message);
    }
  }
}

module.exports = new AdminService();

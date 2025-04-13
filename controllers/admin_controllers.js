const adminService = require("../services/admin_service");

class AdminController {
  async getUsers(req, res) {
    try {
      const approved = req.query.approved;
      const users = await adminService.getAllUsers(approved);
      res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "failed to fetch users" });
    }
  }

  async approveUser(req, res) {
    try {
      const { id } = req.params;
      const updatedUser = await adminService.approveUser(id);
      res.status(200).json({ message: "User approved", user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async alterUserRole(req, res) {
    try {
      const { id } = req.params;
      const newRole = req.query.role;

      if (!newRole) {
        return res.status(400).json({ error: 'Role is required' });
      }

      const updatedUser = await adminService.alterUserRole(id, role);
      res.status(200).json({ message: "User promoted to admin", user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await adminService.deleteUser(id);
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAllUnapprovedBooks(req, res) {
    try {
      const books = await adminService.getAllUnapprovedBooks();
      res.status(200).json({ books });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchUser(req, res) {
    try {
      const { query } = req.params;
      const users = await adminService.searchUser(query);
      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AdminController();

const adminService = require("../services/admin_service");

class AdminController {
  async getUsers(req, res) {
    try {
      const users = await adminService.getAllUsers();
      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ error: err.message });
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

  async promoteUser(req, res) {
    try {
      const { id } = req.params;
      const updatedUser = await adminService.promoteToAdmin(id);
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
}

module.exports = new AdminController();

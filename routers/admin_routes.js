const express = require("express");
const router = express.Router();
const middleware = require("../utils/middleware");
const adminController = require("../controllers/admin_controllers");

// Protect these routes with authentication and admin role authorization
router.get("/users", middleware.authorizeRole("admin"), adminController.getUsers);
router.post("/approve/:id", middleware.authorizeRole("admin"), adminController.approveUser);
router.post("/promote/:id", middleware.authorizeRole("admin"), adminController.alterUserRole);
router.delete("/user/:id",  middleware.authorizeRole("admin"), adminController.deleteUser);
router.get("/books/unapproved", middleware.authorizeRole("admin"), adminController.getAllUnapprovedBooks);
router.get("/user/search", middleware.authorizeRole("admin"), adminController.searchUser);
module.exports = router;
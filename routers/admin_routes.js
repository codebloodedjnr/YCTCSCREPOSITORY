const express = require("express");
const router = express.Router();
const middleware = require("../utils/middleware");
const adminController = require("../controllers/admin_controllers");

// Protect these routes with authentication and admin role authorization
router.get("/users", authenticate, middleware.authorizeRole("admin"), adminController.getUsers);
router.patch("/approve/:id", authenticate, middleware.authorizeRole("admin"), adminController.approveUser);
router.patch("/promote/:id", authenticate, middleware.authorizeRole("admin"), adminController.promoteUser);
router.delete("/user/:id", authenticate, middleware.authorizeRole("admin"), adminController.deleteUser);

module.exports = router;
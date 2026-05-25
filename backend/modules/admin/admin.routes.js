const router = require("express").Router();
const authenticate = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/role.middleware");
const adminController = require("./admin.controller");

/**
 * All admin routes are protected by two @smart-auth/express middlewares:
 *   1. authenticate (verifyAccessToken) — validates the JWT
 *   2. requireAdmin (authorize(['admin'])) — checks the "admin" role from the token
 */
router.use(authenticate, requireAdmin);

// Blog moderation
router.get("/blogs", adminController.getAllBlogs);
router.get("/blogs/pending", adminController.getPendingBlogs);
router.patch("/blogs/:id/publish", adminController.publishBlog);
router.patch("/blogs/:id/reject", adminController.rejectBlog);
router.delete("/blogs/:id", adminController.deleteBlog);

// User management
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/toggle-status", adminController.toggleUserStatus);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;

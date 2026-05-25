const router = require("express").Router();
const authenticate = require("../../middleware/auth.middleware");
const userController = require("./user.controller");

// All user routes require authentication via @smart-auth/express
router.use(authenticate);

// Profile
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.put("/change-password", userController.changePassword);

// Blog CRUD
router.post("/blogs", userController.createBlog);
router.get("/blogs", userController.getMyBlogs);
router.put("/blogs/:id", userController.updateBlog);
router.delete("/blogs/:id", userController.deleteBlog);
router.patch("/blogs/:id/submit", userController.submitBlog);

module.exports = router;

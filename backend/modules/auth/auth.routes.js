const router = require("express").Router();
const { createRefreshHandler } = require("@smart-auth/express");
const authController = require("./auth.controller");
const { issuer } = require("../../config/auth");
const User = require("../../models/User");

// POST /api/v1/auth/register
router.post("/register", authController.register);

// POST /api/v1/auth/login
router.post("/login", authController.login);

// POST /api/v1/auth/refresh
// Using @smart-auth/express createRefreshHandler for token rotation
const refreshHandler = createRefreshHandler({
  issuer,
  tokenLocation: "body",
  loadUser: async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;
    return {
      email: user.email,
      name: user.name,
      roles: [user.role],
    };
  },
});
router.post("/refresh", refreshHandler.middleware);

module.exports = router;

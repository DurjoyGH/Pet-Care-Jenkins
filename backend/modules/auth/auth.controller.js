const authService = require("./auth.service");

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const refresh = (req, res, next) => {
  // Handled by @smart-auth/express createRefreshHandler middleware
  // This is just a fallback — the actual handler is in routes
  next();
};

module.exports = { register, login, refresh };

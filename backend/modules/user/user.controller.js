const userService = require("./user.service");

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.auth.userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.auth.userId, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await userService.changePassword(req.auth.userId, req.body);
    res.json({ success: true, message: "Password changed" });
  } catch (err) {
    next(err);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const blog = await userService.createBlog(req.auth.userId, req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

const getMyBlogs = async (req, res, next) => {
  try {
    const blogs = await userService.getMyBlogs(req.auth.userId);
    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await userService.updateBlog(
      req.auth.userId,
      req.params.id,
      req.body
    );
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    await userService.deleteBlog(req.auth.userId, req.params.id);
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    next(err);
  }
};

const submitBlog = async (req, res, next) => {
  try {
    const blog = await userService.submitBlog(req.auth.userId, req.params.id);
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  createBlog,
  getMyBlogs,
  updateBlog,
  deleteBlog,
  submitBlog,
};

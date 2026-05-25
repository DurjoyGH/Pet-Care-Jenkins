const adminService = require("./admin.service");

const getPendingBlogs = async (req, res, next) => {
  try {
    const blogs = await adminService.getPendingBlogs();
    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await adminService.getAllBlogs();
    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
};

const publishBlog = async (req, res, next) => {
  try {
    const blog = await adminService.publishBlog(req.params.id);
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

const rejectBlog = async (req, res, next) => {
  try {
    const blog = await adminService.rejectBlog(req.params.id);
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    await adminService.deleteBlog(req.params.id);
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const result = await adminService.toggleUserStatus(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPendingBlogs,
  getAllBlogs,
  publishBlog,
  rejectBlog,
  deleteBlog,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
};

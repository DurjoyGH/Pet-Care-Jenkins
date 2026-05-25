const Blog = require("../../models/Blog");
const User = require("../../models/User");

// ── Blog management ──

const getPendingBlogs = async () => {
  return Blog.find({ status: "pending" })
    .populate("author", "name email")
    .sort({ createdAt: -1 });
};

const getAllBlogs = async () => {
  return Blog.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 });
};

const publishBlog = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    const err = new Error("Blog not found");
    err.statusCode = 404;
    throw err;
  }
  blog.status = "published";
  return blog.save();
};

const rejectBlog = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    const err = new Error("Blog not found");
    err.statusCode = 404;
    throw err;
  }
  blog.status = "rejected";
  return blog.save();
};

const deleteBlog = async (blogId) => {
  const blog = await Blog.findByIdAndDelete(blogId);
  if (!blog) {
    const err = new Error("Blog not found");
    err.statusCode = 404;
    throw err;
  }
};

// ── User management ──

const getAllUsers = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

const toggleUserStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  user.isActive = !user.isActive;
  await user.save();
  return { id: user._id, isActive: user.isActive };
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  // Also delete user's blogs
  await Blog.deleteMany({ author: userId });
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

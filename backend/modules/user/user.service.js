const Blog = require("../../models/Blog");
const User = require("../../models/User");
const { hashPassword } = require("../../utils/hash");

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const updateProfile = async (userId, { name, city }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { ...(name && { name }), ...(city && { city }) },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const changePassword = async (userId, { newPassword }) => {
  if (!newPassword || newPassword.length < 6) {
    const err = new Error("Password must be at least 6 characters");
    err.statusCode = 400;
    throw err;
  }
  const hashed = await hashPassword(newPassword);
  await User.findByIdAndUpdate(userId, { password: hashed });
};

// ── Blog CRUD (user's own blogs) ──

const createBlog = async (userId, { title, content, tags }) => {
  if (!title || !content) {
    const err = new Error("Title and content are required");
    err.statusCode = 400;
    throw err;
  }
  return Blog.create({ title, content, tags, author: userId, status: "draft" });
};

const getMyBlogs = async (userId) => {
  return Blog.find({ author: userId }).sort({ createdAt: -1 });
};

const updateBlog = async (userId, blogId, { title, content, tags }) => {
  const blog = await Blog.findOne({ _id: blogId, author: userId });
  if (!blog) {
    const err = new Error("Blog not found");
    err.statusCode = 404;
    throw err;
  }

  if (title) blog.title = title;
  if (content) blog.content = content;
  if (tags) blog.tags = tags;

  // Reset to draft if it was rejected — let user resubmit
  if (blog.status === "rejected") blog.status = "draft";

  return blog.save();
};

const deleteBlog = async (userId, blogId) => {
  const blog = await Blog.findOneAndDelete({ _id: blogId, author: userId });
  if (!blog) {
    const err = new Error("Blog not found");
    err.statusCode = 404;
    throw err;
  }
};

const submitBlog = async (userId, blogId) => {
  const blog = await Blog.findOne({ _id: blogId, author: userId });
  if (!blog) {
    const err = new Error("Blog not found");
    err.statusCode = 404;
    throw err;
  }
  if (blog.status !== "draft" && blog.status !== "rejected") {
    const err = new Error("Only draft or rejected blogs can be submitted");
    err.statusCode = 400;
    throw err;
  }
  blog.status = "pending";
  return blog.save();
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

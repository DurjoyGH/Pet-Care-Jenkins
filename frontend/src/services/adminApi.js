import api from "./api";

export const getAllUsers = () => api.get("/admin/users");
export const toggleUserStatus = (id) =>
  api.patch(`/admin/users/${id}/toggle-status`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export const getAllBlogs = () => api.get("/admin/blogs");
export const getPendingBlogs = () => api.get("/admin/blogs/pending");
export const publishBlog = (id) => api.patch(`/admin/blogs/${id}/publish`);
export const rejectBlog = (id) => api.patch(`/admin/blogs/${id}/reject`);
export const deleteBlogAdmin = (id) => api.delete(`/admin/blogs/${id}`);

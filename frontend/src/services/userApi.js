import api from "./api";

export const getProfile = () => api.get("/users/profile");
export const updateProfile = (data) => api.put("/users/profile", data);
export const changePassword = (data) => api.put("/users/change-password", data);

export const getMyBlogs = () => api.get("/users/blogs");
export const createBlog = (data) => api.post("/users/blogs", data);
export const updateBlog = (id, data) => api.put(`/users/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/users/blogs/${id}`);
export const submitBlog = (id) => api.patch(`/users/blogs/${id}/submit`);

const request = require("supertest");
const app = require("../app");
const userService = require("../modules/user/user.service");

jest.mock("../modules/user/user.service", () => ({
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
  createBlog: jest.fn(),
  getMyBlogs: jest.fn(),
  updateBlog: jest.fn(),
  deleteBlog: jest.fn(),
  submitBlog: jest.fn(),
}));

describe("User routes", () => {
  it("returns user profile", async () => {
    const profile = { id: "user-1", name: "Pat" };
    userService.getProfile.mockResolvedValue(profile);

    const res = await request(app).get("/api/v1/users/profile");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: profile });
  });

  it("updates user profile", async () => {
    const updated = { id: "user-1", name: "Updated" };
    userService.updateProfile.mockResolvedValue(updated);

    const res = await request(app)
      .put("/api/v1/users/profile")
      .send({ name: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: updated });
  });

  it("changes password", async () => {
    userService.changePassword.mockResolvedValue();

    const res = await request(app)
      .put("/api/v1/users/change-password")
      .send({ oldPassword: "old", newPassword: "new" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: "Password changed" });
  });

  it("creates a blog", async () => {
    const blog = { id: "blog-1", title: "New" };
    userService.createBlog.mockResolvedValue(blog);

    const res = await request(app)
      .post("/api/v1/users/blogs")
      .send({ title: "New" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true, data: blog });
  });

  it("returns user blogs", async () => {
    const blogs = [{ id: "blog-1" }];
    userService.getMyBlogs.mockResolvedValue(blogs);

    const res = await request(app).get("/api/v1/users/blogs");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: blogs });
  });

  it("submits a blog", async () => {
    const blog = { id: "blog-1", status: "pending" };
    userService.submitBlog.mockResolvedValue(blog);

    const res = await request(app).patch("/api/v1/users/blogs/blog-1/submit");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: blog });
  });
});

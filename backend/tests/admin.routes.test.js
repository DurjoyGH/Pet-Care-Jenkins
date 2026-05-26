const request = require("supertest");
const app = require("../app");
const adminService = require("../modules/admin/admin.service");

jest.mock("../modules/admin/admin.service", () => ({
  getPendingBlogs: jest.fn(),
  getAllBlogs: jest.fn(),
  publishBlog: jest.fn(),
  rejectBlog: jest.fn(),
  deleteBlog: jest.fn(),
  getAllUsers: jest.fn(),
  toggleUserStatus: jest.fn(),
  deleteUser: jest.fn(),
}));

describe("Admin routes", () => {
  it("returns pending blogs", async () => {
    const blogs = [{ id: "blog-1" }];
    adminService.getPendingBlogs.mockResolvedValue(blogs);

    const res = await request(app).get("/api/v1/admin/blogs/pending");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: blogs });
  });

  it("publishes a blog", async () => {
    const blog = { id: "blog-1", status: "published" };
    adminService.publishBlog.mockResolvedValue(blog);

    const res = await request(app).patch("/api/v1/admin/blogs/blog-1/publish");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: blog });
  });

  it("deletes a user", async () => {
    adminService.deleteUser.mockResolvedValue();

    const res = await request(app).delete("/api/v1/admin/users/user-1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: "User deleted" });
  });
});

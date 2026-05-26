const request = require("supertest");
const app = require("../app");
const Blog = require("../models/Blog");

jest.mock("../models/Blog", () => ({
  find: jest.fn(),
  findOne: jest.fn(),
}));

describe("Blog routes", () => {
  it("returns published blogs", async () => {
    const blogs = [{ _id: "blog-1", title: "Hello" }];
    const query = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(blogs),
    };

    Blog.find.mockReturnValue(query);

    const res = await request(app).get("/api/v1/blogs");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: blogs });
    expect(Blog.find).toHaveBeenCalledWith({ status: "published" });
  });

  it("returns a single published blog", async () => {
    const blog = { _id: "blog-1", title: "Hello" };
    const query = {
      populate: jest.fn().mockResolvedValue(blog),
    };

    Blog.findOne.mockReturnValue(query);

    const res = await request(app).get("/api/v1/blogs/blog-1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: blog });
  });

  it("returns 404 for a missing blog", async () => {
    const query = {
      populate: jest.fn().mockResolvedValue(null),
    };

    Blog.findOne.mockReturnValue(query);

    const res = await request(app).get("/api/v1/blogs/missing");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Blog not found" });
  });
});

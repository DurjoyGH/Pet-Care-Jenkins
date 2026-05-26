jest.mock("../../models/Blog", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  deleteMany: jest.fn(),
}));

jest.mock("../../models/User", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Blog = require("../../models/Blog");
const User = require("../../models/User");
const adminService = require("../../modules/admin/admin.service");

describe("admin.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets pending blogs", async () => {
    const blogs = [{ id: "blog-1" }];
    const chain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(blogs),
    };

    Blog.find.mockReturnValue(chain);

    const result = await adminService.getPendingBlogs();

    expect(Blog.find).toHaveBeenCalledWith({ status: "pending" });
    expect(chain.populate).toHaveBeenCalledWith("author", "name email");
    expect(chain.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual(blogs);
  });

  it("gets all blogs", async () => {
    const blogs = [{ id: "blog-2" }];
    const chain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(blogs),
    };

    Blog.find.mockReturnValue(chain);

    const result = await adminService.getAllBlogs();

    expect(Blog.find).toHaveBeenCalledWith();
    expect(chain.populate).toHaveBeenCalledWith("author", "name email");
    expect(result).toEqual(blogs);
  });

  it("publishes a blog", async () => {
    const saved = { status: "published" };
    const blog = { status: "pending", save: jest.fn().mockResolvedValue(saved) };
    Blog.findById.mockResolvedValue(blog);

    const result = await adminService.publishBlog("blog-1");

    expect(blog.status).toBe("published");
    expect(blog.save).toHaveBeenCalled();
    expect(result).toEqual(saved);
  });

  it("throws when publishing missing blog", async () => {
    Blog.findById.mockResolvedValue(null);

    await expect(adminService.publishBlog("missing")).rejects.toMatchObject({
      message: "Blog not found",
      statusCode: 404,
    });
  });

  it("rejects a blog", async () => {
    const saved = { status: "rejected" };
    const blog = { status: "pending", save: jest.fn().mockResolvedValue(saved) };
    Blog.findById.mockResolvedValue(blog);

    const result = await adminService.rejectBlog("blog-1");

    expect(blog.status).toBe("rejected");
    expect(result).toEqual(saved);
  });

  it("deletes a blog", async () => {
    Blog.findByIdAndDelete.mockResolvedValue({ id: "blog-1" });

    await adminService.deleteBlog("blog-1");

    expect(Blog.findByIdAndDelete).toHaveBeenCalledWith("blog-1");
  });

  it("throws when deleting missing blog", async () => {
    Blog.findByIdAndDelete.mockResolvedValue(null);

    await expect(adminService.deleteBlog("missing")).rejects.toMatchObject({
      message: "Blog not found",
      statusCode: 404,
    });
  });

  it("gets all users", async () => {
    const users = [{ id: "user-1" }];
    const chain = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(users),
    };
    User.find.mockReturnValue(chain);

    const result = await adminService.getAllUsers();

    expect(User.find).toHaveBeenCalledWith();
    expect(chain.select).toHaveBeenCalledWith("-password");
    expect(result).toEqual(users);
  });

  it("toggles user status", async () => {
    const user = {
      _id: "user-1",
      isActive: true,
      save: jest.fn().mockResolvedValue(),
    };
    User.findById.mockResolvedValue(user);

    const result = await adminService.toggleUserStatus("user-1");

    expect(user.isActive).toBe(false);
    expect(user.save).toHaveBeenCalled();
    expect(result).toEqual({ id: "user-1", isActive: false });
  });

  it("throws when toggling missing user", async () => {
    User.findById.mockResolvedValue(null);

    await expect(adminService.toggleUserStatus("missing")).rejects.toMatchObject({
      message: "User not found",
      statusCode: 404,
    });
  });

  it("deletes a user and blogs", async () => {
    User.findByIdAndDelete.mockResolvedValue({ _id: "user-1" });
    Blog.deleteMany.mockResolvedValue({ deletedCount: 2 });

    await adminService.deleteUser("user-1");

    expect(User.findByIdAndDelete).toHaveBeenCalledWith("user-1");
    expect(Blog.deleteMany).toHaveBeenCalledWith({ author: "user-1" });
  });

  it("throws when deleting missing user", async () => {
    User.findByIdAndDelete.mockResolvedValue(null);

    await expect(adminService.deleteUser("missing")).rejects.toMatchObject({
      message: "User not found",
      statusCode: 404,
    });
  });
});

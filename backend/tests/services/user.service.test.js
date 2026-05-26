jest.mock("../../models/User", () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock("../../models/Blog", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

jest.mock("../../utils/hash", () => ({
  hashPassword: jest.fn(),
}));

const Blog = require("../../models/Blog");
const User = require("../../models/User");
const { hashPassword } = require("../../utils/hash");
const userService = require("../../modules/user/user.service");

describe("user.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets a profile", async () => {
    const user = { id: "user-1" };
    const chain = { select: jest.fn().mockResolvedValue(user) };
    User.findById.mockReturnValue(chain);

    const result = await userService.getProfile("user-1");

    expect(User.findById).toHaveBeenCalledWith("user-1");
    expect(result).toEqual(user);
  });

  it("throws when profile missing", async () => {
    const chain = { select: jest.fn().mockResolvedValue(null) };
    User.findById.mockReturnValue(chain);

    await expect(userService.getProfile("missing")).rejects.toMatchObject({
      message: "User not found",
      statusCode: 404,
    });
  });

  it("updates a profile", async () => {
    const updated = { id: "user-1" };
    const chain = { select: jest.fn().mockResolvedValue(updated) };
    User.findByIdAndUpdate.mockReturnValue(chain);

    const result = await userService.updateProfile("user-1", { name: "New" });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "user-1",
      { name: "New" },
      { new: true, runValidators: true }
    );
    expect(result).toEqual(updated);
  });

  it("throws when update profile missing", async () => {
    const chain = { select: jest.fn().mockResolvedValue(null) };
    User.findByIdAndUpdate.mockReturnValue(chain);

    await expect(userService.updateProfile("missing", { name: "New" })).rejects.toMatchObject({
      message: "User not found",
      statusCode: 404,
    });
  });

  it("validates password length", async () => {
    await expect(
      userService.changePassword("user-1", { newPassword: "123" })
    ).rejects.toMatchObject({
      message: "Password must be at least 6 characters",
      statusCode: 400,
    });
  });

  it("changes password", async () => {
    hashPassword.mockResolvedValue("hashed");
    User.findByIdAndUpdate.mockResolvedValue({ id: "user-1" });

    await userService.changePassword("user-1", { newPassword: "secret" });

    expect(hashPassword).toHaveBeenCalledWith("secret");
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith("user-1", { password: "hashed" });
  });

  it("creates a blog", async () => {
    Blog.create.mockResolvedValue({ id: "blog-1" });

    const result = await userService.createBlog("user-1", {
      title: "Title",
      content: "Body",
      tags: ["a"],
    });

    expect(Blog.create).toHaveBeenCalledWith({
      title: "Title",
      content: "Body",
      tags: ["a"],
      author: "user-1",
      status: "draft",
    });
    expect(result).toEqual({ id: "blog-1" });
  });

  it("requires title and content", async () => {
    await expect(
      userService.createBlog("user-1", { title: "Title" })
    ).rejects.toMatchObject({
      message: "Title and content are required",
      statusCode: 400,
    });
  });

  it("gets blogs", async () => {
    const chain = { sort: jest.fn().mockResolvedValue([{ id: "blog-1" }]) };
    Blog.find.mockReturnValue(chain);

    const result = await userService.getMyBlogs("user-1");

    expect(Blog.find).toHaveBeenCalledWith({ author: "user-1" });
    expect(result).toEqual([{ id: "blog-1" }]);
  });

  it("updates a blog", async () => {
    const blog = {
      status: "rejected",
      save: jest.fn().mockResolvedValue({ id: "blog-1" }),
    };
    Blog.findOne.mockResolvedValue(blog);

    await userService.updateBlog("user-1", "blog-1", { title: "New" });

    expect(blog.title).toBe("New");
    expect(blog.status).toBe("draft");
    expect(blog.save).toHaveBeenCalled();
  });

  it("throws when blog missing on update", async () => {
    Blog.findOne.mockResolvedValue(null);

    await expect(
      userService.updateBlog("user-1", "missing", { title: "New" })
    ).rejects.toMatchObject({
      message: "Blog not found",
      statusCode: 404,
    });
  });

  it("deletes a blog", async () => {
    Blog.findOneAndDelete.mockResolvedValue({ id: "blog-1" });

    await userService.deleteBlog("user-1", "blog-1");

    expect(Blog.findOneAndDelete).toHaveBeenCalledWith({ _id: "blog-1", author: "user-1" });
  });

  it("throws when blog missing on delete", async () => {
    Blog.findOneAndDelete.mockResolvedValue(null);

    await expect(userService.deleteBlog("user-1", "missing")).rejects.toMatchObject({
      message: "Blog not found",
      statusCode: 404,
    });
  });

  it("submits a blog", async () => {
    const blog = { status: "draft", save: jest.fn().mockResolvedValue({ id: "blog-1" }) };
    Blog.findOne.mockResolvedValue(blog);

    await userService.submitBlog("user-1", "blog-1");

    expect(blog.status).toBe("pending");
    expect(blog.save).toHaveBeenCalled();
  });

  it("rejects submit when status invalid", async () => {
    const blog = { status: "published" };
    Blog.findOne.mockResolvedValue(blog);

    await expect(userService.submitBlog("user-1", "blog-1")).rejects.toMatchObject({
      message: "Only draft or rejected blogs can be submitted",
      statusCode: 400,
    });
  });

  it("throws when blog missing on submit", async () => {
    Blog.findOne.mockResolvedValue(null);

    await expect(userService.submitBlog("user-1", "missing")).rejects.toMatchObject({
      message: "Blog not found",
      statusCode: 404,
    });
  });
});

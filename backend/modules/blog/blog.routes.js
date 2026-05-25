const router = require("express").Router();
const Blog = require("../../models/Blog");

// GET /api/v1/blogs — Public: anyone can see published blogs
router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: "published" })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/blogs/:id — Public: single published blog
router.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      status: "published",
    }).populate("author", "name");

    if (!blog) {
      const err = new Error("Blog not found");
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

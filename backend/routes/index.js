const router = require("express").Router();

router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/users", require("../modules/user/user.routes"));
router.use("/admin", require("../modules/admin/admin.routes"));
router.use("/blogs", require("../modules/blog/blog.routes"));
router.use("/pets", require("../modules/pet/pet.routes"));

module.exports = router;
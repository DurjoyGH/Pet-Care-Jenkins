const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("../../config/cloudinary");
const authenticate = require("../../middleware/auth.middleware");
const petController = require("./pet.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "pet-adoption", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });

const uploadImages = async (req, res, next) => {
  try {
    const files = req.files || [];
    if (files.length < 3 || files.length > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload 3 to 5 images" });
    }

    const urls = await Promise.all(files.map((file) => uploadToCloudinary(file.buffer)));
    req.imageUrls = urls;
    next();
  } catch (err) {
    next(err);
  }
};

// Public routes
router.get("/", petController.getAllPets);

// Owner routes
router.get("/mine", authenticate, petController.getMyPets);
router.put("/:id", authenticate, petController.updatePet);
router.delete("/:id", authenticate, petController.deletePet);

// Public by id (keep after /mine)
router.get("/:id", petController.getPetById);

// Protected route for adding pets
router.post(
  "/",
  authenticate,
  upload.array("images", 5),
  uploadImages,
  petController.createPet
);

module.exports = router;

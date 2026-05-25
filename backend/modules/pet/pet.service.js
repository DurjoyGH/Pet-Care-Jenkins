const Pet = require("../../models/Pet");
const DISTRICTS = require("../../config/districts");

const BD_PHONE_REGEX = /^(?:\+?8801|01)[3-9]\d{8}$/;

const validatePetPayload = (payload) => {
  const {
    petType,
    category,
    name,
    weight,
    color,
    district,
    address,
    phone,
    description,
    ownerName,
  } = payload;

  if (
    !petType ||
    !category ||
    !name ||
    !weight ||
    !color ||
    !district ||
    !address ||
    !phone ||
    !description ||
    !ownerName
  ) {
    const err = new Error("All fields are required");
    err.statusCode = 400;
    throw err;
  }

  if (!DISTRICTS.includes(district)) {
    const err = new Error("Invalid district");
    err.statusCode = 400;
    throw err;
  }

  if (!BD_PHONE_REGEX.test(phone)) {
    const err = new Error("Invalid Bangladeshi phone number");
    err.statusCode = 400;
    throw err;
  }
};

const createPet = async ({ payload, ownerId, imageUrls }) => {
  validatePetPayload(payload);

  if (!Array.isArray(imageUrls) || imageUrls.length < 3 || imageUrls.length > 5) {
    const err = new Error("Please upload 3 to 5 images");
    err.statusCode = 400;
    throw err;
  }

  return Pet.create({
    ...payload,
    ownerId,
    images: imageUrls,
  });
};

const getAllPets = async () => {
  return Pet.find({ status: "available" })
    .sort({ createdAt: -1 })
    .select("-__v");
};

const getPetById = async (id) => {
  const pet = await Pet.findById(id).select("-__v");
  if (!pet) {
    const err = new Error("Pet not found");
    err.statusCode = 404;
    throw err;
  }
  return pet;
};

const getMyPets = async (ownerId) => {
  return Pet.find({ ownerId }).sort({ createdAt: -1 }).select("-__v");
};

const updatePet = async (ownerId, petId, payload) => {
  if (payload.district && !DISTRICTS.includes(payload.district)) {
    const err = new Error("Invalid district");
    err.statusCode = 400;
    throw err;
  }

  if (payload.phone && !BD_PHONE_REGEX.test(payload.phone)) {
    const err = new Error("Invalid Bangladeshi phone number");
    err.statusCode = 400;
    throw err;
  }

  const pet = await Pet.findOne({ _id: petId, ownerId });
  if (!pet) {
    const err = new Error("Pet not found");
    err.statusCode = 404;
    throw err;
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      pet[key] = value;
    }
  });

  return pet.save();
};

const deletePet = async (ownerId, petId) => {
  const pet = await Pet.findOneAndDelete({ _id: petId, ownerId });
  if (!pet) {
    const err = new Error("Pet not found");
    err.statusCode = 404;
    throw err;
  }
};

module.exports = {
  createPet,
  getAllPets,
  getPetById,
  getMyPets,
  updatePet,
  deletePet,
};

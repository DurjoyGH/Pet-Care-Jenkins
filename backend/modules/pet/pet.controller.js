const petService = require("./pet.service");

const createPet = async (req, res, next) => {
  try {
    const ownerId = req.auth.userId;
    const payload = {
      petType: req.body.petType,
      category: req.body.category,
      name: req.body.name,
      weight: Number(req.body.weight),
      color: req.body.color,
      district: req.body.district,
      address: req.body.address,
      phone: req.body.phone,
      description: req.body.description,
      ownerName: req.body.ownerName,
    };

    const pet = await petService.createPet({
      payload,
      ownerId,
      imageUrls: req.imageUrls,
    });

    res.status(201).json({ success: true, data: pet });
  } catch (err) {
    next(err);
  }
};

const getAllPets = async (_req, res, next) => {
  try {
    const pets = await petService.getAllPets();
    res.json({ success: true, data: pets });
  } catch (err) {
    next(err);
  }
};

const getPetById = async (req, res, next) => {
  try {
    const pet = await petService.getPetById(req.params.id);
    res.json({ success: true, data: pet });
  } catch (err) {
    next(err);
  }
};

const getMyPets = async (req, res, next) => {
  try {
    const pets = await petService.getMyPets(req.auth.userId);
    res.json({ success: true, data: pets });
  } catch (err) {
    next(err);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const payload = {
      petType: req.body.petType,
      category: req.body.category,
      name: req.body.name,
      weight: req.body.weight ? Number(req.body.weight) : undefined,
      color: req.body.color,
      district: req.body.district,
      address: req.body.address,
      phone: req.body.phone,
      description: req.body.description,
      ownerName: req.body.ownerName,
    };

    const pet = await petService.updatePet(req.auth.userId, req.params.id, payload);
    res.json({ success: true, data: pet });
  } catch (err) {
    next(err);
  }
};

const deletePet = async (req, res, next) => {
  try {
    await petService.deletePet(req.auth.userId, req.params.id);
    res.json({ success: true, message: "Pet deleted" });
  } catch (err) {
    next(err);
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

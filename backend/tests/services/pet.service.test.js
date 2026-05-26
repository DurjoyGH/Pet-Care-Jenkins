jest.mock("../../models/Pet", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

const Pet = require("../../models/Pet");
const petService = require("../../modules/pet/pet.service");
const DISTRICTS = require("../../config/districts");

const basePayload = {
  petType: "dog",
  category: "small",
  name: "Buddy",
  weight: 10,
  color: "Brown",
  district: DISTRICTS[0],
  address: "Road 1",
  phone: "01712345678",
  description: "Friendly",
  ownerName: "Pat",
};

describe("pet.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requires all fields", async () => {
    const payload = { ...basePayload };
    delete payload.name;

    await expect(
      petService.createPet({ payload, ownerId: "user-1", imageUrls: [] })
    ).rejects.toMatchObject({
      message: "All fields are required",
      statusCode: 400,
    });
  });

  it("validates district", async () => {
    const payload = { ...basePayload, district: "Invalid" };

    await expect(
      petService.createPet({ payload, ownerId: "user-1", imageUrls: [] })
    ).rejects.toMatchObject({
      message: "Invalid district",
      statusCode: 400,
    });
  });

  it("validates phone number", async () => {
    const payload = { ...basePayload, phone: "123" };

    await expect(
      petService.createPet({ payload, ownerId: "user-1", imageUrls: [] })
    ).rejects.toMatchObject({
      message: "Invalid Bangladeshi phone number",
      statusCode: 400,
    });
  });

  it("validates image count", async () => {
    await expect(
      petService.createPet({
        payload: basePayload,
        ownerId: "user-1",
        imageUrls: ["a", "b"],
      })
    ).rejects.toMatchObject({
      message: "Please upload 3 to 5 images",
      statusCode: 400,
    });
  });

  it("creates a pet", async () => {
    Pet.create.mockResolvedValue({ id: "pet-1" });

    const result = await petService.createPet({
      payload: basePayload,
      ownerId: "user-1",
      imageUrls: ["1", "2", "3"],
    });

    expect(Pet.create).toHaveBeenCalledWith({
      ...basePayload,
      ownerId: "user-1",
      images: ["1", "2", "3"],
    });
    expect(result).toEqual({ id: "pet-1" });
  });

  it("gets a pet by id", async () => {
    const chain = { select: jest.fn().mockResolvedValue({ id: "pet-1" }) };
    Pet.findById.mockReturnValue(chain);

    const result = await petService.getPetById("pet-1");

    expect(Pet.findById).toHaveBeenCalledWith("pet-1");
    expect(result).toEqual({ id: "pet-1" });
  });

  it("throws when pet not found", async () => {
    const chain = { select: jest.fn().mockResolvedValue(null) };
    Pet.findById.mockReturnValue(chain);

    await expect(petService.getPetById("missing")).rejects.toMatchObject({
      message: "Pet not found",
      statusCode: 404,
    });
  });

  it("validates update district", async () => {
    await expect(
      petService.updatePet("user-1", "pet-1", { district: "Invalid" })
    ).rejects.toMatchObject({
      message: "Invalid district",
      statusCode: 400,
    });
  });

  it("validates update phone", async () => {
    await expect(
      petService.updatePet("user-1", "pet-1", { phone: "123" })
    ).rejects.toMatchObject({
      message: "Invalid Bangladeshi phone number",
      statusCode: 400,
    });
  });

  it("throws when updating missing pet", async () => {
    Pet.findOne.mockResolvedValue(null);

    await expect(
      petService.updatePet("user-1", "pet-1", { name: "New" })
    ).rejects.toMatchObject({
      message: "Pet not found",
      statusCode: 404,
    });
  });

  it("updates a pet", async () => {
    const pet = {
      name: "Old",
      color: "Brown",
      save: jest.fn().mockResolvedValue({ id: "pet-1" }),
    };
    Pet.findOne.mockResolvedValue(pet);

    await petService.updatePet("user-1", "pet-1", {
      name: "New",
      color: "",
      weight: 12,
    });

    expect(pet.name).toBe("New");
    expect(pet.color).toBe("Brown");
    expect(pet.weight).toBe(12);
    expect(pet.save).toHaveBeenCalled();
  });

  it("deletes a pet", async () => {
    Pet.findOneAndDelete.mockResolvedValue({ id: "pet-1" });

    await petService.deletePet("user-1", "pet-1");

    expect(Pet.findOneAndDelete).toHaveBeenCalledWith({ _id: "pet-1", ownerId: "user-1" });
  });

  it("throws when deleting missing pet", async () => {
    Pet.findOneAndDelete.mockResolvedValue(null);

    await expect(
      petService.deletePet("user-1", "pet-1")
    ).rejects.toMatchObject({
      message: "Pet not found",
      statusCode: 404,
    });
  });
});

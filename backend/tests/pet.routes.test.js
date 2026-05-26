const request = require("supertest");
const app = require("../app");
const petService = require("../modules/pet/pet.service");

jest.mock("../modules/pet/pet.service", () => ({
  createPet: jest.fn(),
  getAllPets: jest.fn(),
  getPetById: jest.fn(),
  getMyPets: jest.fn(),
  updatePet: jest.fn(),
  deletePet: jest.fn(),
}));

describe("Pet routes", () => {
  it("returns all pets", async () => {
    const pets = [{ id: "pet-1" }];
    petService.getAllPets.mockResolvedValue(pets);

    const res = await request(app).get("/api/v1/pets");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: pets });
  });

  it("returns a pet by id", async () => {
    const pet = { id: "pet-1" };
    petService.getPetById.mockResolvedValue(pet);

    const res = await request(app).get("/api/v1/pets/pet-1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: pet });
  });

  it("returns the user pets", async () => {
    const pets = [{ id: "pet-2" }];
    petService.getMyPets.mockResolvedValue(pets);

    const res = await request(app).get("/api/v1/pets/mine");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: pets });
  });
});

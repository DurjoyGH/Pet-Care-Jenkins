import api from "./api";

export const getPets = () => api.get("/pets");
export const getPetById = (id) => api.get(`/pets/${id}`);
export const createPet = (formData) =>
  api.post("/pets", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getMyPets = () => api.get("/pets/mine");
export const updatePet = (id, payload) => api.put(`/pets/${id}`, payload);
export const deletePet = (id) => api.delete(`/pets/${id}`);

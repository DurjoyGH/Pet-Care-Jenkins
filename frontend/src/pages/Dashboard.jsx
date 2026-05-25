import { useEffect, useState } from "react";
import { useAuth } from "@smart-auth/react";
import { getMyBlogs, createBlog, updateBlog, deleteBlog, submitBlog } from "../services/userApi";
import { createPet, deletePet, getMyPets, updatePet } from "../services/petApi";
import DISTRICTS from "../constants/districts";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { PawPrint, Plus, Edit3, Trash2, Send, X, FileText } from "lucide-react";
import Spinner from "../components/Spinner";

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function Dashboard() {
  const { authenticated, user, loading: authLoading } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });

  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [showPetForm, setShowPetForm] = useState(false);
  const [petEditId, setPetEditId] = useState(null);
  const [petImages, setPetImages] = useState([]);
  const [petForm, setPetForm] = useState({
    petType: "",
    category: "",
    name: "",
    weight: "",
    color: "",
    district: "",
    address: "",
    phone: "",
    description: "",
    ownerName: "",
  });

  const fetchBlogs = () => {
    getMyBlogs()
      .then((res) => setBlogs(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchPets = () => {
    getMyPets()
      .then((res) => setPets(res.data.data))
      .catch(() => {})
      .finally(() => setPetsLoading(false));
  };

  useEffect(() => {
    if (authenticated) {
      fetchBlogs();
      fetchPets();
    }
  }, [authenticated]);

  if (authLoading) return <Spinner />;
  if (!authenticated) return <Navigate to="/login" replace />;

  const resetForm = () => {
    setForm({ title: "", content: "", tags: "" });
    setEditId(null);
    setShowForm(false);
  };

  const resetPetForm = () => {
    setPetForm({
      petType: "",
      category: "",
      name: "",
      weight: "",
      color: "",
      district: "",
      address: "",
      phone: "",
      description: "",
      ownerName: "",
    });
    setPetImages([]);
    setPetEditId(null);
    setShowPetForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    try {
      if (editId) {
        await updateBlog(editId, payload);
        toast.success("Blog updated");
      } else {
        await createBlog(payload);
        toast.success("Blog created");
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleEdit = (blog) => {
    setForm({ title: blog.title, content: blog.content, tags: blog.tags?.join(", ") || "" });
    setEditId(blog._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await deleteBlog(id);
      toast.success("Deleted");
      fetchBlogs();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (id) => {
    try {
      await submitBlog(id);
      toast.success("Submitted for review");
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submit failed");
    }
  };

  const handlePetImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 3 || files.length > 5) {
      toast.error("Please select 3 to 5 images");
      return;
    }
    setPetImages(files);
  };

  const handlePetSave = async (e) => {
    e.preventDefault();

    try {
      if (petEditId) {
        await updatePet(petEditId, {
          ...petForm,
          weight: petForm.weight ? Number(petForm.weight) : undefined,
        });
        toast.success("Pet updated");
      } else {
        if (petImages.length < 3 || petImages.length > 5) {
          toast.error("Please select 3 to 5 images");
          return;
        }

        const formData = new FormData();
        Object.entries(petForm).forEach(([key, value]) => formData.append(key, value));
        petImages.forEach((file) => formData.append("images", file));
        await createPet(formData);
        toast.success("Pet added for adoption");
      }

      resetPetForm();
      fetchPets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save pet");
    }
  };

  const handlePetEdit = (pet) => {
    setPetForm({
      petType: pet.petType,
      category: pet.category,
      name: pet.name,
      weight: pet.weight,
      color: pet.color,
      district: pet.district,
      address: pet.address,
      phone: pet.phone,
      description: pet.description,
      ownerName: pet.ownerName,
    });
    setPetEditId(pet._id);
    setShowPetForm(true);
  };

  const handlePetDelete = async (id) => {
    if (!confirm("Delete this pet listing?")) return;
    try {
      await deletePet(id);
      toast.success("Pet deleted");
      fetchPets();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Hi, <span className="text-primary">{user?.name}</span> 👋
          </h1>
          <p className="text-gray-500 mt-1">{user?.email} · {user?.city}</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full font-semibold transition-colors cursor-pointer leading-none"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "New Blog"}
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSave}
            className="bg-white rounded-2xl p-6 shadow-sm mb-8 overflow-hidden"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editId ? "Edit Blog" : "Create Blog"}
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Blog title"
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
              />
              <textarea
                required
                rows={6}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your blog content..."
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm resize-none"
              />
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Tags (comma separated): dogs, cats, tips"
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-xl transition-colors self-end px-8 cursor-pointer"
              >
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Blogs list */}
      {loading ? (
        <Spinner />
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">You haven't written any blogs yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 leading-none">
                  <h3 className="font-bold text-gray-800 truncate">{blog.title}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_COLORS[blog.status]}`}>
                    {blog.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm truncate">{blog.content}</p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 leading-none">
                {(blog.status === "draft" || blog.status === "rejected") && (
                  <button onClick={() => handleSubmit(blog._id)} title="Submit for review" className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition cursor-pointer">
                    <Send size={16} />
                  </button>
                )}
                <button onClick={() => handleEdit(blog)} title="Edit" className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(blog._id)} title="Delete" className="p-2 rounded-lg bg-red-50 text-danger hover:bg-red-100 transition cursor-pointer">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pets section */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-1.5 leading-none">
              <PawPrint className="text-primary" /> My Pet Listings
            </h2>
            <p className="text-gray-500 mt-1">Manage your adoption posts</p>
          </div>
          <button
            onClick={() => {
              resetPetForm();
              setShowPetForm(!showPetForm);
            }}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full font-semibold transition-colors cursor-pointer leading-none"
          >
            {showPetForm ? <X size={18} /> : <Plus size={18} />}
            {showPetForm ? "Cancel" : "Add Pet"}
          </button>
        </div>

        <AnimatePresence>
          {showPetForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handlePetSave}
              className="bg-white rounded-2xl p-6 shadow-sm mb-8 overflow-hidden"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {petEditId ? "Edit Pet" : "Add Pet for Adoption"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={petForm.petType}
                  onChange={(e) => setPetForm({ ...petForm, petType: e.target.value })}
                  placeholder="Pet type (e.g., Cat, Dog)"
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
                />
                <input
                  type="text"
                  required
                  value={petForm.category}
                  onChange={(e) => setPetForm({ ...petForm, category: e.target.value })}
                  placeholder="Category (e.g., Persian)"
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
                />
                <input
                  type="text"
                  required
                  value={petForm.name}
                  onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                  placeholder="Pet name"
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
                />
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={petForm.weight}
                  onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
                  placeholder="Weight (kg)"
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
                />
                <input
                  type="text"
                  required
                  value={petForm.color}
                  onChange={(e) => setPetForm({ ...petForm, color: e.target.value })}
                  placeholder="Color"
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
                />
                <select
                  required
                  value={petForm.district}
                  onChange={(e) => setPetForm({ ...petForm, district: e.target.value })}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm bg-white"
                >
                  <option value="">Select district</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={petForm.phone}
                  onChange={(e) => setPetForm({ ...petForm, phone: e.target.value })}
                  placeholder="Phone (e.g., 01XXXXXXXXX)"
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
                />
                <input
                  type="text"
                  required
                  value={petForm.ownerName}
                  onChange={(e) => setPetForm({ ...petForm, ownerName: e.target.value })}
                  placeholder="Owner name"
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
                />
              </div>

              <input
                type="text"
                required
                value={petForm.address}
                onChange={(e) => setPetForm({ ...petForm, address: e.target.value })}
                placeholder="Full address"
                className="mt-4 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
              />

              <textarea
                required
                rows={4}
                value={petForm.description}
                onChange={(e) => setPetForm({ ...petForm, description: e.target.value })}
                placeholder="Short description"
                className="mt-4 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm resize-none"
              />

              {!petEditId && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Pet images (3 to 5)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePetImages}
                    className="block w-full text-sm text-gray-500"
                  />
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-xl transition-colors px-8 cursor-pointer"
                >
                  {petEditId ? "Update" : "Publish"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {petsLoading ? (
          <Spinner />
        ) : pets.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <PawPrint size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">You have no pet listings yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pets.map((pet) => (
              <motion.div
                key={pet._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{pet.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{pet.petType} · {pet.category} · {pet.district}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 leading-none">
                  <button
                    onClick={() => handlePetEdit(pet)}
                    title="Edit"
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handlePetDelete(pet._id)}
                    title="Delete"
                    className="p-2 rounded-lg bg-red-50 text-danger hover:bg-red-100 transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

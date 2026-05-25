import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@smart-auth/react";
import toast from "react-hot-toast";
import { createPet } from "../services/petApi";
import DISTRICTS from "../constants/districts";
import Spinner from "../components/Spinner";
import { ImagePlus, PawPrint } from "lucide-react";

const BD_PHONE_REGEX = /^(?:\+?8801|01)[3-9]\d{8}$/;

export default function AddPet() {
  const { authenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const previews = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 3 || files.length > 5) {
      toast.error("Please select 3 to 5 images");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!BD_PHONE_REGEX.test(form.phone)) {
      toast.error("Please enter a valid Bangladeshi phone number");
      return;
    }

    if (images.length < 3 || images.length > 5) {
      toast.error("Please select 3 to 5 images");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    images.forEach((file) => formData.append("images", file));

    setSubmitting(true);
    try {
      await createPet(formData);
      toast.success("Pet listed for adoption");
      navigate("/adopt");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add pet");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!authenticated) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-1.5 leading-none">
          <PawPrint className="text-primary" /> List a Pet for Adoption
        </h1>
        <p className="text-gray-500 mt-1">Provide accurate info so adopters can contact you.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            value={form.petType}
            onChange={update("petType")}
            placeholder="Pet type (e.g., Cat, Dog)"
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
          />
          <input
            type="text"
            required
            value={form.category}
            onChange={update("category")}
            placeholder="Category (e.g., Persian)"
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            value={form.name}
            onChange={update("name")}
            placeholder="Pet name"
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
          />
          <input
            type="number"
            required
            min="0.1"
            step="0.1"
            value={form.weight}
            onChange={update("weight")}
            placeholder="Weight (kg)"
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            value={form.color}
            onChange={update("color")}
            placeholder="Color"
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
          />
          <select
            required
            value={form.district}
            onChange={update("district")}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm bg-white"
          >
            <option value="">Select district</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          required
          value={form.address}
          onChange={update("address")}
          placeholder="Full address"
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            value={form.phone}
            onChange={update("phone")}
            placeholder="Phone (e.g., 01XXXXXXXXX)"
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
          />
          <input
            type="text"
            required
            value={form.ownerName}
            onChange={update("ownerName")}
            placeholder="Owner name"
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
          />
        </div>

        <textarea
          required
          rows={5}
          value={form.description}
          onChange={update("description")}
          placeholder="Short description"
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm resize-none"
        />

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Pet images (3 to 5)</label>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <label className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-card text-card-text rounded-xl cursor-pointer font-semibold leading-none">
              <ImagePlus size={18} /> Select Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500">JPG/PNG, max 5 images</p>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
              {previews.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="preview"
                  className="w-full h-20 object-cover rounded-lg border border-gray-100"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold px-8 py-2.5 rounded-xl transition-colors"
          >
            {submitting ? "Submitting..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}

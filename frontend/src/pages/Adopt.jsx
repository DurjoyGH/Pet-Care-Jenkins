import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPets } from "../services/petApi";
import PetCard from "../components/PetCard";
import Spinner from "../components/Spinner";
import { PawPrint, Search, Plus } from "lucide-react";

export default function Adopt() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPets()
      .then((res) => setPets(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return pets.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.petType.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.district.toLowerCase().includes(term)
    );
  }, [pets, search]);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-1.5 leading-none">
            <PawPrint className="text-primary" /> Adopt a Pet
          </h1>
          <p className="text-gray-500 mt-1">{pets.length} pets waiting for a home</p>
        </div>

        <div className="flex w-full lg:w-auto flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by type, category, or district"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <Link
            to="/adopt/new"
            className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full font-semibold transition-colors leading-none"
          >
            <Plus size={16} /> Add Pet
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <PawPrint size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No pets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}

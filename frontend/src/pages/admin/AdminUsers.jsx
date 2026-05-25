import { useEffect, useState } from "react";
import { getAllUsers, toggleUserStatus, deleteUser } from "../../services/adminApi";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { Trash2, UserCheck, UserX, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    getAllUsers()
      .then((res) => setUsers(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const handleToggle = async (id) => {
    try {
      const res = await toggleUserStatus(id);
      toast.success(res.data.data.isActive ? "User activated" : "User deactivated");
      fetch();
    } catch {
      toast.error("Toggle failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user and all their blogs?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      fetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-1.5 leading-none">
        <Users className="text-primary" /> All Users
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No users yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {users.map((u) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{u.name}</h3>
                  <p className="text-card-text text-sm font-medium">{u.email}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                  u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {u.role}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">📍 {u.city}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(u._id)}
                  className={`flex items-center gap-1.5 leading-none px-3 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                    u.isActive
                      ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {u.isActive ? <><UserX size={14} /> Deactivate</> : <><UserCheck size={14} /> Activate</>}
                </button>
                {u.role !== "admin" && (
                  <button onClick={() => handleDelete(u._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 text-danger hover:bg-red-100 transition cursor-pointer leading-none">
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

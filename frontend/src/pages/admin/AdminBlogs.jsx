import { useEffect, useState } from "react";
import { getAllBlogs, deleteBlogAdmin } from "../../services/adminApi";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { Trash2, FileText } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    getAllBlogs()
      .then((res) => setBlogs(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await deleteBlogAdmin(id);
      toast.success("Blog deleted");
      fetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-1.5 leading-none">
        <FileText className="text-primary" /> All Blogs
      </h1>

      {blogs.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No blogs yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 leading-none">
                  <h3 className="font-semibold text-gray-800 truncate">{blog.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[blog.status]}`}>
                    {blog.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">by {blog.author?.name || "—"} · {blog.author?.email || ""}</p>
              </div>
              <button onClick={() => handleDelete(blog._id)} className="p-2 rounded-lg bg-red-50 text-danger hover:bg-red-100 transition cursor-pointer">
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

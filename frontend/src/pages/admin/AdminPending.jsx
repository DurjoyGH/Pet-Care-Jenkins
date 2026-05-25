import { useEffect, useState } from "react";
import { getPendingBlogs, publishBlog, rejectBlog } from "../../services/adminApi";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { Check, X, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPending() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    getPendingBlogs()
      .then((res) => setBlogs(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const handlePublish = async (id) => {
    try {
      await publishBlog(id);
      toast.success("Blog published");
      fetch();
    } catch {
      toast.error("Publish failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBlog(id);
      toast.success("Blog rejected");
      fetch();
    } catch {
      toast.error("Reject failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-1.5 leading-none">
        <Clock className="text-primary" /> Pending Reviews
      </h1>

      {blogs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Check size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">All caught up! No pending blogs.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">{blog.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">by {blog.author?.name} · {blog.author?.email}</p>
                  <p className="text-gray-500 text-sm line-clamp-3">{blog.content}</p>
                  {blog.tags?.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {blog.tags.map((t) => (
                        <span key={t} className="text-xs bg-card text-card-text font-semibold px-2.5 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handlePublish(blog._id)} className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition cursor-pointer leading-none">
                    <Check size={16} /> Publish
                  </button>
                  <button onClick={() => handleReject(blog._id)} className="flex items-center gap-1.5 bg-danger hover:bg-danger-hover text-white px-4 py-2 rounded-lg font-semibold text-sm transition cursor-pointer leading-none">
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  const date = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.tags?.map((tag) => (
            <span key={tag} className="text-xs bg-white text-card-text font-semibold px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-3">
          {blog.content}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-3 leading-none">
            <span className="flex items-center gap-1.5 leading-none">
              <User size={14} /> {blog.author?.name || "Anonymous"}
            </span>
            <span className="flex items-center gap-1.5 leading-none">
              <Calendar size={14} /> {date}
            </span>
          </div>
          <Link
            to={`/blogs/${blog._id}`}
            className="text-primary font-semibold hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogById } from "../services/blogApi";
import Spinner from "../components/Spinner";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogById(id)
      .then((res) => setBlog(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg mb-4">Blog not found</p>
        <Link to="/blogs" className="text-primary font-semibold hover:underline">
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  const date = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <Link to="/blogs" className="inline-flex items-center gap-1.5 text-primary font-semibold mb-6 hover:underline leading-none">
        <ArrowLeft size={18} /> All Blogs
      </Link>

      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags?.map((tag) => (
          <span key={tag} className="text-xs bg-card text-card-text font-semibold px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 leading-none">
        <span className="flex items-center gap-1.5 leading-none">
          <User size={14} /> {blog.author?.name || "Anonymous"}
        </span>
        <span className="flex items-center gap-1.5 leading-none">
          <Calendar size={14} /> {date}
        </span>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm">
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{blog.content}</p>
      </div>
    </div>
  );
}

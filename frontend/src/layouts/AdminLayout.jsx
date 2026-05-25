import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "@smart-auth/react";
import { FileText, Users, LayoutDashboard } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";

export default function AdminLayout() {
  const { authenticated, user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!authenticated || !user?.roles?.includes("admin")) {
    return <Navigate to="/" replace />;
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
      isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <nav className="flex md:flex-col gap-2 bg-white rounded-2xl p-3 shadow-sm overflow-x-auto">
              <NavLink to="/admin/blogs" end className={linkClass}>
                <FileText size={18} /> Blogs
              </NavLink>
              <NavLink to="/admin/pending" className={linkClass}>
                <LayoutDashboard size={18} /> Pending
              </NavLink>
              <NavLink to="/admin/users" className={linkClass}>
                <Users size={18} /> Users
              </NavLink>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 animate-fade-in">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

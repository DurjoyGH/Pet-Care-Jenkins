import { Link } from "react-router-dom";
import { useAuth } from "@smart-auth/react";
import { Menu, X, LogOut, User, Shield } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { authenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  const isAdmin = user?.roles?.includes("admin");

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 leading-none" onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="PetCare" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-gray-800">
              Pet<span className="text-primary">Care</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 leading-none">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/blogs" className="text-gray-600 hover:text-primary transition-colors font-medium">
              Blogs
            </Link>
            <Link to="/adopt" className="text-gray-600 hover:text-primary transition-colors font-medium">
              Adopt
            </Link>

            {authenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin/blogs" className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors font-medium leading-none">
                    <Shield size={16} /> Admin
                  </Link>
                )}
                <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors font-medium leading-none">
                  <User size={16} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-600 hover:text-danger transition-colors font-medium cursor-pointer leading-none">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-full transition-colors font-medium">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-gray-600 cursor-pointer" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-3 pt-4">
              <Link to="/" onClick={() => setOpen(false)} className="text-gray-600 hover:text-primary font-medium px-2">
                Home
              </Link>
              <Link to="/blogs" onClick={() => setOpen(false)} className="text-gray-600 hover:text-primary font-medium px-2">
                Blogs
              </Link>
              <Link to="/adopt" onClick={() => setOpen(false)} className="text-gray-600 hover:text-primary font-medium px-2">
                Adopt
              </Link>

              {authenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin/blogs" onClick={() => setOpen(false)} className="text-gray-600 hover:text-primary font-medium px-2">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="text-gray-600 hover:text-primary font-medium px-2">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-left text-danger font-medium px-2 cursor-pointer">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="text-gray-600 hover:text-primary font-medium px-2">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="bg-primary text-white text-center px-5 py-2 rounded-full font-medium mx-2">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

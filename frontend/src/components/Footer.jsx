import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-1.5 mb-3 leading-none">
              <img src="/logo.png" alt="PetCare" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-gray-800">
                Pet<span className="text-primary">Care</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              A community of pet lovers sharing stories, tips, and joy about our furry friends.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-500 hover:text-primary text-sm transition-colors">Home</Link>
              <Link to="/blogs" className="text-gray-500 hover:text-primary text-sm transition-colors">All Blogs</Link>
              <Link to="/register" className="text-gray-500 hover:text-primary text-sm transition-colors">Join Us</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Contact</h4>
            <p className="text-gray-500 text-sm">contact@petcare.com</p>
            <p className="text-gray-500 text-sm mt-1">Dhaka, Bangladesh</p>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PetCare. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1.5 leading-none">
            Made with <Heart size={14} className="text-danger fill-danger" /> for pet lovers
          </p>
        </div>
      </div>
    </footer>
  );
}

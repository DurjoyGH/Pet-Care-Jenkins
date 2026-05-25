import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@smart-auth/react";
import { Toaster } from "react-hot-toast";
import { auth } from "./services/api";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Adopt from "./pages/Adopt";
import AddPet from "./pages/AddPet";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminPending from "./pages/admin/AdminPending";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <AuthProvider engine={auth}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: "Josefin Sans, sans-serif" },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/adopt" element={<Adopt />} />
            <Route path="/adopt/new" element={<AddPet />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="pending" element={<AdminPending />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

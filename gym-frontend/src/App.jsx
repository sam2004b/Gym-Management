import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Membership from "./pages/Membership";
import Classes from "./pages/Classes";
import Workout from "./pages/Workout";
import Feedback from "./pages/Feedback";
import AdminUserManagement from "./pages/AdminUserManagement";

function PublicLayout() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

function MemberLayout() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <Sidebar />
      <Outlet />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 👥 Member / Trainer Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MemberLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route
            path="/payments"
            element={<div className="p-8">Payments (coming soon)</div>}
          />
        </Route>

        {/* 🧑‍💼 Admin Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/memberships" element={<div className="p-8">Admin Memberships (coming soon)</div>} />
          <Route path="/admin/classes" element={<div className="p-8">Admin Classes (coming soon)</div>} />
          <Route path="/admin/payments" element={<div className="p-8">Admin Payments (coming soon)</div>} />
          <Route path="/admin/attendance" element={<div className="p-8">Admin Attendance (coming soon)</div>} />
          <Route path="/admin/analytics" element={<div className="p-8">Admin Analytics (coming soon)</div>} />
        </Route>

        {/* 🔁 Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

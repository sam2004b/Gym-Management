import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CalendarDays,
  CreditCard,
  CheckSquare,
  BarChart3,
  LogOut,
} from "lucide-react";

export default function AdminSidebar({ admin }) {
  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/admin" },
    { name: "User Management", icon: <Users size={18} />, to: "/admin/users" },
    { name: "Memberships", icon: <ClipboardList size={18} />, to: "/admin/memberships" },
    { name: "Classes", icon: <CalendarDays size={18} />, to: "/admin/classes" },
    { name: "Payments", icon: <CreditCard size={18} />, to: "/admin/payments" },
    { name: "Attendance", icon: <CheckSquare size={18} />, to: "/admin/attendance" },
    { name: "Analytics", icon: <BarChart3 size={18} />, to: "/admin/analytics" },
  ];

  return (
    <aside className="w-64 h-screen border-r bg-white flex flex-col justify-between">
      {/* Logo & Nav */}
      <div>
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <div className="bg-orange-500 text-white rounded-xl w-8 h-8 flex items-center justify-center font-bold text-lg">
            G
          </div>
          <h1 className="text-lg font-semibold">GymFlow</h1>
        </div>

        <nav className="mt-2">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4">
        <div className="text-sm font-medium">{admin?.fullName ?? "Admin User"}</div>
        <div className="text-xs text-gray-500 mb-3">Administrator</div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="w-full flex items-center justify-center gap-2 border text-sm py-2 rounded-md hover:bg-gray-50 transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

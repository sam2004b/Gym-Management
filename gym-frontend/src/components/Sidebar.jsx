import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../services/api";

const Item = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-5 py-3 rounded-xl transition-colors duration-150 ${
        isActive
          ? "bg-orange-600 text-white"
          : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium">{children}</span>
  </NavLink>
);

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then((r) => setUser(r.data))
      .catch(() => setUser(null));
  }, []);

  const firstName = user?.fullName?.split(" ")[0] ?? "User";
  const isAdmin = user?.role === "Admin";

  return (
    <aside className="h-screen sticky top-0 w-72 border-r bg-white flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl">
          {isAdmin ? "🏋️‍♂️" : "💪"}
        </div>
        <div className="text-2xl font-extrabold">
          {isAdmin ? "GymFlow" : "SPORTIFY"}
        </div>
      </div>

      {/* Menu */}
      <nav className="p-4 flex-1 flex flex-col gap-2">
        {isAdmin ? (
          <>
            <Item to="/admin/dashboard" icon="📊">Dashboard</Item>
            <Item to="/admin/users" icon="👥">User Management</Item>
            <Item to="/admin/memberships" icon="💳">Memberships</Item>
            <Item to="/admin/classes" icon="📅">Classes</Item>
            <Item to="/admin/payments" icon="💰">Payments</Item>
            <Item to="/admin/attendance" icon="🧾">Attendance</Item>
            <Item to="/admin/analytics" icon="📈">Analytics</Item>
          </>
        ) : (
          <>
            <Item to="/dashboard" icon="🧩">Dashboard</Item>
            <Item to="/profile" icon="👤">Profile</Item>
            <Item to="/membership" icon="🏅">Membership</Item>
            <Item to="/classes" icon="📅">Classes</Item>
            <Item to="/workout" icon="🏋️">Workout Plans</Item>
            <Item to="/payments" icon="💳">Payments</Item>
            <Item to="/feedback" icon="💬">Feedback</Item>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 border-t">
        <div className="px-2 mb-3">
          <div className="text-gray-900 font-semibold">{firstName}</div>
          <div className="text-gray-500 text-sm truncate">{user?.email ?? ""}</div>
          {isAdmin && <div className="text-xs text-gray-400 mt-1">Administrator</div>}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className={`w-full flex items-center justify-center gap-2 ${
            isAdmin
              ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          } font-semibold py-2.5 rounded-2xl transition`}
        >
          <span className="text-lg">↪</span> Logout
        </button>
      </div>
    </aside>
  );
}

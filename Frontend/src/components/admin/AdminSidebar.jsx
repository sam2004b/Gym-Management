import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const menuItem = (label, path) => (
    <button
      onClick={() => navigate(path)}
      className={`text-left px-4 py-2 rounded-lg ${
        isActive(path)
          ? "bg-orange-500 text-white"
          : "hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-64 bg-white border-r flex flex-col justify-between">
      <div>
        <div className="p-6 text-xl font-bold">GymFlow</div>

        <nav className="flex flex-col gap-2 px-4">
          {menuItem("Dashboard", "/admin")}
          {menuItem("User Management", "/admin/users")}
          {menuItem("Memberships", "/admin/memberships")}
          {menuItem("Classes", "/admin/classes")}
          {menuItem("Payments", "/admin/payments")}
          {menuItem("Analytics", "/admin/analytics")}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="mb-3">
          <p className="font-semibold">Admin User</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full border rounded-lg py-2 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
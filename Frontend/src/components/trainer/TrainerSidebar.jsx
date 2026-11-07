import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TrainerSidebar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const menu = [
    { name: "Dashboard", path: "/trainer" },
    { name: "Members", path: "/trainer/members" },
    { name: "My Classes", path: "/trainer/classes" },
    { name: "Workout Plans", path: "/trainer/workouts" },
    { name: "Feedback", path: "/trainer/feedback" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      setEmail(
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
      );
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between">

      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b">
          <div className="bg-orange-500 w-10 h-10 flex items-center justify-center rounded text-white">
            🏋️
          </div>
          <h1 className="text-xl font-semibold">GymFlow</h1>
        </div>

        <div className="mt-6 flex flex-col gap-2 px-4">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/trainer"}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="border-t p-4">
        <p className="font-semibold">{email}</p>

        <button
          onClick={handleLogout}
          className="mt-3 w-full border rounded-lg py-2 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>

    </div>
  );
}
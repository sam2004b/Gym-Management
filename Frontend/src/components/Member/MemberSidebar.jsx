import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function MemberSidebar() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("http://localhost:5136/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setUser(data);

    } catch (error) {
      console.log(error);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const baseStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-medium";

  const activeStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500 text-white font-medium";

  return (
    <div className="w-64 min-h-screen border-r flex flex-col justify-between">

      {/* Logo */}
      <div>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            GymFlow
          </h1>
        </div>

        {/* Navigation */}
        <div className="p-6 space-y-3">

          <NavLink
            to="/member"
            end
            className={({ isActive }) => isActive ? activeStyle : baseStyle}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/member/profile"
            className={({ isActive }) => isActive ? activeStyle : baseStyle}
          >
            Profile
          </NavLink>

          <NavLink
            to="/member/membership"
            className={({ isActive }) => isActive ? activeStyle : baseStyle}
          >
            Membership
          </NavLink>

          <NavLink
            to="/member/classes"
            className={({ isActive }) => isActive ? activeStyle : baseStyle}
          >
            Classes
          </NavLink>

          <NavLink
            to="/member/workouts"
            className={({ isActive }) => isActive ? activeStyle : baseStyle}
          >
            Workout Plans
          </NavLink>

          <NavLink
            to="/member/payments"
            className={({ isActive }) => isActive ? activeStyle : baseStyle}
          >
            Payments
          </NavLink>

          <NavLink
            to="/member/feedback"
            className={({ isActive }) => isActive ? activeStyle : baseStyle}
          >
            Feedback
          </NavLink>

        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-t">

        {user && (
          <>
            <p className="font-semibold">{user.fullName}</p>
            <p className="text-sm text-gray-500 mb-4">{user.email}</p>
          </>
        )}

        <button
          onClick={logout}
          className="w-full border py-2 rounded-lg hover:bg-gray-100"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default MemberSidebar;
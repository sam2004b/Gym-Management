import { Link, useNavigate } from "react-router-dom";

function Sidebar({ user }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between">

      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b">
          <div className="bg-orange-500 w-10 h-10 flex items-center justify-center rounded text-white">
            🏋️
          </div>
          <h1 className="text-xl font-semibold">GymFlow</h1>
        </div>

        {/* Menu */}
        <div className="mt-6 flex flex-col gap-2 px-4">

          <Link to="/member" className="bg-orange-500 text-white px-4 py-3 rounded-xl">
            Dashboard
          </Link>

          <Link to="/member/profile" className="px-4 py-3 rounded-xl hover:bg-gray-100">
            Profile
          </Link>

          <Link to="/member/membership" className="px-4 py-3 rounded-xl hover:bg-gray-100">
            Membership
          </Link>

          <Link to="/member/classes" className="px-4 py-3 rounded-xl hover:bg-gray-100">
            Classes
          </Link>

          <Link to="/member/workouts" className="px-4 py-3 rounded-xl hover:bg-gray-100">
            Workout Plans
          </Link>

          <Link to="/member/payments" className="px-4 py-3 rounded-xl hover:bg-gray-100">
            Payments
          </Link>

          <Link to="/member/feedback" className="px-4 py-3 rounded-xl hover:bg-gray-100">
            Feedback
          </Link>

        </div>
      </div>

      {/* User Info */}
      <div className="border-t p-4">

        <p className="font-semibold">{user.fullName}</p>
        <p className="text-sm text-gray-500">{user.email}</p>

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

export default Sidebar;
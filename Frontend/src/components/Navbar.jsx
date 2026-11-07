import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("token");

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center px-10 py-4 border-b bg-white">

      <div className="flex items-center gap-3">
        <div className="bg-orange-500 w-8 h-8 flex items-center justify-center rounded text-white">
          🏋️
        </div>
        <h1 className="font-semibold text-lg">GymFlow</h1>
      </div>

      <div className="flex gap-4 items-center">

        {!token ? (
          <>
            <Link to="/login" className="text-gray-700">
              Sign In
            </Link>

            <Link
              to="/register"
              className="bg-orange-500 text-white px-4 py-1 rounded-md"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;
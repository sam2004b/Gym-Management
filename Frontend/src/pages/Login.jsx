import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await loginUser({
      email: formData.email,
      password: formData.password,
    });

    console.log(result);

    localStorage.setItem("token", result.token);

    alert("Login successful");

    navigate("/member");

  } catch (error) {
    console.error(error);
    alert("Login error");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <div className="flex justify-center mb-4">
          <div className="bg-orange-500 w-12 h-12 flex items-center justify-center rounded-full text-white">
            🏋️
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-1">
          Welcome Back
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Sign in to your gym account
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
          >
            Sign In
          </button>

        </form>

        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 font-medium">
            Register here
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Features from "../components/Features";

function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">

      <Navbar />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center pt-24 pb-20 px-6">

        <div className="flex justify-center mb-6">
          <div className="bg-orange-500 w-16 h-16 flex items-center justify-center rounded-full text-white text-2xl shadow-md">
            🏋️
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          Gym Management System
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
          Complete solution for managing memberships, classes, payments,
          and member progress
        </p>

        <div className="flex justify-center gap-4">

          <Link to="/login">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-orange-600 transition">
              Sign In
            </button>
          </Link>

          <Link to="/register">
            <button className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
              Get Started
            </button>
          </Link>

        </div>

      </section>

      <Features />

    </div>
  );
}

export default Home;
// src/pages/Home.jsx

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center px-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-blue-700">
          Welcome to CampusConnect 🎓
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          A social media platform for students to connect, form groups, and collaborate on campus.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            to="/groups"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Explore Groups
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

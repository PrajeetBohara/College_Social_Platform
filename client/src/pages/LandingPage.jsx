// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">CampusConnect</h1>
      <p className="text-gray-600 mb-8">Connect with your campus friends</p>

      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </Link>
        <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;

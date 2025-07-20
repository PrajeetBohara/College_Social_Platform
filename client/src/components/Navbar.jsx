// src/components/Navbar.jsx

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-700">
          CampusConnect
        </Link>
        <div className="space-x-4">
          <Link to="/groups" className="text-gray-700 hover:text-blue-600">
            Groups
          </Link>
          <Link to="/search" className="text-gray-700 hover:text-blue-600">
            Search
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
          <Link to="/register" className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

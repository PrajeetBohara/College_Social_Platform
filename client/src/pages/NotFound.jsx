// src/pages/NotFound.jsx

import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-lg text-gray-700 mt-4">The page you're looking for doesn’t exist.</p>
      <Link
        to="/"
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;

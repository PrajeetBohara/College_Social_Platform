import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to CampusConnect 🎓</h1>
      <div className="space-x-4">
        <Link to="/login" className="bg-white text-blue-600 px-6 py-2 rounded shadow">
          Login
        </Link>
        <Link to="/register" className="bg-green-500 px-6 py-2 rounded shadow">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;

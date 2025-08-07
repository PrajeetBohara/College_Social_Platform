import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/");
    } else {
      console.error("Logout error:", error.message);
    }
  };

  // Optional: fetch users for live dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("users").select("id, username, email");
      if (data) setAllUsers(data);
    };
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();+
    setSearchText(value);
    const filtered = allUsers.filter((user) =>
      (user.username || user.email)?.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="bg-blue-600 text-white px-6 py-4 shadow">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Logo */}
        <h1 className="text-xl font-bold">
          <Link to="/home">CampusConnect</Link>
        </h1>

        {/* Center: Search bar */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="🔍 Find users..."
            value={searchText}
            onChange={handleSearchChange}
            className="w-full p-2 rounded text-black"
          />
          {searchText && filteredUsers.length > 0 && (
            <ul className="absolute top-12 left-0 w-full bg-white text-black shadow rounded max-h-48 overflow-y-auto z-50">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {user.username || user.email}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Nav Links */}
        <div className="flex gap-4">
          <Link to="/groups" className="hover:underline">
            Groups
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

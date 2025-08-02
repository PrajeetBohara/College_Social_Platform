// src/pages/Profile.jsx

import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams(); // get user ID from URL

  // Placeholder user data for now
  const user = {
    name: "John Doe",
    email: "john@university.edu",
    bio: "Computer Science student passionate about AI and robotics.",
    major: "Computer Science",
    year: "Junior",
    groups: ["AI Club", "Robotics Society", "Campus Hackathon Team"]
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff&size=128`}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h1 className="text-3xl font-bold text-blue-700">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-500 italic mt-2">{user.major} • {user.year}</p>
        </div>

        {/* Bio Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-700">{user.bio}</p>
        </div>

        {/* Groups Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">Groups Joined</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.groups.map((group, index) => (
              <li
                key={index}
                className="bg-blue-50 text-blue-700 rounded-md px-4 py-2 shadow-sm text-center"
              >
                {group}
              </li>
            ))}
          </ul>
        </div>

        {/* Placeholder for user id */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Profile ID: {id}
        </div>
      </div>
    </div>
  );
};

export default Profile;

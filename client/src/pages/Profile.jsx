// src/pages/Profile.jsx

import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow-md mt-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">User Profile</h1>
      <p className="text-gray-700">User ID: <strong>{id}</strong></p>
      <p className="mt-4 text-gray-600">More user info will be displayed here.</p>
    </div>
  );
};

export default Profile;

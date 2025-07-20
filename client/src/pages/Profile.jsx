// src/pages/Profile.jsx

import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams(); // placeholder for user ID

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <p className="text-gray-700">Profile ID: {id}</p>
      <p className="mt-4">This is where profile info will go.</p>
    </div>
  );
};

export default Profile;

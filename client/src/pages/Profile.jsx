import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);

  const user = auth.currentUser;

  // Fetch user data and posts
  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (user) {
        // Fetch user info
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setName(data.name || "");
          setBio(data.bio || "");
        }

        // Fetch user's posts
        const postsQuery = query(
          collection(db, "posts"),
          where("authorId", "==", user.uid)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(userPosts);
      }
    };
    fetchUserAndPosts();
  }, [user]);

  // Save user data updates
  const handleSave = async () => {
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        name,
        bio,
      });
      setUserData({ ...userData, name, bio });
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto bg-white rounded shadow p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">My Profile</h2>

        <p className="text-gray-600 mb-2">
          <strong>Email:</strong> {user.email}
        </p>

        {isEditing ? (
          <>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 mb-3 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Bio"
              className="w-full p-2 mb-3 border rounded"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-2">
              <strong>Name:</strong> {userData?.name || "Not set"}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Bio:</strong> {userData?.bio || "No bio yet"}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* User's Posts */}
      <div className="max-w-xl mx-auto bg-white rounded shadow p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">My Posts</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-gray-100 p-3 rounded mb-2">
              <p className="text-gray-800">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">You haven't posted anything yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../supabase";
// import Navbar from "../components/Navbar";

// const Profile = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [userData, setUserData] = useState({});
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [major, setMajor] = useState("");
//   const [year, setYear] = useState("");
//   const [profilePicture, setProfilePicture] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [posts, setPosts] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   // ✅ Fetch authenticated user
//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data, error } = await supabase.auth.getUser();
//       if (data?.user) {
//         setUser(data.user);
//       } else {
//         navigate("/login");
//       }
//     };
//     fetchUser();
//   }, [navigate]);

//   // ✅ Fetch user profile data and posts
//   useEffect(() => {
//     if (!user) return;

//     const fetchProfile = async () => {
//       const { data: profileData } = await supabase
//         .from("users")
//         .select("*")
//         .eq("id", user.id)
//         .single();

//       if (profileData) {
//         setUserData(profileData);
//         setName(profileData.name || "");
//         setBio(profileData.bio || "");
//         setMajor(profileData.major || "");
//         setYear(profileData.year || "");
//         setProfilePicture(profileData.profile_picture || "");
//       }
//     };

//     const fetchPosts = async () => {
//       const { data: postData } = await supabase
//         .from("posts")
//         .select("*")
//         .eq("author_id", user.id)
//         .order("created_at", { ascending: false });

//       if (postData) {
//         setPosts(postData);
//       }
//     };

//     fetchProfile();
//     fetchPosts();
//   }, [user]);

//   // ✅ Handle Save
//   const handleSave = async () => {
//     const { error } = await supabase
//       .from("users")
//       .update({
//         name,
//         bio,
//         major,
//         year,
//         profile_picture: profilePicture,
//       })
//       .eq("id", user.id);

//     if (!error) {
//       setUserData({ name, bio, major, year, profile_picture: profilePicture });
//       setIsEditing(false);
//     }
//   };

//   // ✅ Handle Profile Picture Upload
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);

//     const fileExt = file.name.split(".").pop();
//     const fileName = `${user.id}.${fileExt}`;
//     const filePath = `profile_pictures/${fileName}`;

//     const { error: uploadError } = await supabase.storage
//       .from("avatars")
//       .upload(filePath, file, { upsert: true });

//     if (uploadError) {
//       console.error("Upload failed:", uploadError.message);
//       setUploading(false);
//       return;
//     }

//     const {
//       data: { publicUrl },
//     } = supabase.storage.from("avatars").getPublicUrl(filePath);

//     setProfilePicture(publicUrl);
//     setUploading(false);
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <p>Please login to view your profile.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="max-w-xl mx-auto bg-white rounded shadow p-6 mt-6">
//         <h2 className="text-2xl font-bold mb-4 text-blue-600">My Profile</h2>

//         {/* Profile Picture */}
//         {profilePicture && (
//           <img
//             src={profilePicture}
//             alt="Profile"
//             className="w-24 h-24 rounded-full mb-4 object-cover"
//           />
//         )}
//         {isEditing && (
//           <input type="file" onChange={handleImageUpload} className="mb-4" />
//         )}

//         <p className="text-gray-600 mb-2">
//           <strong>Email:</strong> {user.email}
//         </p>

//         {isEditing ? (
//           <>
//             <input
//               type="text"
//               placeholder="Full Name"
//               className="w-full p-2 mb-3 border rounded"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Major"
//               className="w-full p-2 mb-3 border rounded"
//               value={major}
//               onChange={(e) => setMajor(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Year"
//               className="w-full p-2 mb-3 border rounded"
//               value={year}
//               onChange={(e) => setYear(e.target.value)}
//             />
//             <textarea
//               placeholder="Bio"
//               className="w-full p-2 mb-3 border rounded"
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={handleSave}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <p className="text-gray-700 mb-2">
//               <strong>Name:</strong> {userData?.name || "Not set"}
//             </p>
//             <p className="text-gray-700 mb-2">
//               <strong>Major:</strong> {userData?.major || "Not set"}
//             </p>
//             <p className="text-gray-700 mb-2">
//               <strong>Year:</strong> {userData?.year || "Not set"}
//             </p>
//             <p className="text-gray-700 mb-4">
//               <strong>Bio:</strong> {userData?.bio || "No bio yet"}
//             </p>
//             <button
//               onClick={() => setIsEditing(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Edit Profile
//             </button>
//           </>
//         )}
//       </div>

//       {/* User's Posts */}
//       <div className="max-w-xl mx-auto bg-white rounded shadow p-6 mt-6">
//         <h3 className="text-xl font-semibold mb-4 text-blue-600">My Posts</h3>
//         {posts.length > 0 ? (
//           posts.map((post) => (
//             <div key={post.id} className="bg-gray-100 p-3 rounded mb-2">
//               <p className="text-gray-800">{post.content}</p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">You haven't posted anything yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";
import { v4 as uuidv4 } from "uuid";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  // ✅ Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // ✅ Fetch user profile data and posts
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setUserData(profileData);
        setName(profileData.name || "");
        setBio(profileData.bio || "");
        setMajor(profileData.major || "");
        setYear(profileData.year || "");
        setProfilePicture(profileData.profile_picture || "");
      }
    };

    const fetchPosts = async () => {
      const { data: postData } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (postData) {
        setPosts(postData);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [user]);

  // ✅ Handle Save
  const handleSave = async () => {
    let uploadedUrl = profilePicture;

    // ✅ Upload profile picture if selected
    if (avatarFile) {
      setUploading(true);
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}-${uuidv4()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile);

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      uploadedUrl = publicUrl;
      setProfilePicture(publicUrl);
      setUploading(false);
    }

    // ✅ Save to users table
    const { error } = await supabase
      .from("users")
      .update({
        name,
        bio,
        major,
        year,
        profile_picture: uploadedUrl,
      })
      .eq("id", user.id);

    if (!error) {
      setUserData({
        ...userData,
        name,
        bio,
        major,
        year,
        profile_picture: uploadedUrl,
      });
      setIsEditing(false);
      setAvatarFile(null);
    } else {
      console.error("Profile update failed:", error.message);
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

        {/* Profile Picture */}
        {(profilePicture || avatarFile) && (
          <img
            src={
              avatarFile
                ? URL.createObjectURL(avatarFile)
                : profilePicture || userData?.profile_picture
            }
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
        )}

        {/* Image Upload */}
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className="mb-4"
          />
        )}

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
            <input
              type="text"
              placeholder="Major"
              className="w-full p-2 mb-3 border rounded"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Year"
              className="w-full p-2 mb-3 border rounded"
              value={year}
              onChange={(e) => setYear(e.target.value)}
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
                {uploading ? "Saving..." : "Save"}
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
            <p className="text-gray-700 mb-2">
              <strong>Major:</strong> {userData?.major || "Not set"}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Year:</strong> {userData?.year || "Not set"}
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

// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";
import { v4 as uuidv4 } from "uuid";

const PROFILE_TABLE = "users"; // <-- if you kept 'users', set to "users"

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

  // get current auth user
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      else navigate("/login");
    })();
  }, [navigate]);

  // load profile + posts
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      // 1) ensure a profile row exists (insert if missing)
      let { data: profile, error: selErr } = await supabase
        .from(PROFILE_TABLE)
        .select("id,name,bio,major,year,profile_picture,email")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        // create a blank row for this user
        const { error: insErr } = await supabase.from(PROFILE_TABLE).insert({
          id: user.id,
          email: user.email, // private field, only owner sees
          name: "",
          bio: "",
          major: "",
          year: "",
          profile_picture: ""
        });
        if (insErr) {
          console.error("Insert profile failed (RLS?):", insErr.message);
          return;
        }
        // re-select
        const res = await supabase
          .from(PROFILE_TABLE)
          .select("id,name,bio,major,year,profile_picture,email")
          .eq("id", user.id)
          .maybeSingle();
        profile = res.data;
      }

      // set state
      setUserData(profile || {});
      setName(profile?.name || "");
      setBio(profile?.bio || "");
      setMajor(profile?.major || "");
      setYear(profile?.year || "");
      setProfilePicture(profile?.profile_picture || "");

      // posts
      const { data: postData } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });
      setPosts(postData || []);
    };

    load();
  }, [user]);

  // save profile fields
  const handleSave = async () => {
    const { error } = await supabase
      .from(PROFILE_TABLE)
      .update({
        name,
        bio,
        major,
        year,
        profile_picture: profilePicture
      })
      .eq("id", user.id)
      .select(); // helps surface errors

    if (error) {
      console.error("Profile update failed:", error.message);
      return;
    }
    setUserData((prev) => ({
      ...prev,
      name,
      bio,
      major,
      year,
      profile_picture: profilePicture
    }));
    setIsEditing(false);
    setAvatarFile(null);
  };

  // upload image and immediately persist URL
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const fileName = `${user.id}-${uuidv4()}.${ext}`;
      const path = `avatars/${fileName}`; // stored inside bucket 'avatars'

      // upload
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, file);

      if (uploadErr) throw uploadErr;

      // public URL
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      // persist to DB immediately so refresh keeps it
      const { error: updErr } = await supabase
        .from(PROFILE_TABLE)
        .update({ profile_picture: publicUrl })
        .eq("id", user.id);

      if (updErr) throw updErr;

      setProfilePicture(publicUrl);
      setAvatarFile(null);
    } catch (err) {
      console.error("Upload/save failed:", err.message);
    } finally {
      setUploading(false);
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

        {(profilePicture || avatarFile) && (
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile) : profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
        )}

        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
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


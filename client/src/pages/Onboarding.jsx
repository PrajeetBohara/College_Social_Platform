// src/pages/Onboarding.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { v4 as uuidv4 } from "uuid";

const Onboarding = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return navigate("/login");
      setUser(data.user);

      // preload if the row exists
      const { data: row } = await supabase
        .from("users")
        .select("name,major,year,bio,profile_picture")
        .eq("id", data.user.id)
        .maybeSingle();

      if (row) {
        setName(row.name || "");
        setMajor(row.major || "");
        setYear(row.year || "");
        setBio(row.bio || "");
        setProfilePicture(row.profile_picture || "");
      }
    })();
  }, [navigate]);

  const uploadAvatarIfNeeded = async () => {
    if (!avatarFile || !user) return profilePicture; // use existing
    const ext = avatarFile.name.split(".").pop();
    const key = `avatars/${user.id}-${uuidv4()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(key, avatarFile, { upsert: false });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("avatars").getPublicUrl(key);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const url = await uploadAvatarIfNeeded();
      const { error } = await supabase
        .from("users")
        .update({
          name,
          major,
          year,
          bio,
          profile_picture: url || profilePicture || ""
        })
        .eq("id", user.id);
      if (error) throw error;

      navigate("/home");
    } catch (err) {
      console.error("Onboarding save failed:", err.message);
      alert("Could not save profile. Check policies/connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-xl shadow p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-blue-700">Welcome! Set up your profile</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Profile picture</label>
          {profilePicture && (
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : profilePicture}
              alt="preview"
              className="h-24 w-24 rounded-full object-cover mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          />
        </div>

        <input
          className="w-full border rounded p-2"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Year (e.g., Sophomore)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <textarea
          className="w-full border rounded p-2 min-h-[90px]"
          placeholder="Short bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
};

export default Onboarding;

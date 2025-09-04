

import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1) Create auth user
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // With email confirmation OFF, we should have a session + user now
      const user = data.user;
      if (!user) {
        setErrorMsg("Sign up succeeded but no session. Try logging in.");
        return;
      }

      // 2) Create/ensure profile row (RLS: auth.uid() = id)
      const { error: upsertError } = await supabase
        .from("users") // <-- change to "users" ONLY if that's your actual table
        .upsert(
          {
            id: user.id,
            email: user.email,
            name: name || "",
            bio: "",
            major: "",
            year: "",
            profile_picture: ""
          },
          { onConflict: "id" }
        );

      if (upsertError) throw upsertError;

      // 3) Go to onboarding
      navigate("/onboarding");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Register</h2>

        {errorMsg && <p className="text-red-500 text-sm mb-3">{errorMsg}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;

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

    // Step 1: Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Step 2: Create user profile in `users` table
    const user = data.user;
    if (user) {
      const { error: userError } = await supabase.from("users").insert([
        {
          id: user.id,
          name: name,
          email: email,
          bio: "",
          major: "",
          year: "",
          profile_picture: ""
        },
      ]);

      if (userError) {
        setErrorMsg("Signup succeeded, but profile creation failed.");
        console.error(userError);
      } else {
        alert("✅ Registration successful! Check your email to confirm.");
        navigate("/login");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-80"
      >
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
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;

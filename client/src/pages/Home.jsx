import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../supabase";
import { FaPaperPlane, FaCommentDots } from "react-icons/fa";

const Home = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    fetchUser();
  }, []);

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("groups")
        .select("*")
        .contains("members", [user.id]);

      if (data) {
        setGroups(data);
        if (!selectedGroup && data.length > 0) {
          setSelectedGroup(data[0].id);
        }
      }
    };
    fetchGroups();
  }, [user]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!selectedGroup) return;
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("group_id", selectedGroup)
        .order("created_at", { ascending: false });

      if (data) setPosts(data);
    };
    fetchPosts();
  }, [selectedGroup]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("users").select("id, username, email");
      if (data) {
        setAllUsers(data);
        setFilteredUsers(data);
      }
    };
    fetchUsers();
  }, []);

  // Filter posts
  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      (post.author?.toLowerCase() || "").includes(search.toLowerCase())
  );

  // Filter users (user search bar)
  const handleUserSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const results = allUsers.filter((u) =>
      u.username?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query)
    );
    setFilteredUsers(results);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !user || !selectedGroup) return;

    const { error } = await supabase.from("posts").insert([
      {
        content: newPost,
        author: user.email,
        author_id: user.id,
        group_id: selectedGroup,
      },
    ]);

    if (!error) {
      setNewPost("");
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("group_id", selectedGroup)
        .order("created_at", { ascending: false });
      setPosts(data);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      alert("Please type a message before sending.");
      return;
    }
    alert("✅ Message sent to all connected friends:\n\n" + messageText);
    setMessageText("");
    setMessageOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />



      {/* 🔹 Main Content */}
      <div className="max-w-3xl mx-auto p-6">
        <form onSubmit={handleCreatePost} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 p-3 border rounded"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Post
          </button>
        </form>

        <input
          type="text"
          placeholder="Search posts..."
          className="w-full p-3 mb-6 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded shadow">
                <p className="text-gray-800">{post.content}</p>
                <p className="text-sm text-gray-500 mt-1">— {post.author}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No posts yet for this group.</p>
          )}
        </div>
      </div>

      {/* 🔹 Floating Message Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMessageOpen(true)}
          className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:bg-blue-700"
          aria-label="Message All Friends"
        >
          <FaCommentDots size={20} />
        </button>
      </div>

      {/* 🔹 Message Popup Modal */}
      {messageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-80 shadow-lg relative">
            <button
              onClick={() => setMessageOpen(false)}
              className="absolute top-2 right-2 text-gray-600 text-sm hover:text-black"
              aria-label="Close message popup"
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Message All Friends</h3>
            <textarea
              className="w-full border p-2 rounded h-24 focus:outline-none"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            ></textarea>
            <button
              onClick={handleSendMessage}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              <FaPaperPlane className="inline mr-2" />
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

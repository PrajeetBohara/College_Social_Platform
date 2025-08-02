import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  // Fetch groups user belongs to
  useEffect(() => {
    const unsubscribeGroups = onSnapshot(collection(db, "groups"), (snapshot) => {
      const allGroups = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const userGroups = allGroups.filter((g) =>
        g.members.includes(auth.currentUser.uid)
      );
      setGroups(userGroups);
      if (userGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(userGroups[0].id);
      }
    });
    return () => unsubscribeGroups();
  }, [selectedGroup]);

  // Fetch posts from the selected group
  useEffect(() => {
    if (!selectedGroup) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const fetchedPosts = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((post) => post.groupId === selectedGroup);
        setPosts(fetchedPosts);
      }
    );
    return () => unsubscribe();
  }, [selectedGroup]);

  // Create a new post in the selected group
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (newPost.trim() === "" || !selectedGroup) return;

    const user = auth.currentUser;
    let name = "Anonymous";

    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        name = userDoc.data().name;
      }
    }

    await addDoc(collection(db, "posts"), {
      content: newPost,
      author: name,
      authorId: user.uid,
      groupId: selectedGroup,
      timestamp: serverTimestamp(),
    });

    setNewPost("");
  };

  // Filter posts by search
  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        {/* Group selector */}
        <div className="mb-4">
          <label className="font-semibold mr-2">Select Group:</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="p-2 border rounded"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Create post form */}
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

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full p-3 mb-6 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Posts feed */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded shadow">
                <p className="text-gray-800">{post.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  — {post.author || "Unknown"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No posts yet for this group.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

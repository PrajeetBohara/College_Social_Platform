import { useState } from "react";
import Navbar from "../components/Navbar";
import { FaPaperPlane, FaCommentDots } from "react-icons/fa";

const Home = () => {
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  // Dummy connected friends
  const friends = [
    { name: "Alice Johnson", post: "Excited for the campus fest!" },
    { name: "Brian Lee", post: "Just submitted my final project. 🧠" },
    { name: "Carla Smith", post: "Looking for study buddies 📚" },
  ];

  const handleSendMessage = () => {
    alert("Message sent to all connected friends: " + messageText);
    setMessageText("");
    setMessageOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed Section */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Your Feed</h2>

          {/* Post input box (UI only) */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <input
              type="text"
              placeholder="What's on your mind?"
              className="w-full border rounded px-4 py-2 mb-2 focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 float-right">
              Post
            </button>
            <div className="clear-both"></div>
          </div>

          {/* Friend posts */}
          <div className="space-y-4">
            {friends.map((friend, i) => (
              <div key={i} className="bg-white p-4 rounded shadow flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                  {friend.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-blue-800">{friend.name}</p>
                  <p className="text-gray-700 mt-1">{friend.post}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Friends List */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-bold text-blue-700 mb-2">Connected Friends</h3>
          <ul className="space-y-2">
            {friends.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center text-sm">
                  {f.name.split(" ").map(n => n[0]).join("")}
                </div>
                <span className="text-gray-800">{f.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMessageOpen(true)}
          className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:bg-blue-700"
          aria-label="Message All Friends"
        >
          <FaCommentDots size={20} />
        </button>
      </div>


      {/* Popup modal for messaging friends */}
      {messageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-80 shadow-lg relative">
            <button
              onClick={() => setMessageOpen(false)}
              className="absolute top-2 right-2 text-gray-600 text-sm hover:text-black"
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

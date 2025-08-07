import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../supabase";

const Groups = () => {
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  // Fetch all groups
  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase.from("groups").select("*");
      if (data) setGroups(data);
    };
    fetchGroups();
  }, []);

  // Create a new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !user) return;

    await supabase.from("groups").insert([
      {
        name: groupName,
        created_by: user.id,
        members: [user.id],
      },
    ]);

    setGroupName("");

    // Refresh groups
    const { data } = await supabase.from("groups").select("*");
    setGroups(data);
  };

  // Join a group
  const handleJoinGroup = async (groupId, currentMembers) => {
    const updatedMembers = [...new Set([...currentMembers, user.id])]; // avoid duplicates

    await supabase
      .from("groups")
      .update({ members: updatedMembers })
      .eq("id", groupId);

    // Refresh groups
    const { data } = await supabase.from("groups").select("*");
    setGroups(data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto bg-white rounded shadow p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Groups</h2>

        {/* Create group */}
        <form onSubmit={handleCreateGroup} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="New group name"
            className="flex-1 p-2 border rounded"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create
          </button>
        </form>

        {/* Group list */}
        <div className="space-y-3">
          {groups.length > 0 ? (
            groups.map((group) => (
              <div
                key={group.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded"
              >
                <span className="font-semibold">{group.name}</span>
                {group.members?.includes(user?.id) ? (
                  <span className="text-green-600 text-sm font-semibold">
                    Joined
                  </span>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group.id, group.members || [])}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Join
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No groups yet. Create one above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;

// src/pages/Search.jsx

const Search = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Search Users or Groups</h1>
      <input
        type="text"
        placeholder="Type a name or keyword..."
        className="w-full p-3 border border-gray-300 rounded shadow-sm"
      />
      <div className="mt-4 text-gray-600">Search results will appear here.</div>
    </div>
  );
};

export default Search;

// src/pages/Search.jsx

const Search = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Search</h1>
      <input
        type="text"
        placeholder="Search for users or groups..."
        className="w-full p-2 border rounded shadow-sm"
      />
      {/* Later we'll display live search results */}
    </div>
  );
};

export default Search;

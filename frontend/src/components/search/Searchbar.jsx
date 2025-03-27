import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoClose, IoTrash } from "react-icons/io5";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Load history recentSearch when component mount
  useEffect(() => {
    const storedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    navigate(`/search/${searchTerm.trim()}`);

    const updatedSearches = [
      searchTerm.trim(),
      ...recentSearches.filter((item) => item !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    setShowDropdown(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    setShowDropdown(true);
  };

  const handleSelectSearch = (query) => {
    setSearchTerm(query);
    navigate(`/search/${query}`);
    setShowDropdown(false);
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className="relative w-[200px] sm:w-[375px]">
      {/* Input Search */}
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex items-center w-full sm:w-[375px] bg-[#26242A] rounded-lg px-4 py-2 transition-all duration-200 hover:bg-[#2E2C34] border-2 border-transparent focus-within:border-[#8A86FF]">
        <FiSearch
          className={`w-5 h-5 ${searchTerm ? "text-white" : "text-gray-400"}`}
        />
        <input
          name="search-field"
          id="search-field"
          placeholder="Artists, tracks,..."
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="flex-1 w-full sm:w-auto bg-transparent border-none outline-none placeholder-gray-500 text-white px-3"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="focus:outline-none">
            <IoClose className="w-5 h-5 text-white hover:text-gray-300" />
          </button>
        )}
      </form>

      {/* Recent Searches Dropdown */}
      {showDropdown && recentSearches.length > 0 && (
        <div className="absolute left-0 mt-2 w-full bg-[#1E1C22] rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 text-gray-400 text-sm border-b border-gray-700">
            <span>Recent searches</span>
            <button onClick={handleClearHistory} className="hover:text-white">
              <IoTrash className="w-4 h-4" />
            </button>
          </div>
          <ul>
            {recentSearches.map((query, index) => (
              <li
                key={index}
                onMouseDown={() => handleSelectSearch(query)}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-[#2E2C34] text-white">
                <FiSearch className="w-4 h-4 text-gray-400 mr-3" />
                <span>{query}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Searchbar;

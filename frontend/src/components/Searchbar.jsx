import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import _ from "lodash";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      if (query.trim()) {
        navigate(`/search/${query.trim()}`);
      }
    }, 500),
    []
  );

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    debouncedSearch("");
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      autoComplete="off"
      className="flex items-center bg-[#26242A] rounded-lg w-[375px] px-4 py-2 transition-all duration-200 hover:bg-[#2E2C34] border-2 border-transparent focus-within:border-[#8A86FF]">
      <FiSearch
        className={`w-5 h-5 transition-all duration-200 ${
          searchTerm ? "text-white" : "text-gray-400"
        }`}
      />

      <input
        name="search-field"
        id="search-field"
        placeholder="Artists, tracks, podcasts..."
        type="text"
        value={searchTerm}
        onChange={handleChange}
        className="flex-1 bg-transparent border-none outline-none placeholder-gray-500 text-white px-3"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="focus:outline-none">
          <IoClose className="w-5 h-5 text-white transition-all duration-200 hover:text-gray-300" />
        </button>
      )}
    </form>
  );
};

export default Searchbar;

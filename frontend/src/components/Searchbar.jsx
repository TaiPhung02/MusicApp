import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex items-center bg-[#26242A] rounded-lg w-[375px] px-4 py-2 transition-all duration-200 hover:bg-[#2E2C34] border-2 border-transparent focus-within:border-[#8A86FF]">
      <FiSearch className="w-5 h-5 text-gray-400" />
      <input
        name="search-field"
        id="search-field"
        placeholder="Artists, tracks, podcasts..."
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none placeholder-gray-500 text-white px-3"
      />
    </form>
  );
};

export default Searchbar;

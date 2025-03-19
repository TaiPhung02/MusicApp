import Searchbar from "./Searchbar";
import User from "./User";
import { FiBell } from "react-icons/fi";

const Header = () => {
  return (
    <div className="flex items-center justify-between bg-[#0F0D13] p-4">
      <Searchbar />
      <div className="flex items-center gap-4">
        <FiBell className="text-gray-400 w-5 h-5 cursor-pointer hover:text-white" />
        <User />
      </div>
    </div>
  );
};

export default Header;

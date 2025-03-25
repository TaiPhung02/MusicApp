import Notification from "./Notification";
import Searchbar from "./Searchbar";
import User from "./User";

const Header = () => {
  return (
    <div className="flex items-center justify-between bg-[#0F0D13] p-4">
      <Searchbar />
      <div className="mr-10 md:mr-0 flex items-center gap-4 ">
        <Notification />
        <User />
      </div>
    </div>
  );
};

export default Header;

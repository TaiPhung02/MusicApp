import Notification from "../common/Notification";
import Searchbar from "../search/Searchbar";
import User from "../user/User";

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

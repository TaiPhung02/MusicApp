import { Menu } from "@headlessui/react";
import { FiBell } from "react-icons/fi";
import { IoPeopleOutline } from "react-icons/io5";

const Notification = () => {
  return (
    <Menu as="div" className="relative">
      {/* Notification Icon */}
      <Menu.Button className="p-2 rounded-full hover:bg-[#3a393d] ">
        <FiBell className="w-5 h-5 cursor-pointer text-white" />
      </Menu.Button>

      {/* Dropdown Menu */}
      <Menu.Items className="absolute right-0 mt-2 w-80 bg-[#181818] text-white shadow-lg rounded-lg p-4 z-50 focus:outline-none">
        {/* Header */}
        <h3 className="text-lg font-semibold pb-3 border-b border-gray-700">
          Notifications
        </h3>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center mt-6">
          <IoPeopleOutline className="text-gray-400 w-12 h-12" />
          <p className="text-gray-400 mt-2">Don't stay on your own.</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500">
            Add artists
          </button>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default Notification;

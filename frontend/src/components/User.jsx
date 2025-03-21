import { Menu } from "@headlessui/react";

const User = () => {
  return (
    <Menu as="div" className="relative">
      {/* Avatar */}
      <Menu.Button className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white cursor-pointer">
        TP
      </Menu.Button>

      {/* Dropdown Menu */}
      <Menu.Items className="absolute right-0 mt-2 w-80 bg-[#181818] text-white shadow-lg rounded-lg p-4 z-50 focus:outline-none">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-700 pb-3">
          <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white">
            TP
          </div>
          <div>
            <p className="font-semibold">Tai Phung</p>
            <p className="text-sm text-gray-400">
              Choose what you listen to. Ad-free.
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-3">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`w-full text-left p-3 rounded ${
                  active ? "bg-[#29282D]" : ""
                }`}>
                Account settings
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`w-full text-left p-3 rounded ${
                  active ? "bg-[#29282D]" : ""
                }`}>
                Manage my subscription
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`w-full text-left p-3 rounded ${
                  active ? "bg-[#29282D]" : ""
                }`}>
                Manage my exclusions
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`w-full text-left p-3 rounded ${
                  active ? "bg-[#29282D]" : ""
                }`}>
                Activate a code
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`w-full text-left p-3 rounded mt-2 text-red-400 ${
                  active ? "bg-red-600" : ""
                }`}>
                Log out
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default User;

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdPlaylistAdd,
  MdFavorite,
  MdQueueMusic,
  MdClose,
  MdShare,
  MdMoreHoriz,
} from "react-icons/md";
import { addNextSongToQueue } from "../redux/features/playerSlice";
import { toast } from "react-toastify";

const MoreOptionsMenu = ({ song }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const currentSongs = useSelector((state) => state.player.currentSongs);

  const handleAddNext = () => {
    const isAlreadyInQueue = currentSongs.some((track) => track.id === song.id);

    if (isAlreadyInQueue) {
      toast.warn("Track already exists in queue", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      dispatch(addNextSongToQueue({ song }));
      toast.success("Added to queue", {
        position: "top-right",
        autoClose: 1500,
      });
    }

    setIsOpen(false);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={`p-2 rounded-full transition-colors ${
          isOpen ? "bg-[#2a2830]" : "hover:bg-[#3a393d]"
        }`}
        onClick={() => setIsOpen(!isOpen)}>
        <MdMoreHoriz size={24} color="#FFF" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        afterLeave={() => setIsOpen(false)}>
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-[#1b191f] shadow-lg rounded-lg z-50">
          <div className="p-2 text-white text-sm">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleAddNext}
                  className={`${
                    active ? "bg-[#2a2830]" : ""
                  } flex items-center text-md text-white w-full px-3 py-2 rounded-md`}>
                  <MdQueueMusic className="mr-3" /> Listen next
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-[#2a2830]" : ""
                  } flex items-center text-md text-white w-full px-3 py-2 rounded-md`}>
                  <MdPlaylistAdd className="mr-3" /> Add to playlist...
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-[#2a2830]" : ""
                  } flex items-center text-md text-white w-full px-3 py-2 rounded-md`}>
                  <MdFavorite className="mr-3" /> Add to favourites
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-[#2a2830]" : ""
                  } flex items-center text-md text-white w-full px-3 py-2 rounded-md`}>
                  <MdShare className="mr-3" /> Share
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-red-600 text-white" : "text-gray-400"
                  } flex items-center text-md text-white w-full px-3 py-2 rounded-md`}>
                  <MdClose className="mr-3" /> Remove from queue
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MoreOptionsMenu;

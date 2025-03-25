import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdPlaylistAdd,
  MdFavorite,
  MdQueueMusic,
  MdClose,
  MdShare,
  MdMoreHoriz,
} from "react-icons/md";
import { toast } from "react-toastify";
import {
  addNextSongToQueue,
} from "../redux/features/playerSlice";
import AddToPlaylistMenu from "./AddToPlaylistMenu";

const MoreOptionsMenu = ({ song }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const currentSongs = useSelector((state) => state.player.currentSongs);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsAddToPlaylistOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddNext = () => {
    if (currentSongs.some((track) => track.id === song.id)) {
      toast.warn("Track already exists in queue", { autoClose: 2000 });
    } else {
      dispatch(addNextSongToQueue({ song }));
      toast.success("Added to queue", { autoClose: 1500 });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        className={`p-2 rounded-full transition-colors ${
          isOpen ? "bg-[#2a2830]" : "hover:bg-[#3a393d]"
        }`}
        onClick={() => setIsOpen(!isOpen)}>
        <MdMoreHoriz size={24} color="#FFF" />
      </button>

      {isOpen && !isAddToPlaylistOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1b191f] shadow-lg rounded-lg z-50 p-2 text-white text-sm">
          <button
            onClick={handleAddNext}
            className="flex items-center text-md text-white w-full px-3 py-2 rounded-md hover:bg-[#2a2830]">
            <MdQueueMusic className="mr-3" /> Listen next
          </button>

          <button
            onClick={() => setIsAddToPlaylistOpen(true)}
            className="flex items-center text-md text-white w-full px-3 py-2 rounded-md hover:bg-[#2a2830]">
            <MdPlaylistAdd className="mr-3" /> Add to playlist...
          </button>

          <button className="flex items-center text-md text-white w-full px-3 py-2 rounded-md hover:bg-[#2a2830]">
            <MdFavorite className="mr-3" /> Add to favourites
          </button>

          <button className="flex items-center text-md text-white w-full px-3 py-2 rounded-md hover:bg-[#2a2830]">
            <MdShare className="mr-3" /> Share
          </button>

          <button className="flex items-center text-md w-full px-3 py-2 rounded-md text-gray-400 hover:bg-red-600 hover:text-white">
            <MdClose className="mr-3" /> Remove from queue
          </button>
        </div>
      )}

      {isOpen && isAddToPlaylistOpen && (
        <AddToPlaylistMenu
          onBack={() => setIsAddToPlaylistOpen(false)}
          onClose={() => {
            setIsOpen(false);
            setIsAddToPlaylistOpen(false);
          }}
          song={song}
        />
      )}
    </div>
  );
};

export default MoreOptionsMenu;

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
  addToFavourites,
  removeFromFavourites,
  removeSongFromQueue,
} from "../redux/features/playerSlice";
import AddToPlaylistMenu from "./AddToPlaylistMenu";

const MoreOptionsMenu = ({ song }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();

  const { currentSongs, favourites } = useSelector((state) => state.player);

  if (!song) {
    return null;
  }

  const isFavourite = favourites.some((s) => s.id === song.id);

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

  const handleToggleFavourite = () => {
    if (!song || !song.id) {
      console.error("Error: song is undefined or missing an ID");
      return;
    }

    if (isFavourite) {
      dispatch(removeFromFavourites(song.id));
      // toast.info(`Removed from favourites`, { autoClose: 1500 });
    } else {
      dispatch(addToFavourites(song));
      // toast.success(`Added to favourites`, { autoClose: 1500 });
    }
  };

  const handleShare = async () => {
    if (!song || !song.id) {
      console.error("Error: song is undefined or missing an ID");
      return;
    }

    const baseUrl = window.location.origin;
    const songUrl = `${baseUrl}/songs/${song.id}`;

    try {
      await navigator.clipboard.writeText(songUrl);
      toast.success("Link copied to clipboard!", { autoClose: 1500 });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link.", { autoClose: 1500 });
    }
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

          <button
            onClick={handleToggleFavourite}
            className="flex items-center text-md w-full px-3 py-2 rounded-md hover:bg-[#2a2830]">
            <MdFavorite
              className={`mr-3 ${isFavourite ? "text-red-500" : "text-white"}`}
            />
            {isFavourite ? "Remove from favourites" : "Add to favourites"}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center text-md text-white w-full px-3 py-2 rounded-md hover:bg-[#2a2830]">
            <MdShare className="mr-3" /> Share
          </button>

          <button
            onClick={() => dispatch(removeSongFromQueue(song.id))}
            className="flex items-center text-md w-full px-3 py-2 rounded-md text-gray-400 hover:bg-red-600 hover:text-white">
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

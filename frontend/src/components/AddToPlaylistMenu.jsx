import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdArrowBack,
  MdPlaylistAdd,
  MdCheck,
  MdMusicNote,
} from "react-icons/md";
import {
  addSongToPlaylist,
  removeSongFromPlaylist,
  createPlaylist,
} from "../redux/features/playerSlice";
import { toast } from "react-toastify";

const AddToPlaylistMenu = ({ onBack, onClose, song }) => {
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.player.playlists || []);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  if (!song) {
    return null;
  }

  const isSongInPlaylist = (playlist, songId) =>
    playlist.songs.some((s) => s.id === songId);

  const handleToggleSongInPlaylist = (playlist) => {
    if (isSongInPlaylist(playlist, song.id)) {
      dispatch(
        removeSongFromPlaylist({ playlistId: playlist.id, songId: song.id })
      );
      toast.info(`Removed from "${playlist.name}"`, { autoClose: 1500 });
    } else {
      dispatch(addSongToPlaylist({ playlistId: playlist.id, song }));
      toast.success(`Added to "${playlist.name}"`, { autoClose: 1500 });
    }
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      dispatch(createPlaylist(newPlaylistName.trim()));
      setNewPlaylistName("");
      toast.success(`Playlist "${newPlaylistName}" created!`, {
        autoClose: 1500,
      });
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-72 bg-[#1b191f] shadow-lg rounded-lg z-50 p-3 text-white text-sm">
      <div className="flex items-center mb-3">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">
          <MdArrowBack size={24} />
        </button>
        <h3 className="text-white text-lg font-semibold flex-1 text-center">
          Add to Playlist
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="flex items-center bg-[#252329] p-2 rounded-md mb-3">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name"
          className="w-full p-2 rounded-md text-black outline-none"
        />
        <button
          onClick={handleCreatePlaylist}
          className="ml-2 text-purple-400 hover:text-purple-300">
          <MdPlaylistAdd size={24} />
        </button>
      </div>

      <div className="space-y-2">
        {playlists.length === 0 ? (
          <p className="text-gray-400 text-center py-2">No playlists found</p>
        ) : (
          playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handleToggleSongInPlaylist(playlist)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-md bg-[#252329] hover:bg-[#323036] transition-all">
              <div className="flex items-center">
                <MdMusicNote className="text-gray-400 mr-3" size={20} />
                <span className="text-white font-medium">{playlist.name}</span>
              </div>

              <span className="w-6 flex justify-center">
                {isSongInPlaylist(playlist, song.id) && (
                  <MdCheck className="text-green-400" size={24} />
                )}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default AddToPlaylistMenu;

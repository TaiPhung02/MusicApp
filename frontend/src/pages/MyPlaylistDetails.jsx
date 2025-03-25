import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPlay, FaPause, FaShareAlt, FaEllipsisH } from "react-icons/fa";
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import { Loader, Error, SongTable } from "../components";
import { formatDuration } from "./PlaylistDetails";

const MyPlaylistDetails = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const storedPlaylists = JSON.parse(localStorage.getItem("playlists")) || [];
    const foundPlaylist = storedPlaylists.find((p) => p.id === playlistId);
    setPlaylist(foundPlaylist);
  }, [playlistId]);

  if (!playlist) return <Error title="Playlist not found!" />;

  const handlePlaySong = (song, index) => {
    dispatch(playPause(true));
    dispatch(setActiveSong({ song, data: { data: playlist.songs }, i: index }));
  };

  const handlePauseSong = () => {
    dispatch(playPause(false));
  };

  return (
    <div className="flex flex-col px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-52 h-52 bg-purple-500 flex items-center justify-center rounded-lg shadow-lg">
          <FaPlay size={50} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">{playlist.name}</h1>
          <p className="text-gray-300 mt-2">A custom playlist</p>
          <p className="text-gray-400 text-sm mt-2">
            {playlist.songs.length} tracks |{" "}
            {formatDuration(
              playlist.songs.reduce(
                (acc, song) => acc + (song.duration || 0),
                0
              )
            )}
          </p>
        </div>
      </div>

      {/* Playlist Controls */}
      <div className="flex items-center gap-4 mt-6">
        <button
          className="text-white bg-purple-500 hover:bg-purple-600 p-3 rounded-full"
          onClick={() =>
            isPlaying ? handlePauseSong() : handlePlaySong(playlist.songs[0], 0)
          }>
          {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
        </button>
        <button className="text-gray-300 hover:text-white p-3 rounded-full">
          <FaShareAlt size={18} />
        </button>
        <button className="text-gray-300 hover:text-white p-3 rounded-full">
          <FaEllipsisH size={18} />
        </button>
      </div>

      {/* Song Table */}
      <SongTable
        tracks={playlist.songs}
        handlePlaySong={handlePlaySong}
        handlePauseSong={handlePauseSong}
        activeSong={activeSong}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default MyPlaylistDetails;

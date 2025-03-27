import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaShareAlt,
  FaEllipsisH,
} from "react-icons/fa";
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import { Loader, Error, SongTable } from "../components";
import { formatDuration } from "./PlaylistDetails";

const MyFavourites = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [favouriteSongs, setFavouriteSongs] = useState([]);

  useEffect(() => {
    const storedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];
    setFavouriteSongs(storedFavourites);
  }, []);

  const handlePlaySong = (song, index) => {
    dispatch(playPause(true));
    dispatch(setActiveSong({ song, data: { data: favouriteSongs }, i: index }));
  };

  const handlePauseSong = () => {
    dispatch(playPause(false));
  };

  if (!favouriteSongs.length)
    return <Error title="No favourite songs found!" />;

  return (
    <div className="flex flex-col px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-52 h-52 bg-purple-500 flex items-center justify-center rounded-lg shadow-lg">
          <FaHeart size={50} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">My Favourites</h1>
          <p className="text-gray-300 mt-2">
            A collection of your favourite songs
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {favouriteSongs.length} tracks |{" "}
            {formatDuration(
              favouriteSongs.reduce(
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
            isPlaying ? handlePauseSong() : handlePlaySong(favouriteSongs[0], 0)
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
        tracks={favouriteSongs}
        handlePlaySong={handlePlaySong}
        handlePauseSong={handlePauseSong}
        activeSong={activeSong}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default MyFavourites;

import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useGetPlaylistDetailsQuery } from "../redux/services/shazamCore";
import { Loader, Error, SongTable } from "../components";
import {
  FaPlay,
  FaHeart,
  FaShareAlt,
  FaEllipsisH,
  FaPause,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { playPause, setActiveSong } from "../redux/features/playerSlice";

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} hrs ${minutes} minutes`;
};

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (let interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data, isFetching, error } = useGetPlaylistDetailsQuery(playlistId);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    if (data) {
      setPlaylist(data);
    }
  }, [data]);

  const handlePlaySong = (song, index) => {
    dispatch(playPause(true));
    dispatch(
      setActiveSong({ song, data: { data: playlist?.tracks?.data }, i: index })
    );
  };

  const handlePauseSong = () => {
    dispatch(playPause(false));
  };

  if (isFetching) return <Loader title="Loading playlist details..." />;
  if (error || !playlist) return <Error />;

  return (
    <div className="flex flex-col px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-6">
        <img
          src={playlist?.picture_big}
          alt={playlist?.title}
          className="w-52 h-52 rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-bold text-white">{playlist?.title}</h1>
          <p className="text-gray-300 mt-2">by {playlist?.creator?.name}</p>
          <p className="text-gray-400 text-sm mt-2">
            {playlist?.nb_tracks} tracks | {formatDuration(playlist?.duration)}{" "}
            | {playlist?.fans.toLocaleString()} fans
          </p>
          <p className="text-gray-400 text-sm">
            Updated: {timeAgo(playlist?.add_date)}
          </p>
        </div>
      </div>

      {/* Playlist Controls */}
      <div className="flex items-center gap-4 mt-6">
        <button
          className="text-white bg-purple-500 hover:bg-purple-600 p-3 rounded-full"
          onClick={() =>
            isPlaying
              ? handlePauseSong()
              : handlePlaySong(playlist?.tracks?.data[0], 0)
          }>
          {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
        </button>

        <button className="text-gray-300 hover:text-white p-3 rounded-full">
          <FaHeart size={18} />
        </button>
        <button className="text-gray-300 hover:text-white p-3 rounded-full">
          <FaShareAlt size={18} />
        </button>
        <button className="text-gray-300 hover:text-white p-3 rounded-full">
          <FaEllipsisH size={18} />
        </button>
      </div>

      {/* Song Table with Infinite Scroll & Sorting */}
      <SongTable
        tracks={playlist?.tracks?.data}
        handlePlaySong={handlePlaySong}
        handlePauseSong={handlePauseSong}
        activeSong={activeSong}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default PlaylistDetails;

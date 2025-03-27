import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaSortUp, FaSortDown, FaSort, FaClock } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import PlayPause from "./PlayPause";

const SongTable = ({
  tracks,
  handlePlaySong,
  handlePauseSong,
  activeSong,
  isPlaying,
}) => {
  const [displayTracks, setDisplayTracks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "" });
  const [visibleCount, setVisibleCount] = useState(20);
  const observerRef = useRef();
  const hasTimeAdd = displayTracks.some((track) => track.time_add);

  useEffect(() => {
    const uniqueTracks = Array.from(
      new Map(tracks.map((track) => [track.title, track])).values()
    );
    setDisplayTracks(uniqueTracks.slice(0, visibleCount));
  }, [tracks, visibleCount]);

  const lastTrackRef = useCallback((node) => {
    if (!node) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 10);
      }
    });
    observerRef.current.observe(node);
  }, []);

  const sortTracks = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }

    const sortedTracks = direction
      ? [...tracks].sort((a, b) => {
          const aValue = key.includes(".")
            ? key.split(".").reduce((o, i) => o[i], a)
            : a[key];
          const bValue = key.includes(".")
            ? key.split(".").reduce((o, i) => o[i], b)
            : b[key];

          if (key === "time_add") {
            return direction === "asc" ? aValue - bValue : bValue - aValue;
          }
          return direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        })
      : tracks.slice(0, visibleCount);

    setSortConfig({ key, direction });
    setDisplayTracks(sortedTracks);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") return <FaSortUp />;
      if (sortConfig.direction === "desc") return <FaSortDown />;
    }
    return <FaSort />;
  };

  return (
    <div className="mt-6 overflow-hidden">
      <div className="grid grid-cols-6 text-gray-400 text-sm pb-2 border-b border-[#3a393d] mb-2">
        <p
          className="col-span-3 cursor-pointer flex items-center gap-2"
          onClick={() => sortTracks("title")}>
          TRACK {getSortIcon("title")}
        </p>
        <p
          className="cursor-pointer flex items-center gap-2"
          onClick={() => sortTracks("artist.name")}>
          ARTIST {getSortIcon("artist.name")}
        </p>
        <p
          className="cursor-pointer flex items-center gap-2"
          onClick={() => sortTracks("album.title")}>
          ALBUM {getSortIcon("album.title")}
        </p>
        <p className="cursor-pointer flex items-center justify-center pr-2 gap-2">
          {hasTimeAdd ? (
            <span
              className="flex items-center gap-2"
              onClick={() => sortTracks("time_add")}>
              ADDED {getSortIcon("time_add")}
            </span>
          ) : (
            <span>
              <FaClock />
            </span>
          )}
        </p>
      </div>

      {displayTracks.map((track, index) => (
        <div
          key={track.id}
          className={`grid grid-cols-6 py-2 text-white rounded-lg px-2 cursor-pointer items-center transition-all duration-300
            ${
              isPlaying && activeSong?.id === track.id
                ? "bg-[#505050] shadow-lg"
                : "hover:bg-[#1b191f]"
            }`}
          ref={index === displayTracks.length - 1 ? lastTrackRef : null}
          onClick={() => handlePlaySong(track, index)}>
          <div className="flex items-center col-span-3">
            <div className="relative mr-3 w-14 h-14 rounded-md flex-shrink-0">
              <LazyLoadImage
                src={track.album.cover_small}
                alt={track.title}
                className="w-14 h-14 rounded-md"
                effect="blur"
              />
              <div
                className={`absolute inset-0 rounded-md flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 
              ${
                activeSong?.id === track.id
                  ? "opacity-100"
                  : "opacity-0 hover:opacity-100"
              }`}>
                <PlayPause
                  isPlaying={isPlaying && activeSong?.id === track.id}
                  activeSong={activeSong}
                  song={track}
                  handlePlay={(e) => {
                    e.stopPropagation();
                    handlePlaySong(track, index);
                  }}
                  handlePause={(e) => {
                    e.stopPropagation();
                    handlePauseSong();
                  }}
                />
              </div>
            </div>
            <Link
              to={`/songs/${track.id}`}
              className="text-gray-300 hover:underline truncate max-w-[70%]">
              {track.title}
            </Link>
          </div>

          <Link
            to={`/artists/${track.artist.id}`}
            className="text-gray-300 hover:underline truncate">
            {track.artist.name}
          </Link>

          <Link
            to={`/albums/${track.album.id}`}
            className="text-gray-300 hover:underline truncate">
            {track.album.title}
          </Link>

          <p className="text-gray-400 truncate text-center">
            {hasTimeAdd
              ? track.time_add
                ? new Date(track.time_add * 1000).toLocaleDateString()
                : "-"
              : `${Math.floor(track.duration / 60)}:${(track.duration % 60)
                  .toString()
                  .padStart(2, "0")}`}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SongTable;

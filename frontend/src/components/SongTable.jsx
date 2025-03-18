import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
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

  useEffect(() => {
    setDisplayTracks(tracks.slice(0, visibleCount));
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
      <div className="grid grid-cols-6 text-gray-400 text-sm pb-2 border-b border-gray-600">
        <p
          className="col-span-3 cursor-pointer flex items-center gap-2"
          onClick={() => sortTracks("title")}
        >
          TRACK {getSortIcon("title")}
        </p>
        <p
          className="cursor-pointer flex items-center gap-2"
          onClick={() => sortTracks("artist.name")}
        >
          ARTIST {getSortIcon("artist.name")}
        </p>
        <p
          className="cursor-pointer flex items-center gap-2"
          onClick={() => sortTracks("album.title")}
        >
          ALBUM {getSortIcon("album.title")}
        </p>
        <p
          className="cursor-pointer flex items-center gap-2"
          onClick={() => sortTracks("time_add")}
        >
          ADDED {getSortIcon("time_add")}
        </p>
      </div>

      {displayTracks.map((track, index) => (
        <div
          key={track.id}
          className="grid grid-cols-6 py-2 text-white hover:bg-gray-800 rounded-lg px-2 cursor-pointer items-center"
          ref={index === displayTracks.length - 1 ? lastTrackRef : null}
        >
          <div className="flex items-center col-span-3">
            <div className="relative mr-3">
              <LazyLoadImage
                src={track.album.cover_small}
                alt={track.title}
                className="w-15 h-15 rounded-md"
                effect="blur"
              />
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 
              ${
                isPlaying && activeSong?.title === track.title
                  ? "opacity-100"
                  : "opacity-0 hover:opacity-100"
              }`}
              >
                <PlayPause
                  isPlaying={isPlaying && activeSong?.title === track.title}
                  activeSong={activeSong}
                  song={track}
                  handlePlay={() => handlePlaySong(track, index)}
                  handlePause={handlePauseSong}
                />
              </div>
            </div>
            <p className="truncate">{track.title}</p>
          </div>

          <Link
            to={`/artists/${track.artist.id}`}
            className="text-gray-300 hover:underline truncate"
          >
            {track.artist.name}
          </Link>

          <Link
            to={`/albums/${track.album.id}`}
            className="text-gray-300 hover:underline truncate"
          >
            {track.album.title}
          </Link>

          <p className="text-gray-400 truncate">
            {new Date(track.time_add * 1000).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SongTable;

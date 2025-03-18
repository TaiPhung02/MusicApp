import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";

const SongTable = ({ tracks }) => {
  const [displayTracks, setDisplayTracks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "" });
  const [visibleCount, setVisibleCount] = useState(10);
  const containerRef = useRef(null);

  useEffect(() => {
    setDisplayTracks(tracks.slice(0, visibleCount));
  }, [tracks, visibleCount]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setVisibleCount((prev) => prev + 10);
    }
  };

  const sortTracks = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "";
    }

    const sortedTracks = [...displayTracks].sort((a, b) => {
      if (!direction) return tracks; // Reset về danh sách ban đầu
      return direction === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    setSortConfig({ key, direction });
    setDisplayTracks(sortedTracks);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  return (
    <div
      className="mt-6 overflow-y-auto h-[500px] scrollbar-hide"
      ref={containerRef}
      onScroll={handleScroll}>
      <div className="grid grid-cols-6 text-gray-400 text-sm pb-2 border-b border-gray-600">
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
        <p
          className="cursor-pointer flex items-center gap-2"
          onClick={() => sortTracks("time_add")}>
          ADDED {getSortIcon("time_add")}
        </p>
      </div>

      {displayTracks.map((track) => (
        <div
          key={track.id}
          className="grid grid-cols-6 py-2 text-white hover:bg-gray-800 rounded-lg px-2 cursor-pointer">
          <div className="flex items-center col-span-3">
            <img
              src={track.album.cover_small}
              alt={track.title}
              className="w-10 h-10 rounded-md mr-3"
            />
            <p>{track.title}</p>
          </div>
          <Link
            to={`/artists/${track.artist.id}`}
            className="text-gray-300 hover:underline">
            {track.artist.name}
          </Link>
          <Link
            to={`/albums/${track.album.id}`}
            className="text-gray-300 hover:underline">
            {track.album.title}
          </Link>
          <p className="text-gray-400">
            {new Date(track.time_add * 1000).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SongTable;

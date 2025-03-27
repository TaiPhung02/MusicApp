import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  MdFavorite,
  MdClose,
  MdPlaylistAdd,
  MdKeyboardArrowDown,
} from "react-icons/md";
import {
  closePlaylistModal,
  removeSongFromQueue,
  playPause,
  setActiveSong,
  addToFavourites,
  removeFromFavourites,
} from "../../redux/features/playerSlice";
import { toast } from "react-toastify";
import PlayPause from "../music/PlayPause";
import { motion, AnimatePresence } from "framer-motion";
import MoreOptionsMenu from "../menus/MoreOptionsMenu";

const PlaylistModal = () => {
  const dispatch = useDispatch();
  const { currentSongs, activeSong, isPlaylistOpen, isPlaying, favourites } =
    useSelector((state) => state.player);

  const [visibleSongs, setVisibleSongs] = useState(10);
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (!node) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisibleSongs((prev) => Math.min(prev + 10, currentSongs.length));
          }
        },
        { root: null, rootMargin: "100px", threshold: 0.1 }
      );

      observerRef.current.observe(node);
    },
    [currentSongs]
  );

  const handleToggleFavourite = (song) => {
    if (!song || !song.id) {
      console.error("Error: song is undefined or missing an ID");
      return;
    }

    const isFavourite = favourites.some((fav) => fav.id === song.id);

    if (isFavourite) {
      dispatch(removeFromFavourites(song.id));
      // toast.info(`Removed from favourites`, { autoClose: 1500 });
    } else {
      dispatch(addToFavourites(song));
      // toast.success(`Added to favourites`, { autoClose: 1500 });
    }
  };

  return (
    <AnimatePresence>
      {isPlaylistOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="fixed inset-0 bg-[#0F0D13] z-9 flex flex-col lg:flex-row">
          <div className="lg:w-1/3 w-full flex flex-col items-center p-6">
            <LazyLoadImage
              src={activeSong?.album?.cover_big}
              alt="Album Cover"
              className="w-64 h-64 lg:w-96 lg:h-96 object-cover rounded-lg shadow-lg"
              effect="blur"
            />
            <h2 className="text-lg text-white font-semibold mt-4">
              <Link to={`/songs/${activeSong?.id}`}>{activeSong?.title}</Link>
            </h2>
            <p className="text-sm text-gray-400">
              <Link
                to={`/artists/${activeSong?.artist?.id}`}
                className="hover:underline">
                {activeSong?.artist?.name}
              </Link>
            </p>
            <div className="flex space-x-6 mt-4">
              <button>
                <MdPlaylistAdd size={24} color="#FFF" />
              </button>

              <button onClick={() => handleToggleFavourite(activeSong)}>
                <MdFavorite
                  size={24}
                  color={
                    favourites.some((fav) => fav.id === activeSong?.id)
                      ? "#ef4444"
                      : "#FFF"
                  }
                />
              </button>

              <MoreOptionsMenu song={activeSong} />
            </div>
          </div>

          <div className="lg:w-2/3 w-full flex flex-col p-6 pb-32 overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-2">
              <div className="text-white text-sm flex items-center justify-center space-x-1">
                <span>Queue</span>
                <span className="text-[#A9A6AA]">
                  • {currentSongs.length} tracks
                </span>
              </div>
              <button
                className="text-white text-2xl"
                onClick={() => dispatch(closePlaylistModal())}>
                <MdKeyboardArrowDown size={28} />
              </button>
            </div>

            <div>
              {currentSongs.slice(0, visibleSongs).map((song, index) => (
                <div
                  key={song.id}
                  className={`flex items-center justify-between p-2 rounded-lg transition duration-300 ${
                    isPlaying && activeSong?.id === song.id
                      ? "bg-[#505050] shadow-lg"
                      : "hover:bg-[#2a2830]"
                  }`}>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-14 h-14 rounded-md">
                      <LazyLoadImage
                        src={song.album.cover_small}
                        alt="cover"
                        className="w-14 h-14 rounded-md object-cover"
                        effect="blur"
                      />
                      <div
                        className={`absolute inset-0 rounded-md flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
                          activeSong?.id === song.id
                            ? "opacity-100"
                            : "opacity-0 hover:opacity-100"
                        }`}>
                        <PlayPause
                          isPlaying={isPlaying && activeSong?.id === song.id}
                          activeSong={activeSong}
                          song={song}
                          handlePlay={() => {
                            dispatch(playPause(true));
                            dispatch(
                              setActiveSong({
                                song,
                                data: { data: currentSongs },
                                i: index,
                              })
                            );
                          }}
                          handlePause={() => dispatch(playPause(false))}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-white">
                        <Link to={`/songs/${song.id}`}>{song.title}</Link>
                      </p>
                      <p className="text-gray-400 text-sm">
                        <Link
                          to={`/artists/${song.artist.id}`}
                          className="hover:underline">
                          {song.artist.name}
                        </Link>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => handleToggleFavourite(song)}>
                      <MdFavorite
                        size={20}
                        color={
                          favourites.some((fav) => fav.id === song.id)
                            ? "#ef4444"
                            : "#FFF"
                        }
                      />
                    </button>

                    <MoreOptionsMenu song={song} />

                    <span className="text-gray-400 text-sm">
                      {Math.floor(song.duration / 60)}:
                      {String(song.duration % 60).padStart(2, "0")}
                    </span>
                    <button
                      onClick={() => dispatch(removeSongFromQueue(song.id))}>
                      <MdClose size={20} color="#FFF" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Observer Target */}
            {visibleSongs < currentSongs.length && (
              <div
                ref={lastElementRef}
                className="text-center text-gray-400 mt-4">
                Loading more songs...
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlaylistModal;

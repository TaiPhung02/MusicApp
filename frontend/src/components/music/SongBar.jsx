import React from "react";
import { Link } from "react-router-dom";
import PlayPause from "./PlayPause";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const SongBar = ({
  songid,
  song,
  i,
  artistId,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick,
}) => {
  return (
    <div
      className={`w-full flex flex-row items-center ${
        isPlaying && activeSong?.id === song.id
          ? "bg-[#505050] shadow-lg"
          : "hover:bg-[#1b191f]"
      } py-2 p-4 rounded-lg cursor-pointer mb-2`}>
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>

      <div className="flex-1 flex flex-row justify-between items-center">
        <LazyLoadImage
          className="w-20 h-20 rounded-lg"
          src={song?.album?.cover_big}
          alt={song?.title}
          effect="blur"
        />

        <div className="flex-1 flex flex-col justify-center mx-3">
          <Link to={`/songs/${song?.id}`}>
            <p className="text-xl font-bold text-white">{song?.title}</p>
          </Link>

          {song?.contributors?.length > 0 && (
            <p className="text-base text-gray-300 mt-1">
              {song.contributors
                .map((contributor, index) => (
                  <Link
                    key={contributor.id}
                    to={`/artists/${contributor.id}`}
                    className="hover:underline text-white">
                    {contributor.name}
                  </Link>
                ))
                .reduce((prev, curr) => [prev, ", ", curr])}
            </p>
          )}
        </div>
      </div>

      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={() => handlePlayClick(song, i)}
      />
    </div>
  );
};

export default SongBar;

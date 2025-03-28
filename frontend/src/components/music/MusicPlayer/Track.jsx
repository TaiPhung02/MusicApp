import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";

const Track = ({ isPlaying, isActive, activeSong }) => (
  <div className="flex-1 flex items-center justify-start">
    <div
      className={`${
        isPlaying && isActive ? "animate-[spin_3s_linear_infinite]" : ""
      } hidden sm:block h-16 w-16 mr-4`}>
      <LazyLoadImage
        src={activeSong?.album?.cover_big}
        alt="cover art"
        className="rounded-full"
        effect="blur"
      />
    </div>
    <div className="w-[50%]">
      <Link to={`/songs/${activeSong?.id}`}>
        <p className="truncate text-white font-bold text-lg">
          {activeSong?.title ? activeSong?.title : "No active Song"}
        </p>
      </Link>
      <Link to={`/artists/${activeSong?.artist?.id}`}>
        <p className="truncate text-gray-300">
          {activeSong?.artist?.name
            ? activeSong?.artist?.name
            : "No active Song"}
        </p>
      </Link>
    </div>
  </div>
);

export default Track;

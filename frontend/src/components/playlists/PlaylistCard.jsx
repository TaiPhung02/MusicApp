import { Link } from "react-router-dom";
import { forwardRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const PlaylistCard = forwardRef(({ playlist }, ref) => {
  return (
    <Link to={`/playlists/${playlist?.id}`} ref={ref}>
      <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
        <div className="relative w-full h-56 group">
          <LazyLoadImage
            src={playlist?.picture_big || playlist?.picture}
            alt="playlist_img"
            effect="blur"
            className="rounded-lg"
          />
        </div>

        <div className="mt-4 flex flex-col">
          <p className="font-semibold text-lg text-white truncate text-center">
            {playlist?.title}
          </p>
          <p className="text-gray-400 text-sm truncate text-center">{playlist?.user?.name}</p>
          <p className="text-gray-400 text-xs truncate text-center">
            {playlist?.nb_tracks} tracks
          </p>
        </div>
      </div>
    </Link>
  );
});

export default PlaylistCard;

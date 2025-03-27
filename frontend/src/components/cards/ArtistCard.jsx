import { Link } from "react-router-dom";
import { forwardRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ArtistCard = forwardRef(({ artist }, ref) => {
  return (
    <Link to={`/artists/${artist?.id}`} ref={ref}>
      <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
        <div className="relative w-full h-56 group">
          <LazyLoadImage
            src={artist?.picture_big}
            alt="artist_img"
            effect="blur"
            className="rounded-full"
          />
        </div>

        <div className="mt-4 flex flex-col">
          <p className="font-semibold text-lg text-white truncate text-center">
            {artist?.name}
          </p>
        </div>
      </div>
    </Link>
  );
});

export default ArtistCard;

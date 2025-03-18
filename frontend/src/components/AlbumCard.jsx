import { Link } from "react-router-dom";
import { forwardRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const AlbumCard = forwardRef(({ album }, ref) => {
  return (
    <Link to={`/artists/${album?.artist?.id}`} ref={ref}>
      <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
        <div className="relative w-full h-56 group">
          <LazyLoadImage
            src={album?.cover_big}
            alt="album_img"
            effect="blur"
            className="rounded-lg"
          />
        </div>

        <div className="mt-4 flex flex-col">
          <p className="font-semibold text-lg text-white truncate">
            {album.title}
          </p>

          <p className="hover:underline text-sm truncate text-gray-300 mt-1">
            {album?.artist?.name}
          </p>
        </div>
      </div>
    </Link>
  );
});

export default AlbumCard;

import { Link } from "react-router-dom";
import { forwardRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const AlbumCard = forwardRef(({ album }, ref) => {
  return (
    <div
      ref={ref}
      className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <Link to={`/albums/${album?.id}`}>
        <div className="relative w-full h-56 group">
          <LazyLoadImage
            src={album?.cover_big}
            alt="album_img"
            effect="blur"
            className="rounded-lg"
          />
        </div>
      </Link>

      <div className="mt-4 flex flex-col">
        <Link to={`/albums/${album?.id}`}>
          <p className="font-semibold text-lg text-white truncate">
            {album.title}
          </p>
        </Link>

        <Link to={`/artists/${album?.artist?.id}`}>
          <p className="text-sm truncate text-gray-300 mt-1 hover:underline">
            {album?.artist?.name}
          </p>
        </Link>
      </div>
    </div>
  );
});

export default AlbumCard;

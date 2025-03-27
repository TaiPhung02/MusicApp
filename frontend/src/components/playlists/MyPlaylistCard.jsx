import { forwardRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";

const MyPlaylistCard = forwardRef(({ playlist }, ref) => {
  const coverImage =
    playlist.songs.length > 0
      ? playlist.songs[0]?.album?.cover_big
      : "https://cdn-images.dzcdn.net/images/playlist/d41d8cd98f00b204e9800998ecf8427e/264x264-000000-80-0-0.jpg";

  return (
    <Link to={`/my-playlist/${playlist.id}`} ref={ref}>
      <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
        <div className="relative w-full h-56 group">
          <LazyLoadImage
            src={coverImage}
            alt="playlist_img"
            effect="blur"
            className="rounded-lg"
          />
        </div>

        <div className="mt-4 flex flex-col">
          <p className="font-semibold text-lg text-white truncate text-center">
            {playlist.name}
          </p>
          <p className="text-gray-400 text-xs truncate text-center">
            {playlist.songs.length} tracks
          </p>
        </div>
      </div>
    </Link>
  );
});

export default MyPlaylistCard;

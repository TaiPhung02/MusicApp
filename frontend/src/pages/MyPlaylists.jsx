import { useRef, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { Error } from "../components";
import MyPlaylistCard from "../components/MyPlaylistCard";

const MyPlaylists = () => {
  const playlists = useSelector((state) => state.player.playlists);
  const [visibleCount, setVisibleCount] = useState(10);

  // Infinite Scroll
  const observerRef = useRef();
  const lastPlaylistRef = useCallback(
    (node) => {
      if (!node || visibleCount >= playlists.length) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisibleCount((prev) => prev + 10);
          }
        },
        { threshold: 1 }
      );

      observerRef.current.observe(node);
    },
    [visibleCount, playlists.length]
  );

  if (!playlists.length) return <Error title="No playlists found!" />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        My Playlists
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {playlists.slice(0, visibleCount).map((playlist, i) => (
          <MyPlaylistCard
            key={playlist.id}
            playlist={playlist}
            ref={i === visibleCount - 1 ? lastPlaylistRef : null}
          />
        ))}
      </div>
    </div>
  );
};

export default MyPlaylists;

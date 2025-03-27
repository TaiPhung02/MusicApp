import { useState, useRef, useCallback, useEffect } from "react";
import { Error, Loader, PlaylistCard } from "../../components";
import { useGetTopPlaylistsQuery } from "../../redux/services/shazamCore";

const TopPlaylists = () => {
  const [page, setPage] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [hasMorePlaylists, setHasMorePlaylists] = useState(true);
  const limit = 20;

  const { data, isFetching, error } = useGetTopPlaylistsQuery(
    { limit, index: page * limit },
    { skip: !hasMorePlaylists }
  );

  useEffect(() => {
    if (data?.data?.length === 0) {
      setHasMorePlaylists(false);
    } else if (data?.data) {
      setPlaylists((prev) => {
        const newPlaylists = data.data.filter(
          (playlist) => !prev.some((prevPlaylist) => prevPlaylist.id === playlist.id)
        );
        return [...prev, ...newPlaylists];
      });
    }
  }, [data]);

  // **Infinite Scroll - Intersection Observer**
  const observerRef = useRef();
  const lastPlaylistRef = useCallback(
    (node) => {
      if (isFetching || !hasMorePlaylists) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 1 }
      );

      if (node) observerRef.current.observe(node);
    },
    [isFetching, hasMorePlaylists]
  );

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Top Playlists
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {playlists.map((playlist, i) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            ref={i === playlists.length - 1 ? lastPlaylistRef : null}
          />
        ))}
      </div>

      {isFetching && <Loader title="Loading more playlists..." />}
    </div>
  );
};

export default TopPlaylists;

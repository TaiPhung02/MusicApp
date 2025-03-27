import { useState, useRef, useCallback, useEffect } from "react";
import { useGetTopAlbumsQuery } from "../../redux/services/shazamCore";
import { Error, Loader, AlbumCard } from "../../components";

const TopAlbums = () => {
  const [page, setPage] = useState(0);
  const [albums, setAlbums] = useState([]);
  const [hasMoreAlbums, setHasMoreAlbums] = useState(true);
  const limit = 20;

  const { data, isFetching, error } = useGetTopAlbumsQuery(
    { limit, index: page * limit },
    { skip: !hasMoreAlbums }
  );

  useEffect(() => {
    if (data?.data?.length === 0) {
      setHasMoreAlbums(false);
    } else if (data?.data) {
      setAlbums((prev) => {
        const newAlbums = data.data.filter(
          (album) => !prev.some((prevAlbum) => prevAlbum.id === album.id)
        );
        return [...prev, ...newAlbums];
      });
    }
  }, [data]);

  // **Infinite Scroll - Intersection Observer**
  const observerRef = useRef();
  const lastAlbumRef = useCallback(
    (node) => {
      if (isFetching || !hasMoreAlbums) return;
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
    [isFetching, hasMoreAlbums]
  );

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Top Albums</h2>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {albums.map((album, i) => (
          <AlbumCard
            key={album.id}
            album={album}
            ref={i === albums.length - 1 ? lastAlbumRef : null}
          />
        ))}
      </div>

      {isFetching && <Loader title="Loading more albums..." />}
    </div>
  );
};

export default TopAlbums;

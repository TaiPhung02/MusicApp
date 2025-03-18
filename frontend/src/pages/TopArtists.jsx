import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useCallback, useEffect } from "react";
import { Error, Loader, ArtistCard } from "../components";
import { useGetTopArtistsQuery } from "../redux/services/shazamCore";

const TopArtists = () => {
  const [page, setPage] = useState(0);
  const [artists, setArtists] = useState([]);
  const [hasMoreArtists, setHasMoreArtists] = useState(true);
  const limit = 20;

  const { data, isFetching, error } = useGetTopArtistsQuery(
    { limit, index: page * limit },
    { skip: !hasMoreArtists }
  );

  useEffect(() => {
    if (data?.data?.length === 0) {
      setHasMoreArtists(false);
    } else if (data?.data) {
      setArtists((prev) => {
        const newArtists = data.data.filter(
          (artist) => !prev.some((prevArtist) => prevArtist.id === artist.id)
        );
        return [...prev, ...newArtists];
      });
    }
  }, [data]);

  // **Infinite Scroll - Intersection Observer**
  const observerRef = useRef();
  const lastArtistRef = useCallback(
    (node) => {
      if (isFetching || !hasMoreArtists) return;
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
    [isFetching, hasMoreArtists]
  );

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Top Artists
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {artists.map((artist, i) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            ref={i === artists.length - 1 ? lastArtistRef : null}
          />
        ))}
      </div>

      {isFetching && <Loader title="Loading more artists..." />}
    </div>
  );
};

export default TopArtists;

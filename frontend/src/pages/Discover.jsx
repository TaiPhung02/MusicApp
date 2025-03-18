import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useCallback, useEffect } from "react";
import { Error, Loader, SongCard } from "../components";
import { useGetTopTracksQuery } from "../redux/services/shazamCore";
import { genres } from "../assets/constants";
import { setActiveSong } from "../redux/features/playerSlice";

const Discover = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const [page, setPage] = useState(0);
  const [songs, setSongs] = useState([]);
  const [hasMoreSongs, setHasMoreSongs] = useState(true);
  const limit = 20;

  const { data, isFetching, error } = useGetTopTracksQuery(
    { limit, index: page * limit },
    { skip: !hasMoreSongs }
  );

  useEffect(() => {
    if (data?.data?.length === 0) {
      setHasMoreSongs(false);
    } else if (data?.data) {
      setSongs((prev) => {
        const newSongs = data.data.filter(
          (song) => !prev.some((prevSong) => prevSong.id === song.id)
        );
        return [...prev, ...newSongs];
      });
    }
  }, [data]);

  // **Infinite Scroll - Intersection Observer**
  const observerRef = useRef();
  const lastSongRef = useCallback(
    (node) => {
      if (isFetching || !hasMoreSongs) return;
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
    [isFetching, hasMoreSongs]
  );

  const handlePlaySong = (song, index) => {
    dispatch(setActiveSong({ song, data: { data: songs }, i: index }));
  };

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Discover</h2>
        {/* <select
          onChange={() => {}}
          className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5">
          {genres?.map((genre) => (
            <option key={genre?.value} value={genre?.value}>
              {genre?.title}
            </option>
          ))}
        </select> */}
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {songs.map((item, i) => (
          <SongCard
            key={item.id}
            song={item}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={songs}
            i={i}
            onPlay={() => handlePlaySong(item, i)}
            ref={i === songs.length - 1 ? lastSongRef : null}
          />
        ))}
      </div>

      {isFetching && <Loader title="Loading more songs..." />}
    </div>
  );
};

export default Discover;

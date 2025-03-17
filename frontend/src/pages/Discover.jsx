import { useDispatch, useSelector } from "react-redux";

import { Error, Loader, SongCard } from "../components";
import { genres } from "../assets/constants";

import { useGetTopTracksQuery } from "../redux/services/shazamCore";
import { useState } from "react";

const Discover = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isFetching, error } = useGetTopTracksQuery({
    limit,
    index: page * limit,
  });

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const genreTitle = "All";
  console.log("data", data);

  if (isFetching) return <Loader title="Loading songs..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">
          Discovery {genreTitle}
        </h2>
        <select
          onChange={() => {}}
          value=""
          className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5">
          {genres?.map((genre) => (
            <option key={genre?.value} value={genre?.value}>
              {genre?.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.data?.map((item, i) => (
          <SongCard
            key={item.id}
            song={item}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
          />
        ))}
      </div>

      <div className="flex justify-center mt-5">
        <button
          onClick={handleNextPage}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg">
          See More
        </button>
      </div>
    </div>
  );
};

export default Discover;

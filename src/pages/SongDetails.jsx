import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs } from "../components";

import { setActiveSong, playPause } from "../redux/features/playerSlice";
import { useGetSongDetailsQuery } from "../redux/services/shazamCore";
import { useGetLyricsQuery } from "../redux/services/shazamCore";

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const {
    data: songData,
    isFetching: isFetchingSongDetails,
    isError: isSongDetailsError,
  } = useGetSongDetailsQuery({ songid });

  const shouldFetchLyrics =
    songData?.song?.title && songData?.song?.artist_names;

  console.log("songData", songData);

  const {
    data: lyricsData,
    isFetching: isFetchingLyrics,
    isError: isLyricsError,
  } = useGetLyricsQuery(
    { artist: songData?.song?.artist_names, title: songData?.song?.title },
    { skip: !shouldFetchLyrics }
  );

  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics:</h2>

        <div className="mt-5">
          {isFetchingSongDetails ? (
            <Loader />
          ) : isSongDetailsError ? (
            <Error message="Không tìm thấy bài hát." />
          ) : isFetchingLyrics ? (
            <Loader />
          ) : isLyricsError ? (
            <Error message="Không tìm thấy lyrics." />
          ) : (
            <pre className="text-white">
              {lyricsData?.lyrics || "Lyrics not available"}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongDetails;

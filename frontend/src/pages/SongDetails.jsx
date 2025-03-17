import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DetailsHeader,
  Error,
  Loader,
  PopularSongs,
  RelatedSongs,
} from "../components";

import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetArtistTopTracksQuery,
  useGetSongDetailsQuery,
} from "../redux/services/shazamCore";
import { useGetLyricsQuery } from "../redux/services/shazamCore";

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const {
    data: songData,
    isFetching: isFetchingSongDetails,
    isError: isSongDetailsError,
  } = useGetSongDetailsQuery(songid);

  const shouldFetchLyrics = songData?.title && songData?.artist?.id;

  const {
    data: artistData,
    isFetching: isFetchingPopularSongs,
    isError: isErrorPopularSongs,
  } = useGetArtistTopTracksQuery(
    { artistId: songData?.artist?.id, limit: 5 },
    { skip: !shouldFetchLyrics }
  );

  const {
    data: lyricsData,
    isFetching: isFetchingLyrics,
    isError: isLyricsError,
  } = useGetLyricsQuery(
    { artist: songData?.artist?.name, title: songData?.title },
    { skip: !shouldFetchLyrics }
  );

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: artistData, i }));
    dispatch(playPause(true));
  };

  if (isFetchingSongDetails || isFetchingPopularSongs || isFetchingLyrics) {
    return <Loader />;
  }

  if (isErrorPopularSongs || isSongDetailsError) {
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <DetailsHeader
        songid={songid}
        artistData={songData?.artist}
        songData={songData}
      />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics:</h2>

        <div className="mt-5">
          {lyricsData?.lyrics ? (
            <pre className="text-gray-400 text-base my-1">
              {lyricsData?.lyrics || "Lyrics not available"}
            </pre>
          ) : (
            <p className="text-gray-400 text-base">Sorry, no lyrics found!</p>
          )}
        </div>
      </div>

      <PopularSongs
        artistData={artistData}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePause={handlePauseClick}
        handlePlay={handlePlayClick}
      />

      {/* <RelatedSongs
        artistData={artistData}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePause={handlePauseClick}
        handlePlay={handlePlayClick}
      /> */}
    </div>
  );
};

export default SongDetails;

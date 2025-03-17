import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaPlay, FaPause } from "react-icons/fa";
import { DetailsHeader, Error, Loader, PopularSongs } from "../components";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetArtistTopTracksQuery,
  useGetSongDetailsQuery,
  useGetAlbumDetailsQuery,
  useGetLyricsQuery,
} from "../redux/services/shazamCore";

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

  const {
    data: albumData,
    isFetching: isFetchingAlbum,
    isError: isAlbumError,
  } = useGetAlbumDetailsQuery(songData?.album?.id, {
    skip: !songData?.album?.id,
  });

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayFromAlbum = (song, i) => {
    dispatch(setActiveSong({ song, data: albumData?.tracks, i }));
    dispatch(playPause(true));
  };

  if (
    isFetchingSongDetails ||
    isFetchingPopularSongs ||
    isFetchingLyrics ||
    isFetchingAlbum
  ) {
    return <Loader />;
  }

  if (isErrorPopularSongs || isSongDetailsError || isAlbumError) {
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <DetailsHeader
        songid={songid}
        artistData={songData?.artist}
        songData={songData}
      />

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="lg:w-1/2">
          <h2 className="text-white text-3xl font-bold">Lyrics:</h2>
          <div className="mt-5 bg-gray-800 p-4 rounded-lg">
            {lyricsData?.lyrics ? (
              <pre className="text-gray-400 text-base my-1 whitespace-pre-wrap break-words min-h-[100px]">
                {lyricsData?.lyrics || "Lyrics not available"}
              </pre>
            ) : (
              <p className="text-gray-400 text-base">Sorry, no lyrics found!</p>
            )}
          </div>
        </div>

        {albumData && (
          <div className="lg:w-1/2 bg-gray-900 p-5 rounded-lg shadow-lg">
            <h2 className="text-white text-2xl font-bold mb-2">
              Album: {albumData?.title}
            </h2>
            <p className="text-gray-400 text-lg mb-4">
              Artist: {albumData?.artist?.name}
            </p>
            <img
              src={albumData?.cover_big}
              alt={albumData?.title}
              className="w-full rounded-lg mb-4"
            />

            <div>
              <h3 className="text-white text-xl font-semibold mb-2">Tracks:</h3>
              <div className="grid grid-cols-1 gap-4">
                {albumData?.tracks?.data.map((track, i) => {
                  const isCurrentSong = activeSong?.id === track.id;
                  const durationMinutes = Math.floor(track.duration / 60);
                  const durationSeconds = track.duration % 60;

                  return (
                    <div
                      key={track.id}
                      className="bg-gray-800 p-3 rounded-lg flex items-center gap-3 relative group"
                    >
                      <div className="relative w-16 h-16">
                        <img
                          src={albumData?.cover_small}
                          alt={track.title}
                          className="w-full h-full rounded-lg"
                        />
                        <button
                          onClick={() =>
                            isCurrentSong && isPlaying
                              ? handlePauseClick()
                              : handlePlayFromAlbum(track, i)
                          }
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          {isCurrentSong && isPlaying ? (
                            <FaPause size={20} className="text-white" />
                          ) : (
                            <FaPlay size={20} className="text-white" />
                          )}
                        </button>
                      </div>

                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">
                          {track.title}
                        </p>
                        <p className="text-gray-400 text-xs">{`${durationMinutes}:${durationSeconds
                          .toString()
                          .padStart(2, "0")}`}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <PopularSongs
        songid={songid}
        artistData={artistData}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePause={handlePauseClick}
        handlePlay={handlePlayFromAlbum}
      />
    </div>
  );
};

export default SongDetails;

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
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

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

  const uniqueTracks = Array.from(
    new Map(albumData?.tracks?.data.map((track) => [track.title, track])).values()
  );
  
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayFromAlbum = (song, i) => {
    dispatch(setActiveSong({ song, data: albumData?.tracks, i }));
    dispatch(playPause(true));
  };

  const handlePlayFromArtist = (song, i) => {
    dispatch(setActiveSong({ song, data: artistData, i }));
    dispatch(playPause(true));
  };

  if (
    isFetchingSongDetails ||
    isFetchingPopularSongs ||
    isFetchingAlbum
  ) {
    return <Loader />;
  }

  if (isErrorPopularSongs || isSongDetailsError || isAlbumError) {
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <DetailsHeader artistData={songData?.artist} songData={songData} />

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
            <p className="text-base text-gray-300 mb-4">
              Artist: {albumData?.artist?.name}
            </p>
            <LazyLoadImage
              src={albumData?.cover_big}
              alt={albumData?.title}
              className="w-full rounded-lg mb-4"
              effect="blur"
            />

            <div>
              <h3 className="text-white text-xl font-semibold mb-2">Tracks:</h3>
              <div className="grid grid-cols-1 gap-4">
                {uniqueTracks.map((track, i) => {
                  const isCurrentSong = activeSong?.id === track.id;
                  const durationMinutes = Math.floor(track.duration / 60);
                  const durationSeconds = track.duration % 60;

                  return (
                    <div
                      key={track.id}
                      className="bg-gray-800 p-3 rounded-md flex items-center gap-3 relative group">
                      <div className="relative w-14 h-14">
                        <LazyLoadImage
                          src={albumData?.cover_small}
                          alt={track.title}
                          className="w-full h-full rounded-md"
                          effect="blur"
                        />
                        <button
                          onClick={() =>
                            isCurrentSong && isPlaying
                              ? handlePauseClick()
                              : handlePlayFromAlbum(track, i)
                          }
                          className="absolute inset-0 rounded-md flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {isCurrentSong && isPlaying ? (
                            <FaPause size={20} className="text-white" />
                          ) : (
                            <FaPlay size={20} className="text-white" />
                          )}
                        </button>
                      </div>

                      <div className="flex-1">
                        <p className="text-xl font-bold text-white">
                          {track.title}
                        </p>
                        <p className="text-base text-gray-300 mt-1">{`${durationMinutes}:${durationSeconds
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
        handlePlay={handlePlayFromArtist}
      />
    </div>
  );
};

export default SongDetails;

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, PopularSongs } from "../components";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetArtistTopTracksQuery,
  useGetSongDetailsQuery,
  useGetAlbumDetailsQuery,
} from "../redux/services/shazamCore";
import { useGetLyricsQuery } from "../redux/services/shazamCore";

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  // Fetch chi tiết bài hát
  const {
    data: songData,
    isFetching: isFetchingSongDetails,
    isError: isSongDetailsError,
  } = useGetSongDetailsQuery(songid);

  // Kiểm tra điều kiện để fetch lyrics
  const shouldFetchLyrics = songData?.title && songData?.artist?.id;

  // Fetch danh sách bài hát phổ biến của nghệ sĩ
  const {
    data: artistData,
    isFetching: isFetchingPopularSongs,
    isError: isErrorPopularSongs,
  } = useGetArtistTopTracksQuery(
    { artistId: songData?.artist?.id, limit: 5 },
    { skip: !shouldFetchLyrics }
  );

  // Fetch lyrics bài hát
  const {
    data: lyricsData,
    isFetching: isFetchingLyrics,
    isError: isLyricsError,
  } = useGetLyricsQuery(
    { artist: songData?.artist?.name, title: songData?.title },
    { skip: !shouldFetchLyrics }
  );

  // Fetch thông tin album của bài hát
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

  // Phát bài hát từ danh sách Popular Songs
  const handlePlayFromPopular = (song, i) => {
    dispatch(setActiveSong({ song, data: artistData, i }));
    dispatch(playPause(true));
  };

  // Phát bài hát từ album
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
      {/* Header */}
      <DetailsHeader
        songid={songid}
        artistData={songData?.artist}
        songData={songData}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lyrics bên trái */}
        <div className="lg:w-1/2">
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

        {/* Album bên phải */}
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

            {/* Danh sách bài hát trong album */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-2">Tracks:</h3>
              {albumData?.tracks?.data.map((track, i) => (
                <div
                  key={track.id}
                  className="flex justify-between items-center text-gray-300 hover:bg-gray-800 p-2 rounded-lg cursor-pointer"
                  onClick={() => handlePlayFromAlbum(track, i)}>
                  <p>{track.title}</p>
                  <p className="text-sm">{track.duration}s</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Danh sách bài hát phổ biến (giữ nguyên) */}
      <PopularSongs
        songid={songid}
        artistData={artistData}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePause={handlePauseClick}
        handlePlay={handlePlayFromPopular}
      />
    </div>
  );
};

export default SongDetails;

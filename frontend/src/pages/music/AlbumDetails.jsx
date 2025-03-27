import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playPause, setActiveSong } from "../../redux/features/playerSlice";
import { useGetAlbumDetailsQuery } from "../../redux/services/shazamCore";
import { Loader, Error, SongTable } from "../../components";
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaShareAlt,
  FaEllipsisH,
} from "react-icons/fa";
import { formatTotalDuration } from "../../utils/formatTotalDuration";
import { formatDate } from "../../utils/formatDate";

const AlbumDetails = () => {
  const { albumId } = useParams();
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data, isFetching, error } = useGetAlbumDetailsQuery(albumId);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    if (data) {
      setAlbum(data);
    }
  }, [data]);

  const handlePlaySong = (song, index) => {
    dispatch(playPause(true));
    dispatch(
      setActiveSong({ song, data: { data: album?.tracks?.data }, i: index })
    );
  };

  const handlePauseSong = () => {
    dispatch(playPause(false));
  };

  if (isFetching) return <Loader title="Loading album details..." />;
  if (error || !album) return <Error />;

  return (
    <div className="flex flex-col px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-6">
        <img
          src={album?.cover_big}
          alt={album?.title}
          className="w-52 h-52 rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-bold text-white">{album?.title}</h1>
          <p className="text-gray-300 mt-2">by {album?.artist?.name}</p>
          <p className="text-gray-400 text-sm mt-2">
            {album?.nb_tracks} tracks |{" "}
            {formatTotalDuration(album?.tracks?.data)} |{" "}
            {formatDate(album?.release_date)}
          </p>
        </div>
      </div>

      {/* Album Controls */}
      <div className="flex items-center gap-4 mt-6">
        <button
          className="text-white bg-purple-500 hover:bg-purple-600 p-3 rounded-full"
          onClick={() =>
            isPlaying
              ? handlePauseSong()
              : handlePlaySong(album?.tracks?.data[0], 0)
          }>
          {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
        </button>

        <button className="text-gray-300 hover:text-white p-3 rounded-full">
          <FaHeart size={18} />
        </button>
        <button className="text-gray-300 hover:text-white p-3 rounded-full">
          <FaShareAlt size={18} />
        </button>
        <button className="text-gray-300 hover:text-white p-3 rounded-full">
          <FaEllipsisH size={18} />
        </button>
      </div>

      {/* Song Table */}
      <SongTable
        tracks={album?.tracks?.data}
        handlePlaySong={handlePlaySong}
        handlePauseSong={handlePauseSong}
        activeSong={activeSong}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default AlbumDetails;

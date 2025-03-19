import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  useSearchTracksQuery,
  useSearchArtistsQuery,
  useSearchAlbumsQuery,
  useSearchPlaylistsQuery,
} from "../redux/services/shazamCore";
import Loader from "../components/Loader";
import Error from "../components/Error";
import SongTable from "../components/SongTable";
import { useDispatch, useSelector } from "react-redux";
import { playPause, setActiveSong } from "../redux/features/playerSlice";

const TABS = ["Tracks", "Artists", "Albums", "Playlists"];

const SearchResults = () => {
  const { query } = useParams();
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [activeTab, setActiveTab] = useState("Tracks");

  const {
    data: tracksData,
    isLoading: tracksLoading,
    error: tracksError,
  } = useSearchTracksQuery({ query });
  const {
    data: artistsData,
    isLoading: artistsLoading,
    error: artistsError,
  } = useSearchArtistsQuery({ query });
  const {
    data: albumsData,
    isLoading: albumsLoading,
    error: albumsError,
  } = useSearchAlbumsQuery({ query });
  const {
    data: playlistsData,
    isLoading: playlistsLoading,
    error: playlistsError,
  } = useSearchPlaylistsQuery({ query });

  if (tracksLoading || artistsLoading || albumsLoading || playlistsLoading)
    return <Loader title="Loading search results..." />;
  if (tracksError || artistsError || albumsError || playlistsError)
    return <Error message="Failed to fetch data." />;

  const tracks = tracksData?.data || [];
  const artists = artistsData?.data || [];
  const albums = albumsData?.data || [];
  const playlists = playlistsData?.data || [];

  const handlePlaySong = (song, index) => {
    dispatch(playPause(true));
    dispatch(setActiveSong({ song, data: { data: tracks }, i: index }));
  };

  const handlePauseSong = () => {
    dispatch(playPause(false));
  };

  return (
    <div className="px-6 py-4 text-white">
      <h2 className="text-2xl font-semibold mb-4">
        Search results for "{query}"
      </h2>

      {/* Tabs */}
      <div className="flex gap-6 mb-4 border-b border-[#1b191f]">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`py-2 text-lg ${
              activeTab === tab
                ? "border-b-2 border-purple-500 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Display results based on active tab */}
      <div>
        {activeTab === "Tracks" && (
          <SongTable
            tracks={tracks}
            handlePlaySong={handlePlaySong}
            handlePauseSong={handlePauseSong}
            activeSong={activeSong}
            isPlaying={isPlaying}
          />
        )}

        {activeTab === "Artists" && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            {artists.map((artist) => (
              <Link
                to={`/artists/${artist?.id}`}
                key={artist?.id}
                className="relative text-center p-3 rounded-lg transition-all duration-300 hover:bg-[#1b191f] hover:scale-105">
                <div className="w-full aspect-square">
                  <img
                    src={artist?.picture_big}
                    alt={artist?.name}
                    className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-white font-semibold mt-3">
                  {artist?.name}
                </h3>
                <p className="text-gray-400 text-sm">{artist?.nb_fan} fans</p>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "Albums" && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            {albums.map((album) => (
              <Link
                to={`/albums/${album?.id}`}
                key={album?.id}
                className="relative text-center p-3 rounded-lg transition-all duration-300 hover:bg-[#1b191f] hover:scale-105">
                <div className="w-full aspect-square">
                  <img
                    src={album?.cover_medium}
                    alt={album?.title}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-white font-semibold mt-3 truncate">
                  {album?.title}
                </h3>
                <Link
                  to={`/artists/${album?.artist?.id}`}
                  className="text-gray-400 text-sm cursor-pointer hover:underline"
                  onClick={(e) => e.stopPropagation()}>
                  {album?.artist?.name}
                </Link>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "Playlists" && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            {playlists.map((playlist) => (
              <Link
                to={`/playlists/${playlist?.id}`}
                key={playlist?.id}
                className="relative text-center p-3 rounded-lg transition-colors duration-300 hover:bg-[#1b191f]">
                <div className="w-full aspect-square">
                  <img
                    src={playlist?.picture_medium}
                    alt={playlist?.title}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-white font-semibold mt-3">
                  {playlist?.title}
                </h3>
                <p className="text-gray-400 text-sm">{playlist?.user?.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

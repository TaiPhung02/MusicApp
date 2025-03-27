import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  useSearchTracksQuery,
  useSearchArtistsQuery,
  useSearchAlbumsQuery,
  useSearchPlaylistsQuery,
} from "../../redux/services/shazamCore";
import Loader from "../../components/common/Loader";
import Error from "../../components/common/Error";
import SongTable from "../../components/music/SongTable";
import { useDispatch, useSelector } from "react-redux";
import { playPause, setActiveSong } from "../../redux/features/playerSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const TABS = ["Tracks", "Artists", "Albums", "Playlists"];
const LIMIT = 20;

const SearchResults = () => {
  const { query } = useParams();
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [activeTab, setActiveTab] = useState("Tracks");
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [artistIndex, setArtistIndex] = useState(0);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const { ref: artistRef, inView: artistInView } = useInView();
  const { ref: albumRef, inView: albumInView } = useInView();
  const { ref: playlistRef, inView: playlistInView } = useInView();

  useEffect(() => {
    setActiveTab("Tracks");
    setArtists([]);
    setAlbums([]);
    setPlaylists([]);
    setArtistIndex(0);
    setAlbumIndex(0);
    setPlaylistIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query]);

  const {
    data: tracksData,
    isLoading: tracksLoading,
    error: tracksError,
  } = useSearchTracksQuery({ query });

  const {
    data: artistsData,
    isLoading: artistsLoading,
    error: artistsError,
  } = useSearchArtistsQuery({ query, limit: LIMIT, index: artistIndex });

  const {
    data: albumsData,
    isLoading: albumsLoading,
    error: albumsError,
  } = useSearchAlbumsQuery({ query, limit: LIMIT, index: albumIndex });

  const {
    data: playlistsData,
    isLoading: playlistsLoading,
    error: playlistsError,
  } = useSearchPlaylistsQuery({ query, limit: LIMIT, index: playlistIndex });

  useEffect(() => {
    if (artistInView && artistsData?.data?.length) {
      setArtists((prev) => [...prev, ...artistsData.data]);
      setArtistIndex((prev) => prev + LIMIT);
    }
  }, [artistInView, artistsData]);

  useEffect(() => {
    if (albumInView && albumsData?.data?.length) {
      setAlbums((prev) => [...prev, ...albumsData.data]);
      setAlbumIndex((prev) => prev + LIMIT);
    }
  }, [albumInView, albumsData]);

  useEffect(() => {
    if (playlistInView && playlistsData?.data?.length) {
      setPlaylists((prev) => [...prev, ...playlistsData.data]);
      setPlaylistIndex((prev) => prev + LIMIT);
    }
  }, [playlistInView, playlistsData]);

  if (tracksLoading || artistsLoading || albumsLoading || playlistsLoading)
    return <Loader title="Loading search results..." />;
  if (tracksError || artistsError || albumsError || playlistsError)
    return <Error message="Failed to fetch data." />;

  const tracks = tracksData?.data || [];
  const uniqueTracks = Array.from(
    new Map(tracks.map((track) => [track.title, track])).values()
  );

  const noResults =
    uniqueTracks.length === 0 &&
    artists.length === 0 &&
    albums.length === 0 &&
    playlists.length === 0;

  if (noResults) {
    return (
      <div className="px-6 py-4 text-white">
        <h2 className="text-2xl font-semibold mb-4">
          No results for "{query}"
        </h2>
      </div>
    );
  }

  const handlePlaySong = (song, index) => {
    dispatch(playPause(true));
    dispatch(setActiveSong({ song, data: { data: uniqueTracks }, i: index }));
  };

  const handlePauseSong = () => {
    dispatch(playPause(false));
  };

  return (
    <div className="px-0 sm:px-6 py-4 text-white">
      <h2 className="text-2xl font-semibold mb-4">
        Search results for "{query}"
      </h2>
      <div className="flex gap-6 mb-4 border-b border-[#1b191f]">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`py-2 text-lg border-b-2 border-transparent hover:border-[#a9a6aa] ${
              activeTab === tab
                ? "border-b-2 border-purple-500 hover:border-purple-500 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>
      <div>
        {activeTab === "Tracks" && (
          <SongTable
            tracks={uniqueTracks}
            handlePlaySong={handlePlaySong}
            handlePauseSong={handlePauseSong}
            activeSong={activeSong}
            isPlaying={isPlaying}
          />
        )}
        {activeTab === "Artists" && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            {artists.map((artist, index) => (
              <Link
                to={`/artists/${artist?.id}`}
                key={artist?.id}
                className="relative text-center p-3 rounded-lg transition-all duration-300 hover:bg-[#1b191f] hover:scale-105">
                <div className="w-full aspect-square">
                  <LazyLoadImage
                    src={artist?.picture_big}
                    alt={artist?.name}
                    effect="blur"
                    className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-white font-semibold mt-3 truncate">
                  {artist?.name}
                </h3>
                <p className="text-gray-400 text-sm">{artist?.nb_fan} fans</p>
              </Link>
            ))}
            <div ref={artistRef} />
          </div>
        )}

        {activeTab === "Albums" && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            {albums.map((album, index) => (
              <Link
                to={`/albums/${album?.id}`}
                key={album?.id}
                className="relative text-center p-3 rounded-lg transition-all duration-300 hover:bg-[#1b191f] hover:scale-105">
                <div className="w-full aspect-square">
                  <LazyLoadImage
                    src={album?.cover_medium}
                    alt={album?.title}
                    effect="blur"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-white font-semibold mt-3 truncate">
                  {album.title}
                </h3>
                <Link
                  to={`/artists/${album?.artist?.id}`}
                  className="text-gray-400 text-sm cursor-pointer hover:underline"
                  onClick={(e) => e.stopPropagation()}>
                  {album?.artist?.name}
                </Link>
              </Link>
            ))}
            <div ref={albumRef} />
          </div>
        )}

        {activeTab === "Playlists" && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            {playlists.map((playlist, index) => (
              <Link
                to={`/playlists/${playlist?.id}`}
                key={playlist?.id}
                className="relative text-center p-3 rounded-lg transition-colors duration-300 hover:bg-[#1b191f]">
                <div className="w-full aspect-square">
                  <LazyLoadImage
                    src={playlist?.picture_medium}
                    alt={playlist?.title}
                    effect="blur"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-white font-semibold mt-3">
                  {playlist?.title}
                </h3>
                <p className="text-gray-400 text-sm">{playlist?.user?.name}</p>
              </Link>
            ))}
            <div ref={playlistRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Searchbar,
  Sidebar,
  MusicPlayer,
  TopPlay,
  Header,
  PlaylistModal,
} from "./components";
import {
  ArtistDetails,
  TopArtists,
  TopAlbums,
  Discover,
  SearchResults,
  SongDetails,
  TopPlaylists,
  PlaylistDetails,
  AlbumDetails,
  MyFavourites,
  MyPlaylists,
  MyPlaylistDetails,
} from "./pages";

const App = () => {
  const { activeSong } = useSelector((state) => state.player);

  return (
    <div className="relative flex">
      <ToastContainer />
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#0F0D13]">
        <Header />

        <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex flex-col xl:flex-row border-y border-solid border-[#555257]">
          <div className="flex-1 h-fit pb-40">
            <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/top-albums" element={<TopAlbums />} />
              <Route path="/top-artists" element={<TopArtists />} />
              <Route path="/top-playlists" element={<TopPlaylists />} />
              <Route path="/artists/:artistId" element={<ArtistDetails />} />
              <Route path="/songs/:songid" element={<SongDetails />} />
              <Route path="/search/:query" element={<SearchResults />} />
              <Route
                path="/playlists/:playlistId"
                element={<PlaylistDetails />}
              />
              <Route path="/albums/:albumId" element={<AlbumDetails />} />
              <Route path="/my-favourites" element={<MyFavourites />} />
              <Route path="/my-playlist" element={<MyPlaylists />} />
              <Route
                path="/my-playlist/:playlistId"
                element={<MyPlaylistDetails />}
              />
            </Routes>
          </div>

          <div className="hidden xl:block xl:w-[350px] xl:sticky relative top-0 h-fit">
            <TopPlay />
          </div>
        </div>
      </div>

      {activeSong?.id && (
        <div
          className="absolute h-20 bottom-0 left-0 right-0 flex animate-slideup bg-[#1b191f] border-t border-solid border-[#555257] z-10"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <MusicPlayer />
        </div>
      )}

      <PlaylistModal />
    </div>
  );
};

export default App;

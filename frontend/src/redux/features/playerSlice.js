import { createSlice } from "@reduxjs/toolkit";

const loadPlaylists = () => {
  const savedPlaylists = localStorage.getItem("playlists");
  return savedPlaylists ? JSON.parse(savedPlaylists) : [];
};

const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {},
  genreListId: "",
  youtubeUrl: null,
  isPlaylistOpen: false,
  isShuffle: false,
  playlists: loadPlaylists(),
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setActiveSong: (state, action) => {
      const { song, data, i } = action.payload;
      state.activeSong = song;
      state.currentIndex = i;
      state.isActive = true;
      state.currentSongs = data?.tracks?.data || data?.data || [];
    },

    nextSong: (state) => {
      if (state.isShuffle) {
        state.currentIndex = Math.floor(
          Math.random() * state.currentSongs.length
        );
      } else {
        state.currentIndex =
          (state.currentIndex + 1) % state.currentSongs.length;
      }
      state.activeSong = state.currentSongs[state.currentIndex];
      state.isActive = true;
    },

    prevSong: (state) => {
      if (state.isShuffle) {
        state.currentIndex = Math.floor(
          Math.random() * state.currentSongs.length
        );
      } else {
        state.currentIndex =
          (state.currentIndex - 1 + state.currentSongs.length) %
          state.currentSongs.length;
      }
      state.activeSong = state.currentSongs[state.currentIndex];
      state.isActive = true;
    },

    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },

    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },

    selectGenreListId: (state, action) => {
      state.genreListId = action.payload;
    },

    setYoutubeUrl: (state, action) => {
      state.youtubeUrl = action.payload;
    },

    openPlaylistModal: (state) => {
      state.isPlaylistOpen = true;
    },

    closePlaylistModal: (state) => {
      state.isPlaylistOpen = false;
    },

    addNextSongToQueue: (state, action) => {
      const { song } = action.payload;
      if (!song || !song.id) return;

      const currentIndex = state.currentIndex;
      if (currentIndex < state.currentSongs.length - 1) {
        state.currentSongs.splice(currentIndex + 1, 0, song);
      } else {
        state.currentSongs.push(song);
      }
    },

    removeSongFromQueue: (state, action) => {
      state.currentSongs = state.currentSongs.filter(
        (song) => song.id !== action.payload
      );
    },

    createPlaylist: (state, action) => {
      const newPlaylist = {
        id: Date.now().toString(),
        name: action.payload,
        songs: [],
      };
      state.playlists.push(newPlaylist);
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },

    addSongToPlaylist: (state, action) => {
      const { playlistId, song } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.songs.some((s) => s.id === song.id)) {
        playlist.songs.push(song);
        localStorage.setItem("playlists", JSON.stringify(state.playlists));
      }
    },

    removeSongFromPlaylist: (state, action) => {
      const { playlistId, songId } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist) {
        playlist.songs = playlist.songs.filter((s) => s.id !== songId);
        localStorage.setItem("playlists", JSON.stringify(state.playlists));
      }
    },

    deletePlaylist: (state, action) => {
      state.playlists = state.playlists.filter(
        (playlist) => playlist.id !== action.payload
      );
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
  },
});

export const {
  setActiveSong,
  nextSong,
  prevSong,
  toggleShuffle,
  playPause,
  selectGenreListId,
  setYoutubeUrl,
  openPlaylistModal,
  closePlaylistModal,
  addNextSongToQueue,
  removeSongFromQueue,
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} = playerSlice.actions;

export default playerSlice.reducer;

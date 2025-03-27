import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = (key, defaultValue = []) => {
  const savedData = localStorage.getItem(key);
  return savedData ? JSON.parse(savedData) : defaultValue;
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
  playlists: loadFromLocalStorage("playlists"),
  favourites: loadFromLocalStorage("favourites"),
};

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
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
      saveToLocalStorage("playlists", state.playlists);
    },

    addSongToPlaylist: (state, action) => {
      const { playlistId, song } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.songs.some((s) => s.id === song.id)) {
        playlist.songs.push(song);
        saveToLocalStorage("playlists", state.playlists);
      }
    },

    removeSongFromPlaylist: (state, action) => {
      const { playlistId, songId } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist) {
        playlist.songs = playlist.songs.filter((s) => s.id !== songId);
        saveToLocalStorage("playlists", state.playlists);
      }
    },

    deletePlaylist: (state, action) => {
      state.playlists = state.playlists.filter(
        (playlist) => playlist.id !== action.payload
      );
      saveToLocalStorage("playlists", state.playlists);
    },

    addToFavourites: (state, action) => {
      const song = action.payload;
      if (!song || !song.id) return;

      if (!state.favourites.some((s) => s.id === song.id)) {
        state.favourites.push(song);
        saveToLocalStorage("favourites", state.favourites);
      }
    },

    removeFromFavourites: (state, action) => {
      const songId = action.payload;
      state.favourites = state.favourites.filter((s) => s.id !== songId);
      saveToLocalStorage("favourites", state.favourites);
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
  addToFavourites,
  removeFromFavourites,
} = playerSlice.actions;

export default playerSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

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

      if (data?.tracks?.data) {
        // if data from album
        state.currentSongs = data.tracks.data;
      } else if (data?.data) {
        // if data from top song
        state.currentSongs = data.data;
      } else if (state.currentSongs.length === 0) {
        state.currentSongs = [];
      }
    },

    nextSong: (state) => {
      if (state.isShuffle) {
        const randomIndex = Math.floor(
          Math.random() * state.currentSongs.length
        );
        state.currentIndex = randomIndex;
      } else {
        if (state.currentIndex < state.currentSongs.length - 1) {
          state.currentIndex += 1;
        } else {
          state.currentIndex = 0;
        }
      }
      state.activeSong = state.currentSongs[state.currentIndex];
      state.isActive = true;
    },

    prevSong: (state) => {
      if (state.isShuffle) {
        const randomIndex = Math.floor(
          Math.random() * state.currentSongs.length
        );
        state.currentIndex = randomIndex;
      } else {
        if (state.currentIndex > 0) {
          state.currentIndex -= 1;
        } else {
          state.currentIndex = state.currentSongs.length - 1;
        }
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

      const isAlreadyInQueue = state.currentSongs.some(
        (track) => track.id === song.id
      );

      if (!isAlreadyInQueue) {
        if (currentIndex < state.currentSongs.length - 1) {
          state.currentSongs.splice(currentIndex + 1, 0, song);
        } else {
          state.currentSongs.push(song);
        }
      }
    },

    removeSongFromQueue: (state, action) => {
      state.currentSongs = state.currentSongs.filter(
        (song) => song.id !== action.payload
      );
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
} = playerSlice.actions;

export default playerSlice.reducer;

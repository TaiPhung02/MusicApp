import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {},
  genreListId: "",
  youtubeUrl: null,
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
      if (state.currentIndex < state.currentSongs.length - 1) {
        state.currentIndex += 1;
        state.activeSong = state.currentSongs[state.currentIndex];
        state.isActive = true;
      }
    },

    prevSong: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.activeSong = state.currentSongs[state.currentIndex];
        state.isActive = true;
      }
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
  },
});

export const {
  setActiveSong,
  nextSong,
  prevSong,
  playPause,
  selectGenreListId,
  setYoutubeUrl,
} = playerSlice.actions;

export default playerSlice.reducer;

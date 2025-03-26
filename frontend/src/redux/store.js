import { configureStore } from "@reduxjs/toolkit";

import playerReducer from "./features/playerSlice";
import { deezerApi, youtubeApi, lyricsApi } from "./services/shazamCore";

export const store = configureStore({
  reducer: {
    [deezerApi.reducerPath]: deezerApi.reducer,
    [youtubeApi.reducerPath]: youtubeApi.reducer,
    [lyricsApi.reducerPath]: lyricsApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      deezerApi.middleware,
      youtubeApi.middleware,
      lyricsApi.middleware
    ),
});

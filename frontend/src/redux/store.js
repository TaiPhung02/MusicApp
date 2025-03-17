import { configureStore } from "@reduxjs/toolkit";

import playerReducer from "./features/playerSlice";
import { deezerApi } from "./services/shazamCore";
import { lyricsApi } from "./services/shazamCore";

export const store = configureStore({
  reducer: {
    [deezerApi.reducerPath]: deezerApi.reducer,
    [lyricsApi.reducerPath]: lyricsApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(deezerApi.middleware, lyricsApi.middleware),
});

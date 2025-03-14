import { configureStore } from "@reduxjs/toolkit";

import playerReducer from "./features/playerSlice";
import { geniusApi } from "./services/shazamCore";
import { lyricsApi } from "./services/shazamCore";

export const store = configureStore({
  reducer: {
    [geniusApi.reducerPath]: geniusApi.reducer,
    [lyricsApi.reducerPath]: lyricsApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(geniusApi.middleware, lyricsApi.middleware),
});

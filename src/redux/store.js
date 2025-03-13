import { configureStore } from "@reduxjs/toolkit";

import playerReducer from "./features/playerSlice";
import { geniusApi } from "./services/shazamCore";

export const store = configureStore({
  reducer: {
    [geniusApi.reducerPath]: geniusApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(geniusApi.middleware),
});

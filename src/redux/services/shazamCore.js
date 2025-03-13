import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const geniusApi = createApi({
  reducerPath: "geniusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://genius-song-lyrics1.p.rapidapi.com",
    prepareHeaders: (headers) => {
      headers.set(
        "x-rapidapi-key",
        "c0c474ebcdmshcba6d2483157c33p16cbc5jsnfa8be4dea1c8"
      );
      headers.set("x-rapidapi-host", "genius-song-lyrics1.p.rapidapi.com");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getChartsSong: builder.query({
      query: ({ timePeriod = "day", genre = "all", perPage = 10, page = 1 }) =>
        `/chart/songs/?time_period=${timePeriod}&chart_genre=${genre}&per_page=${perPage}&page=${page}`,
    }),
  }),
});

export const { useGetChartsSongQuery } = geniusApi;

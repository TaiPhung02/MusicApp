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

    getSongDetails: builder.query({
      query: ({ songid }) => `/song/details/?id=${songid}`,
    }),
  }),
});

export const { useGetChartsSongQuery, useGetSongDetailsQuery } = geniusApi;

export const lyricsApi = createApi({
  reducerPath: "lyricsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.lyrics.ovh/v1",
  }),
  endpoints: (builder) => ({
    getLyrics: builder.query({
      query: ({ artist, title }) => `/${artist}/${title}`,
    }),
  }),
});

export const { useGetLyricsQuery } = lyricsApi;


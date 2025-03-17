import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const deezerApi = createApi({
  reducerPath: "deezerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/deezer",
  }),
  endpoints: (builder) => ({
    getTopTracks: builder.query({
      query: ({ limit = 20, index = 0 }) =>
        `/chart?limit=${limit}&index=${index}`,
    }),

    getSongDetails: builder.query({
      query: (trackId) => `/track/${trackId}`,
    }),

    getArtistDetails: builder.query({
      query: (artistId) => `/artist/${artistId}`,
    }),

    getArtistTopTracks: builder.query({
      query: ({ artistId, limit = 10 }) =>
        `/artist/${artistId}/top?limit=${limit}`,
    }),

    getAlbumDetails: builder.query({
      query: (albumId) => `/album/${albumId}`,
    }),

    getArtistAlbums: builder.query({
      query: (artistId) => `/artist/${artistId}/albums`,
    }),

    getAlbumTracks: builder.query({
      query: (albumId) => `/album/${albumId}/tracks`,
    }),
  }),
});

export const {
  useGetTopTracksQuery,
  useGetSongDetailsQuery,
  useGetArtistDetailsQuery,
  useGetArtistTopTracksQuery,
  useGetAlbumDetailsQuery,
  useGetArtistAlbumsQuery,
  useGetAlbumTracksQuery,
} = deezerApi;

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

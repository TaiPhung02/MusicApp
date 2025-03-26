import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const deezerApi = createApi({
  reducerPath: "deezerApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5000/api/deezer",
    baseUrl: "https://musicapp-backend-e28h.onrender.com/api/deezer",
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
      query: ({ artistId, limit = 10, index = 0 }) =>
        `/artist/${artistId}/albums?limit=${limit}&index=${index}`,
    }),

    getAlbumTracks: builder.query({
      query: (albumId) => `/album/${albumId}/tracks`,
    }),

    getTopAlbums: builder.query({
      query: ({ limit = 20, index = 0 }) =>
        `/chart/albums?limit=${limit}&index=${index}`,
    }),

    getTopArtists: builder.query({
      query: ({ limit = 20, index = 0 }) =>
        `/chart/artists?limit=${limit}&index=${index}`,
    }),

    getTopPlaylists: builder.query({
      query: ({ limit = 20, index = 0 }) =>
        `/chart/playlists?limit=${limit}&index=${index}`,
    }),

    getPlaylistDetails: builder.query({
      query: (playlistId) => `/playlist/${playlistId}`,
    }),

    searchTracks: builder.query({
      query: ({ query }) => `/search?q=${query}`,
    }),

    searchArtists: builder.query({
      query: ({ query, limit = 20, index = 0 }) =>
        `/search/artist?q=${query}&limit=${limit}&index=${index}`,
    }),
    
    searchAlbums: builder.query({
      query: ({ query, limit = 20, index = 0 }) =>
        `/search/album?q=${query}&limit=${limit}&index=${index}`,
    }),
    
    searchPlaylists: builder.query({
      query: ({ query, limit = 20, index = 0 }) =>
        `/search/playlist?q=${query}&limit=${limit}&index=${index}`,
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
  useGetTopAlbumsQuery,
  useGetTopArtistsQuery,
  useGetTopPlaylistsQuery,
  useGetPlaylistDetailsQuery,
  useSearchTracksQuery,
  useSearchArtistsQuery,
  useSearchAlbumsQuery,
  useSearchPlaylistsQuery,
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

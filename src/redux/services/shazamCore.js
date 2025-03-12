import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shazamCoreApi = createApi({
  reducerPath: "shazamCoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://shazam.p.rapidapi.com",
    prepareHeaders: (headers) => {
      headers.set(
        "x-rapidapi-key",
        "c0c474ebcdmshcba6d2483157c33p16cbc5jsnfa8be4dea1c8"
      );

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getChartsList: builder.query({ query: () => "/charts/list" }),
  }),
});

export const { useGetChartsListQuery } = shazamCoreApi;

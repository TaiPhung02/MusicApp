import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { DetailsHeader, Error, Loader, PopularSongs } from "../components";

import {
  useGetArtistDetailsQuery,
  useGetArtistTopTracksQuery,
  useGetSongDetailsQuery,
} from "../redux/services/shazamCore";

const ArtistDetails = () => {
  const location = useLocation();
  const songid = location.state?.songid;
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const {
    data: songData,
    isFetching: isFetchingSongDetails,
    isError: isSongDetailsError,
  } = useGetSongDetailsQuery(songid);

  const shouldFetchLyrics = songData?.title && songData?.artist?.id;

  const {
    data: artistData,
    isFetching: isFetchingPopularSongs,
    isError: isErrorPopularSongs,
  } = useGetArtistTopTracksQuery(
    { artistId: songData?.artist?.id, limit: 10 },
    { skip: !shouldFetchLyrics }
  );

  if (isFetchingSongDetails || isFetchingPopularSongs) {
    return <Loader />;
  }

  if (isErrorPopularSongs || isSongDetailsError) {
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={songData?.artist?.id}
        artistData={songData?.artist}
        songData={songData}
      />

      <PopularSongs
        songData={songData}
        // artistId={songData?.artist?.id}
        artistData={artistData}
        isPlaying={isPlaying}
        activeSong={activeSong}
      />
    </div>
  );
};

export default ArtistDetails;

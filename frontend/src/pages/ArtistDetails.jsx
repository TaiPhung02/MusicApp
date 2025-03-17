import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { DetailsHeader, Error, Loader, PopularSongs } from "../components";
import {
  useGetArtistTopTracksQuery,
  useGetSongDetailsQuery,
  useGetArtistAlbumsQuery,
  useGetAlbumTracksQuery,
} from "../redux/services/shazamCore";

const ArtistDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const songid = location.state?.songid;
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  const {
    data: songData,
    isFetching: isFetchingSongDetails,
    isError: isSongDetailsError,
  } = useGetSongDetailsQuery(songid);

  const shouldFetchData = songData?.artist?.id;

  const {
    data: artistData,
    isFetching: isFetchingPopularSongs,
    isError: isErrorPopularSongs,
  } = useGetArtistTopTracksQuery(
    { artistId: songData?.artist?.id, limit: 10 },
    { skip: !shouldFetchData }
  );

  const {
    data: albumsData,
    isFetching: isFetchingAlbums,
    isError: isAlbumsError,
  } = useGetArtistAlbumsQuery(songData?.artist?.id, { skip: !shouldFetchData });

  const { data: albumTracks, isFetching: isFetchingTracks } =
    useGetAlbumTracksQuery(selectedAlbumId, { skip: !selectedAlbumId });

  if (isFetchingSongDetails || isFetchingPopularSongs || isFetchingAlbums) {
    return <Loader />;
  }

  if (isErrorPopularSongs || isSongDetailsError || isAlbumsError) {
    return <Error />;
  }

  const handleAlbumClick = (albumId) => {
    setSelectedAlbumId(albumId);
  };

  if (albumTracks?.data?.length > 0) {
    const firstTrack = albumTracks.data[0];
    navigate(`/songs/${firstTrack.id}`);
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
        artistData={artistData}
        isPlaying={isPlaying}
        activeSong={activeSong}
      />

      {albumsData && albumsData.data.length > 0 && (
        <div className="mt-8">
          <h2 className="text-white text-3xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albumsData.data.map((album) => (
              <div
                key={album.id}
                className="bg-gray-800 p-3 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-200"
                onClick={() => handleAlbumClick(album.id)}
              >
                <img
                  src={album.cover_medium}
                  alt={album.title}
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-white text-lg font-semibold mt-2">
                  {album.title}
                </p>
                <p className="text-gray-400 text-sm">{album.release_date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDetails;

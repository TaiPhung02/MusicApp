import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { DetailsHeader, Error, Loader, PopularSongs } from "../components";
import {
  useGetArtistTopTracksQuery,
  useGetArtistAlbumsQuery,
  useGetAlbumTracksQuery,
  useGetArtistDetailsQuery,
} from "../redux/services/shazamCore";

const ArtistDetails = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  const {
    data: artistDetails,
    isFetching: isFetchingArtistDetails,
    isError: isErrorArtistDetails,
  } = useGetArtistDetailsQuery(artistId);

  const {
    data: artistData,
    isFetching: isFetchingPopularSongs,
    isError: isErrorPopularSongs,
  } = useGetArtistTopTracksQuery({ artistId, limit: 10 });

  const {
    data: albumsData,
    isFetching: isFetchingAlbums,
    isError: isAlbumsError,
  } = useGetArtistAlbumsQuery(artistId);

  const {
    data: albumTracksData,
    isFetching: isFetchingAlbumTracks,
    isError: isErrorAlbumTracks,
  } = useGetAlbumTracksQuery(selectedAlbumId, { skip: !selectedAlbumId });

  useEffect(() => {
    if (albumTracksData && albumTracksData.data.length > 0) {
      navigate(`/songs/${albumTracksData.data[0].id}`);
    }
  }, [albumTracksData, navigate]);

  if (isFetchingPopularSongs || isFetchingAlbums || isFetchingArtistDetails) {
    return <Loader />;
  }

  if (isErrorPopularSongs || isAlbumsError || isErrorArtistDetails) {
    return <Error />;
  }

  const handleAlbumClick = (albumId) => {
    setSelectedAlbumId(albumId);
  };

  return (
    <div className="flex flex-col">
      <DetailsHeader artistId={artistId} artistData={artistDetails} />

      <PopularSongs
        artistId={artistId}
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
                onClick={() => handleAlbumClick(album.id)}>
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

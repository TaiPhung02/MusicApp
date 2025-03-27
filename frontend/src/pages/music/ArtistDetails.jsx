import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";
import { DetailsHeader, Error, Loader, PopularSongs } from "../../components";
import { setActiveSong, playPause } from "../../redux/features/playerSlice";
import {
  useGetArtistTopTracksQuery,
  useGetArtistAlbumsQuery,
  useGetAlbumTracksQuery,
  useGetArtistDetailsQuery,
} from "../../redux/services/shazamCore";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ArtistDetails = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMoreAlbums, setHasMoreAlbums] = useState(true);

  const observerRef = useRef();

  // **RESET**
  useEffect(() => {
    setAlbums([]);
    setPage(0);
    setHasMoreAlbums(true);
    setSelectedAlbumId(null);
  }, [artistId]);

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
  } = useGetArtistAlbumsQuery(
    { artistId, limit: 10, index: page * 10 },
    { skip: !hasMoreAlbums }
  );

  const {
    data: albumTracksData,
    isFetching: isFetchingAlbumTracks,
    isError: isErrorAlbumTracks,
  } = useGetAlbumTracksQuery(selectedAlbumId, { skip: !selectedAlbumId });

  // update list of album
  useEffect(() => {
    if (albumsData?.data.length === 0) {
      setHasMoreAlbums(false);
    } else if (albumsData?.data) {
      setAlbums((prevAlbums) =>
        page === 0
          ? albumsData.data
          : [
              ...prevAlbums,
              ...albumsData.data.filter(
                (album) => !prevAlbums.some((prev) => prev.id === album.id)
              ),
            ]
      );
    }
  }, [albumsData]);

  useEffect(() => {
    if (albumTracksData?.data?.length > 0) {
      navigate(`/songs/${albumTracksData.data[0].id}`);
    }
  }, [albumTracksData, navigate]);

  // **Infinite Scroll - Intersection Observer**
  const lastAlbumRef = useCallback(
    (node) => {
      if (isFetchingAlbums || !hasMoreAlbums) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 1 }
      );

      if (node) observerRef.current.observe(node);
    },
    [isFetchingAlbums, hasMoreAlbums]
  );

  if (isFetchingPopularSongs || isFetchingArtistDetails) {
    return <Loader />;
  }

  if (isErrorPopularSongs || isAlbumsError || isErrorArtistDetails) {
    return <Error />;
  }

  const handleAlbumClick = (albumId) => {
    setSelectedAlbumId(albumId);
  };

  const handlePauseClick = () => {
      dispatch(playPause(false));
    };

  const handlePlayFromArtist = (song, i) => {
    dispatch(setActiveSong({ song, data: artistData, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="flex flex-col">
      <DetailsHeader artistId={artistId} artistData={artistDetails} />

      <PopularSongs
        artistId={artistId}
        artistData={artistData}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePause={handlePauseClick}
        handlePlay={handlePlayFromArtist}
      />

      {albums.length > 0 && (
        <div className="mt-8">
          <h2 className="text-white text-3xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map((album, i) => (
              <div
                key={album.id}
                className="bg-gray-800 p-3 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-200"
                onClick={() => handleAlbumClick(album.id)}
                ref={i === albums.length - 1 ? lastAlbumRef : null}>
                <LazyLoadImage
                  src={album.cover_medium}
                  alt={album.title}
                  className="w-full h-auto rounded-lg"
                  effect="blur"
                />
                <p className="text-white text-lg font-semibold mt-2">
                  {album.title}
                </p>
                <p className="text-gray-400 text-sm">{album.release_date}</p>
              </div>
            ))}
          </div>
          {isFetchingAlbums && <Loader title="Loading more albums..." />}
        </div>
      )}
    </div>
  );
};

export default ArtistDetails;

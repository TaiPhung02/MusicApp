import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const DetailsHeader = ({ artistId, artistData, songData }) => {
  return (
    <div className="relative w-full flex flex-col mb-8">
      <div className="w-full h-60 sm:h-72 bg-gradient-to-b from-gray-900 via-gray-800 to-black relative rounded-lg">
        <img
          src={artistId ? artistData?.picture_big : songData?.album?.cover_big}
          alt="background-art"
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-lg"
        />
      </div>

      <div className="absolute inset-0 flex items-center px-6 sm:px-12">
        <div className="relative">
          <LazyLoadImage
            alt="art"
            src={
              artistId ? artistData?.picture_big : songData?.album?.cover_big
            }
            className="sm:w-48 w-32 sm:h-48 h-32 rounded-full object-cover border-4 border-gray-700 shadow-2xl shadow-black transform transition-all duration-300 hover:scale-105"
            effect="blur"
          />
          <div className="absolute inset-0 bg-white opacity-10 rounded-full blur-xl"></div>
        </div>

        <div className="ml-6">
          <p className="font-bold sm:text-4xl text-2xl text-white drop-shadow-lg">
            {artistId ? artistData?.name : songData?.title}
          </p>

          {!artistId && (
            <Link to={`/artists/${songData?.artist?.id}`}>
              <p className="text-lg text-gray-300 mt-2 hover:text-white transition-colors duration-200">
                {songData?.artist?.name}
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsHeader;

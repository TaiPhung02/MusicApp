import SongBar from "./SongBar";

const PopularSongs = ({
  songid,
  artistId,
  artistData,
  isPlaying,
  activeSong,
  handlePause,
  handlePlay,
}) => {
  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-3xl text-white">Popular Songs:</h1>

      <div className="mt-6 w-full flex flex-col">
        {artistData?.data?.map((song, i) => (
          <SongBar
            songid={songid}
            key={song?.id}
            song={song}
            i={i}
            artistId={artistId}
            isPlaying={isPlaying}
            activeSong={activeSong}
            handlePauseClick={handlePause}
            handlePlayClick={handlePlay}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularSongs;

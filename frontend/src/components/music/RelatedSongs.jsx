import SongBar from "./SongBar";

const RelatedSongs = ({
  artistData,
  isPlaying,
  activeSong,
  handlePause,
  handlePlay,
}) => {
  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-3xl text-white">Related Songs:</h1>

      <div className="mt-6 w-full flex flex-col">
        {artistData?.data?.map((song, i) => (
          <SongBar
            key={song?.id}
            song={song}
            i={i}
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

export default RelatedSongs;

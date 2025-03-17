import React, { useRef, useEffect } from "react";
import ReactPlayer from "react-player";

const Player = ({
  youtubeUrl,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  repeat,
}) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(seekTime, "seconds");
    }
  }, [seekTime]);

  return (
    <ReactPlayer
      ref={playerRef}
      url={youtubeUrl}
      playing={isPlaying}
      volume={volume}
      loop={repeat}
      onEnded={onEnded}
      onProgress={({ playedSeconds }) =>
        onTimeUpdate({ target: { currentTime: playedSeconds } })
      }
      onDuration={(duration) => onLoadedData({ target: { duration } })}
      width="0"
      height="0"
      config={{ youtube: { playerVars: { controls: 0 } } }}
    />
  );
};

export default Player;

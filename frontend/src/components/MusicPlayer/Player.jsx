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

  if (!youtubeUrl) return null;

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
      width="100px"
      height="100px"
      config={{ youtube: { playerVars: { controls: 1 } } }}
    />
  );
};

export default Player;

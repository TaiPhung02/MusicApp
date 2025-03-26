import React, { useRef, useEffect } from "react";
import ReactPlayer from "react-player/youtube";

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
      controls={false}
      width="0"
      height="0"
      onEnded={onEnded}
      onProgress={({ playedSeconds }) =>
        onTimeUpdate({ target: { currentTime: playedSeconds } })
      }
      onDuration={(duration) => onLoadedData({ target: { duration } })}
      config={{
        youtube: {
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
          },
        },
      }}
    />
  );
};

export default Player;

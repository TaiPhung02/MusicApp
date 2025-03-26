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

  // Tách videoId từ youtubeUrl
  const videoId = youtubeUrl.split("v=")[1]?.split("&")[0];
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1`;

  return (
    <ReactPlayer
      ref={playerRef}
      url={embedUrl}
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

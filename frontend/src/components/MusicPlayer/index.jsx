import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiMusic, FiVolume2 } from "react-icons/fi";
import {
  BsFillVolumeUpFill,
  BsVolumeDownFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";
import { MdPlaylistPlay, MdCast, MdTune } from "react-icons/md"; // Icon Playlist, Chromecast, Adjust
import { searchYouTube } from "../../api/youtube";
import {
  nextSong,
  prevSong,
  playPause,
  setYoutubeUrl,
} from "../../redux/features/playerSlice";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";

const MusicPlayer = () => {
  const {
    activeSong,
    currentSongs,
    currentIndex,
    isActive,
    isPlaying,
    youtubeUrl,
  } = useSelector((state) => state.player);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const dispatch = useDispatch();

  let hideTimeout;

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout);
    setShowVolume(true);
  };

  const handleMouseLeave = () => {
    hideTimeout = setTimeout(() => {
      setShowVolume(false);
    }, 500);
  };

  useEffect(() => {
    if (currentSongs.length) dispatch(playPause(true));
  }, [currentIndex]);

  const handlePlayPause = () => {
    if (!isActive) return;
    dispatch(playPause(!isPlaying));
  };

  const handleNextSong = () => {
    dispatch(playPause(false));
    dispatch(
      nextSong(
        shuffle
          ? Math.floor(Math.random() * currentSongs.length)
          : (currentIndex + 1) % currentSongs.length
      )
    );
  };

  const handlePrevSong = () => {
    dispatch(
      prevSong(
        shuffle
          ? Math.floor(Math.random() * currentSongs.length)
          : currentIndex === 0
          ? currentSongs.length - 1
          : currentIndex - 1
      )
    );
  };

  useEffect(() => {
    if (activeSong) {
      searchYouTube(activeSong?.title, activeSong?.artist?.name).then((url) => {
        dispatch(setYoutubeUrl(url));
      });
    }
  }, [activeSong]);

  return (
    <div className="relative sm:px-12 px-8 w-full flex items-center justify-between">
      {/* Phần 1: Track */}
      <div className="flex-1 flex justify-start">
        <Track
          isPlaying={isPlaying}
          isActive={isActive}
          activeSong={activeSong}
        />
      </div>

      {/* Phần 2: Controls + Seekbar + Player (luôn ở giữa) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <Controls
          isPlaying={isPlaying}
          isActive={isActive}
          repeat={repeat}
          setRepeat={setRepeat}
          shuffle={shuffle}
          setShuffle={setShuffle}
          currentSongs={currentSongs}
          handlePlayPause={handlePlayPause}
          handlePrevSong={handlePrevSong}
          handleNextSong={handleNextSong}
        />
        <Seekbar
          value={appTime}
          min="0"
          max={duration}
          onInput={(event) => setSeekTime(event.target.value)}
          setSeekTime={setSeekTime}
          appTime={appTime}
        />
        <Player
          youtubeUrl={youtubeUrl}
          volume={volume}
          isPlaying={isPlaying}
          seekTime={seekTime}
          repeat={repeat}
          currentIndex={currentIndex}
          onEnded={handleNextSong}
          onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
          onLoadedData={(event) => setDuration(event.target.duration)}
        />
      </div>

      {/* Phần 3: Playlist, Chromecast, Volume, Adjust */}
      <div className="flex-1 flex justify-end items-center space-x-4">
        {/* Playlist Icon */}
        <MdPlaylistPlay size={25} color="#FFF" />

        {/* Chromecast Icon */}
        <MdCast size={25} color="#FFF" />

        {/* Volume Section */}
        <div
          className="relative flex items-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {volume > 0.5 ? (
            <BsFillVolumeUpFill
              size={25}
              color="#FFF"
              onClick={() => setVolume(0)}
            />
          ) : volume > 0 ? (
            <BsVolumeDownFill
              size={25}
              color="#FFF"
              onClick={() => setVolume(0)}
            />
          ) : (
            <BsFillVolumeMuteFill
              size={25}
              color="#FFF"
              onClick={() => setVolume(1)}
            />
          )}

          {showVolume && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 p-2 rounded-lg shadow-lg">
              <VolumeBar
                value={volume}
                min="0"
                max="1"
                onChange={(e) => setVolume(e.target.value)}
                setVolume={setVolume}
              />
            </div>
          )}
        </div>

        {/* Adjust Icon */}
        <MdTune size={25} color="#FFF" />
      </div>
    </div>
  );
};

export default MusicPlayer;

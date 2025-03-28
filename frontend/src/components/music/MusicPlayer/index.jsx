import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiMusic, FiVolume2 } from "react-icons/fi";
import {
  BsFillVolumeUpFill,
  BsVolumeDownFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";
import { MdPlaylistPlay, MdCast, MdTune } from "react-icons/md";
import { searchYouTube } from "../../../api/youtube";
import {
  nextSong,
  prevSong,
  playPause,
  setYoutubeUrl,
  openPlaylistModal,
  closePlaylistModal,
} from "../../../redux/features/playerSlice";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";
import { useGetYouTubeUrlQuery } from "../../../redux/services/shazamCore";

const MusicPlayer = () => {
  const {
    activeSong,
    currentSongs,
    currentIndex,
    isActive,
    isPlaying,
    youtubeUrl,
    isPlaylistOpen,
    isShuffle,
  } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [castSession, setCastSession] = useState(null);

  let hideTimeout;

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout);
    setShowVolume(true);
  };

  const handleMouseLeave = () => {
    hideTimeout = setTimeout(() => {
      setShowVolume(false);
    }, 100);
  };

  useEffect(() => {
    if (currentSongs.length) dispatch(playPause(true));
  }, [currentIndex]);

  const handlePlayPause = () => {
    if (!isActive || !youtubeUrl) return;
    dispatch(playPause(!isPlaying));
  };

  const handleNextSong = () => {
    dispatch(playPause(false));
    dispatch(nextSong());
  };

  const handlePrevSong = () => {
    dispatch(prevSong());
  };

  const { data, error } = useGetYouTubeUrlQuery(
    activeSong?.title && activeSong?.artist?.name
      ? { song: activeSong.title, artist: activeSong.artist.name }
      : skipToken
  );

  useEffect(() => {
    if (data?.url) {
      dispatch(setYoutubeUrl(data.url));
    }
  }, [data, dispatch]);

  // useEffect(() => {
  //   dispatch(setYoutubeUrl(null));
  //   if (activeSong?.title && activeSong?.artist?.name) {
  //     searchYouTube(activeSong.title, activeSong.artist.name)
  //       .then((url) => {
  //         if (url) {
  //           console.log("YouTube URL:", url);
  //           dispatch(setYoutubeUrl(url));
  //         }
  //       })
  //       .catch((error) => console.error("YouTube Search Error:", error));
  //   }
  // }, [activeSong, dispatch]);

  const handleToggleModal = () => {
    if (isPlaylistOpen) {
      dispatch(closePlaylistModal());
    } else {
      dispatch(openPlaylistModal());
    }
  };

  const handleCast = () => {
    if (
      typeof window === "undefined" ||
      !window.chrome ||
      !window.chrome.cast
    ) {
      console.warn("Chromecast is not available");
      return;
    }

    const sessionRequest = new window.chrome.cast.SessionRequest(
      window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    );
    const apiConfig = new window.chrome.cast.ApiConfig(
      sessionRequest,
      (session) => setCastSession(session),
      () => {}
    );

    window.chrome.cast.initialize(
      apiConfig,
      () => {
        window.chrome.cast.requestSession(
          async (session) => {
            setCastSession(session);

            const mediaItems = await Promise.all(
              currentSongs.map(async (song) => {
                const url = await searchYouTube(song.title, song.artist?.name);
                return new window.chrome.cast.media.MediaInfo(url, "video/mp4");
              })
            );

            const queueItems = mediaItems.map(
              (mediaInfo, index) =>
                new window.chrome.cast.media.QueueItem(mediaInfo)
            );

            const request = new window.chrome.cast.media.LoadRequest(
              queueItems[0]
            );
            request.queueData = new window.chrome.cast.media.QueueData();
            request.queueData.items = queueItems;

            session.loadMedia(request);
          },
          (error) => console.error(error)
        );
      },
      (error) => console.error(error)
    );
  };

  return (
    <div className="relative sm:px-12 px-4 md:px-8 w-full flex items-center justify-between">
      {/* Track */}
      <div className="flex-1 flex justify-start">
        <Track
          isPlaying={isPlaying}
          isActive={isActive}
          activeSong={activeSong}
        />
      </div>

      {/* Controls + Seekbar + Player */}
      <div className="absolute left-3/4 sm:left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <Controls
          isPlaying={isPlaying}
          isActive={isActive}
          repeat={repeat}
          setRepeat={setRepeat}
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

      {/* Playlist, Chromecast, Volume, Adjust */}
      <div className="flex-1 hidden sm:flex justify-end items-center sm:space-x-4 space-x-2">
        {/* Playlist Icon */}
        <div
          className="group p-2 rounded-full hover:bg-[#3a393d] transition cursor-pointer"
          onClick={handleToggleModal}>
          <MdPlaylistPlay size={25} color="#FFF" />
        </div>

        {/* Chromecast Icon */}
        <div
          className="group p-2 rounded-full hover:bg-[#3a393d] transition cursor-pointer"
          onClick={handleCast}>
          <MdCast size={25} color="#FFF" />
        </div>

        {/* Volume Section */}
        <div
          className="relative flex items-center group p-2 rounded-full hover:bg-[#3a393d] transition cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
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
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-[#3a393d] p-2 rounded-lg shadow-lg">
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
        <div className="group p-2 rounded-full hover:bg-[#3a393d] transition cursor-pointer">
          <MdTune size={25} color="#FFF" />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;

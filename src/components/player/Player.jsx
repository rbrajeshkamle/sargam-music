import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Shuffle,
  Repeat2,
  Download,
  ListMusic,
  X,
} from "lucide-react";

import { useLikedSongs } from "../../context/useLikedSongs";
import { usePlayer } from "../../context/usePlayer";

import "../../styles/global.css";

function Player() {
  const playerRef = useRef(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQueue, setShowQueue] = useState(false);

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    playSong,
    queue = [],
  } = usePlayer();

  const likedSongsContext = useLikedSongs();

  const likedSongs = likedSongsContext?.likedSongs || [];
  const toggleLikedSong = likedSongsContext?.toggleLikedSong;

  const isLiked = likedSongs.some(
    (song) => song.id === currentSong?.id
  );

  // =========================
  // FORMAT TIME
  // =========================
  const formatTime = (time = 0) => {
    if (!Number.isFinite(time) || time < 0) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // =========================
  // YOUTUBE READY
  // =========================
  const onReady = (event) => {
    playerRef.current = event.target;

    const totalDuration =
      event.target.getDuration?.() || 0;

    if (
      Number.isFinite(totalDuration) &&
      totalDuration > 0
    ) {
      setDuration(totalDuration);
    }

    if (isPlaying) {
      event.target.playVideo?.();
    }
  };

  // =========================
  // PLAY / PAUSE
  // =========================
  useEffect(() => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo?.();
      } else {
        playerRef.current.pauseVideo?.();
      }
    } catch (error) {
      console.error("Player control error:", error);
    }
  }, [isPlaying, currentSong?.id]);

  // =========================
  // RESET WHEN SONG CHANGES
  // =========================
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentSong?.id]);

  // =========================
  // UPDATE PROGRESS
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      if (!playerRef.current) return;

      try {
        const time =
          playerRef.current.getCurrentTime?.() || 0;

        const totalDuration =
          playerRef.current.getDuration?.() || 0;

        if (Number.isFinite(time)) {
          setCurrentTime(time);
        }

        if (
          Number.isFinite(totalDuration) &&
          totalDuration > 0
        ) {
          setDuration(totalDuration);
        }
      } catch (error) {
        console.error(
          "Progress update error:",
          error
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentSong?.id]);

  // =========================
  // CHANGE PROGRESS
  // =========================
  const handleProgressChange = (event) => {
    const newTime = Number(event.target.value);

    setCurrentTime(newTime);

    if (playerRef.current) {
      playerRef.current.seekTo?.(
        newTime,
        true
      );
    }
  };

  // =========================
  // LIKE SONG
  // =========================
  const handleLike = () => {
    if (
      currentSong &&
      typeof toggleLikedSong === "function"
    ) {
      toggleLikedSong(currentSong);
    }
  };

  // =========================
  // SHUFFLE / NEXT SONG
  // =========================
  const handleNext = () => {
    // Agar shuffle ON hai aur queue mein songs hain
    if (
      isShuffle &&
      queue.length > 1 &&
      typeof playSong === "function"
    ) {
      const availableSongs = queue.filter(
        (song) => song.id !== currentSong?.id
      );

      if (availableSongs.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * availableSongs.length
        );

        playSong(
          availableSongs[randomIndex],
          queue
        );

        return;
      }
    }

    // Normal next
    if (typeof playNext === "function") {
      playNext();
    }
  };

  // =========================
  // PREVIOUS SONG
  // =========================
  const handlePrevious = () => {
    if (typeof playPrevious === "function") {
      playPrevious();
    }
  };

  // =========================
  // SONG END
  // =========================
  const handleSongEnd = () => {
    // Repeat ON
    if (isRepeat && playerRef.current) {
      playerRef.current.seekTo?.(0, true);
      playerRef.current.playVideo?.();
      return;
    }

    // Shuffle / Next
    handleNext();
  };

  // =========================
  // DOWNLOAD
  // =========================
  const handleDownload = async () => {
    if (!currentSong || isDownloading) return;

    const downloadUrl =
      currentSong.downloadUrl;

    if (!downloadUrl) {
      alert(
        "Download is not available for this song."
      );
      return;
    }

    try {
      setIsDownloading(true);

      const response =
        await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob =
        await response.blob();

      const fileUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = fileUrl;

      const safeTitle =
        currentSong.title
          ?.replace(/[\\/:*?"<>|]/g, "_")
          .trim() || "song";

      link.download =
        `${safeTitle}.mp3`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error(
        "Download error:",
        error
      );

      alert(
        "Unable to download this song."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // =========================
  // PLAY QUEUE SONG
  // =========================
  const handleQueueSong = (song) => {
    if (typeof playSong === "function") {
      playSong(song, queue);
    }

    setShowQueue(false);
  };

  // =========================
  // NO SONG
  // =========================
  if (!currentSong) {
    return null;
  }

  return (
    <>
      {/* HIDDEN YOUTUBE PLAYER */}

      <div className="youtube-hidden-player">
        <YouTube
          key={currentSong.id}
          videoId={currentSong.id}
          onReady={onReady}
          onEnd={handleSongEnd}
          opts={{
            width: "1",
            height: "1",
            playerVars: {
              autoplay: 0,
              controls: 0,
              rel: 0,
              disablekb: 1,
              modestbranding: 1,
            },
          }}
        />
      </div>

      {/* QUEUE PANEL */}

      <AnimatePresence>
        {showQueue && (
          <motion.div
            className="queue-panel"
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
          >
            <div className="queue-header">
              <div>
                <span>UP NEXT</span>

                <h3>
                  Queue

                  <small>
                    {queue.length}
                  </small>
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowQueue(false)
                }
                className="queue-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="queue-list">
              {queue.length > 0 ? (
                queue.map((song, index) => (
                  <button
                    type="button"
                    key={`${song.id}-${index}`}
                    className={`queue-song ${
                      song.id === currentSong.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleQueueSong(song)
                    }
                  >
                    <span className="queue-number">
                      {index + 1}
                    </span>

                    <img
                      src={song.thumbnail}
                      alt={song.title}
                    />

                    <div>
                      <h4>
                        {song.title}
                      </h4>

                      <p>
                        {song.artist ||
                          "Unknown Artist"}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="queue-empty">
                  <ListMusic size={30} />

                  <p>
                    Your queue is empty.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MUSIC PLAYER */}

      <AnimatePresence mode="wait">
        <motion.div
          className="music-player glass"
          key={currentSong.id}
          initial={{
            y: 100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 100,
            opacity: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 22,
          }}
        >
          {/* SONG INFO */}

          <div className="player-song-info">
            <motion.img
              src={currentSong.thumbnail}
              alt={currentSong.title}
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
            />

            <div className="player-song-text">
              <h4 title={currentSong.title}>
                {currentSong.title}
              </h4>

              <p>
                {currentSong.artist ||
                  "Unknown Artist"}
              </p>
            </div>

            {/* LIKE */}

            <button
              type="button"
              className={`player-like ${
                isLiked ? "liked" : ""
              }`}
              onClick={handleLike}
              aria-label={
                isLiked
                  ? "Remove from liked songs"
                  : "Like song"
              }
              title={
                isLiked
                  ? "Remove from liked songs"
                  : "Add to liked songs"
              }
            >
              <Heart
                size={20}
                fill={
                  isLiked
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

            {/* DOWNLOAD */}

            <button
              type="button"
              className="player-download"
              onClick={handleDownload}
              disabled={isDownloading}
              aria-label="Download song"
              title="Download song"
            >
              <Download size={20} />
            </button>
          </div>

          {/* CENTER */}

          <div className="player-center">
            <div className="player-buttons">

              {/* SHUFFLE */}

              <button
                type="button"
                className={`player-small-btn ${
                  isShuffle
                    ? "active-player-btn"
                    : ""
                }`}
                onClick={() =>
                  setIsShuffle((prev) => !prev)
                }
                aria-label="Shuffle"
                title={
                  isShuffle
                    ? "Shuffle On"
                    : "Shuffle Off"
                }
              >
                <Shuffle size={18} />
              </button>

              {/* PREVIOUS */}

              <button
                type="button"
                className="player-small-btn"
                onClick={handlePrevious}
                aria-label="Previous song"
              >
                <SkipBack
                  size={22}
                  fill="currentColor"
                />
              </button>

              {/* PLAY / PAUSE */}

              <motion.button
                type="button"
                className="main-play-button"
                onClick={togglePlay}
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.92,
                }}
                aria-label={
                  isPlaying
                    ? "Pause"
                    : "Play"
                }
              >
                {isPlaying ? (
                  <Pause
                    size={23}
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    size={23}
                    fill="currentColor"
                    style={{
                      marginLeft: "2px",
                    }}
                  />
                )}
              </motion.button>

              {/* NEXT */}

              <button
                type="button"
                className="player-small-btn"
                onClick={handleNext}
                aria-label="Next song"
              >
                <SkipForward
                  size={22}
                  fill="currentColor"
                />
              </button>

              {/* REPEAT */}

              <button
                type="button"
                className={`player-small-btn ${
                  isRepeat
                    ? "active-player-btn"
                    : ""
                }`}
                onClick={() =>
                  setIsRepeat((prev) => !prev)
                }
                aria-label="Repeat"
                title={
                  isRepeat
                    ? "Repeat On"
                    : "Repeat Off"
                }
              >
                <Repeat2 size={18} />
              </button>

              {/* QUEUE */}

              <button
                type="button"
                className={`player-small-btn queue-button ${
                  showQueue ? "active" : ""
                }`}
                onClick={() =>
                  setShowQueue((prev) => !prev)
                }
                aria-label="Open queue"
                title="Queue"
              >
                <ListMusic size={20} />

                {queue.length > 0 && (
                  <span className="queue-badge">
                    {queue.length}
                  </span>
                )}
              </button>
            </div>

            {/* PROGRESS */}

            <div className="player-progress">
              <span className="time-label">
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min="0"
                max={duration || 0}
                step="1"
                value={Math.min(
                  currentTime,
                  duration || 0
                )}
                onChange={handleProgressChange}
                className="progress-slider"
                aria-label="Song progress"
              />

              <span className="time-label">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default Player;
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Play,
  Pause,
  Music2,
  Trash2,
  Clock3,
} from "lucide-react";

import { useLikedSongs } from "../context/useLikedSongs";
import { usePlayer } from "../context/usePlayer";

function LikedSongs() {
  const {
    likedSongs,
    removeLikedSong,
  } = useLikedSongs();

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
  } = usePlayer();

  const handlePlay = (song) => {
    const isCurrentSong =
      currentSong?.id === song.id;

    if (isCurrentSong) {
      togglePlay();
      return;
    }

    playSong(song, likedSongs);
  };

  return (
    <motion.div
      className="liked-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* HEADER */}
      <section className="liked-hero">
        <motion.div
          className="liked-cover"
          initial={{ scale: 0.8, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 18,
          }}
        >
          <Heart
            size={55}
            fill="currentColor"
          />
        </motion.div>

        <div className="liked-hero-content">
          <span>YOUR COLLECTION</span>

          <h1>Liked Songs</h1>

          <p>
            The songs that found a place
            in your heart.
          </p>

          <div className="liked-meta">
            <Music2 size={16} />

            <span>
              {likedSongs.length}{" "}
              {likedSongs.length === 1
                ? "song"
                : "songs"}
            </span>
          </div>
        </div>
      </section>

      {/* SONGS */}
      {likedSongs.length > 0 ? (
        <>
          <motion.button
            type="button"
            className="liked-play-all"
            onClick={() =>
              playSong(
                likedSongs[0],
                likedSongs
              )
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play
              size={20}
              fill="currentColor"
            />

            Play All
          </motion.button>

          <div className="liked-list">
            <AnimatePresence>
              {likedSongs.map((song, index) => {
                const isCurrentSong =
                  currentSong?.id === song.id;

                return (
                  <motion.div
                    key={song.id}
                    className={`liked-song ${
                      isCurrentSong
                        ? "playing"
                        : ""
                    }`}
                    initial={{
                      opacity: 0,
                      x: -25,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 50,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    layout
                  >
                    <span className="liked-index">
                      {isCurrentSong &&
                      isPlaying ? (
                        <motion.div
                          className="playing-bars"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                          }}
                        >
                          🎵
                        </motion.div>
                      ) : (
                        index + 1
                      )}
                    </span>

                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="liked-thumbnail"
                    />

                    <div className="liked-song-info">
                      <h3>{song.title}</h3>

                      <p>
                        {song.artist ||
                          "Unknown Artist"}
                      </p>
                    </div>

                    <div className="liked-song-actions">
                      <span className="liked-duration">
                        <Clock3 size={15} />
                      </span>

                      <motion.button
                        type="button"
                        className="liked-song-play"
                        onClick={() =>
                          handlePlay(song)
                        }
                        whileHover={{
                          scale: 1.1,
                        }}
                        whileTap={{
                          scale: 0.9,
                        }}
                      >
                        {isCurrentSong &&
                        isPlaying ? (
                          <Pause
                            size={19}
                            fill="currentColor"
                          />
                        ) : (
                          <Play
                            size={19}
                            fill="currentColor"
                          />
                        )}
                      </motion.button>

                      <motion.button
                        type="button"
                        className="liked-remove"
                        onClick={() =>
                          removeLikedSong(song.id)
                        }
                        whileHover={{
                          scale: 1.1,
                        }}
                        whileTap={{
                          scale: 0.9,
                        }}
                        aria-label="Remove song"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <motion.div
          className="liked-empty glass"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
        >
          <div className="liked-empty-icon">
            <Heart size={42} />
          </div>

          <h2>No liked songs yet</h2>

          <p>
            Start exploring and tap the heart
            on songs you love.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default LikedSongs;
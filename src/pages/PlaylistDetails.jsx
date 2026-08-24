import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  Play,
  Pause,
  Music2,
  Trash2,
  Clock3,
  ListMusic,
} from "lucide-react";

import { usePlaylists } from "../context/usePlaylists";
import { usePlayer } from "../context/usePlayer";

function PlaylistDetails() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const {
    playlists,
    removeSongFromPlaylist,
  } = usePlaylists();

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
  } = usePlayer();

  const playlist = useMemo(() => {
    return playlists.find(
      (item) => item.id === playlistId
    );
  }, [playlists, playlistId]);

  const handlePlaySong = (song) => {
    const isCurrentSong =
      currentSong?.id === song.id;

    if (isCurrentSong) {
      togglePlay();
      return;
    }

    playSong(
      song,
      playlist?.songs || []
    );
  };

  if (!playlist) {
    return (
      <div className="playlist-not-found">
        <Music2 size={48} />

        <h2>Playlist not found</h2>

        <button
          type="button"
          onClick={() =>
            navigate("/playlists")
          }
        >
          Back to Playlists
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="playlist-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* BACK BUTTON */}

      <motion.button
        type="button"
        className="playlist-back-button"
        onClick={() => navigate(-1)}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />

        Back
      </motion.button>

      {/* HERO */}

      <section className="playlist-details-hero">
        <motion.div
          className="playlist-details-cover"
          initial={{
            scale: 0.8,
            rotate: -8,
          }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 18,
          }}
        >
          <ListMusic size={58} />
        </motion.div>

        <div className="playlist-details-info">
          <span>PLAYLIST</span>

          <h1>{playlist.name}</h1>

          <p>
            {playlist.songs.length}{" "}
            {playlist.songs.length === 1
              ? "song"
              : "songs"}
          </p>
        </div>
      </section>

      {/* PLAY ALL */}

      {playlist.songs.length > 0 && (
        <motion.button
          type="button"
          className="playlist-play-all"
          onClick={() =>
            playSong(
              playlist.songs[0],
              playlist.songs
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
      )}

      {/* SONG LIST */}

      {playlist.songs.length > 0 ? (
        <div className="playlist-song-list">
          <AnimatePresence>
            {playlist.songs.map(
              (song, index) => {
                const isCurrentSong =
                  currentSong?.id === song.id;

                return (
                  <motion.div
                    key={song.id}
                    className={`playlist-song ${
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
                      x: 40,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    layout
                  >
                    <span className="playlist-song-index">
                      {index + 1}
                    </span>

                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="playlist-song-thumbnail"
                    />

                    <div className="playlist-song-info">
                      <h3>{song.title}</h3>

                      <p>
                        {song.artist ||
                          "Unknown Artist"}
                      </p>
                    </div>

                    <div className="playlist-song-actions">
                      <Clock3 size={16} />

                      <motion.button
                        type="button"
                        className="playlist-song-play"
                        onClick={() =>
                          handlePlaySong(song)
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
                        className="playlist-remove-song"
                        onClick={() =>
                          removeSongFromPlaylist(
                            playlist.id,
                            song.id
                          )
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
              }
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          className="playlist-empty glass"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
        >
          <Music2 size={45} />

          <h2>This playlist is empty</h2>

          <p>
            Search for songs and add them
            to this playlist.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/search")
            }
          >
            Search Music
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default PlaylistDetails;
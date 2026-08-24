import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Plus,
  Music2,
  ListMusic,
  Play,
  Trash2,
  X,
} from "lucide-react";

import { usePlaylists } from "../context/usePlaylists";
import { usePlayer } from "../context/usePlayer";

function Playlists() {
  const navigate = useNavigate();

  const {
    playlists,
    createPlaylist,
    deletePlaylist,
  } = usePlaylists();

  const { playSong } = usePlayer();

  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState("");

  // Escape key se modal close
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (showModal) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
    setPlaylistName("");
    setError("");
  };

  const handleCreatePlaylist = (event) => {
    event.preventDefault();

    const name = playlistName.trim();

    if (!name) {
      setError("Please enter a playlist name.");
      return;
    }

    // Duplicate playlist check
    const alreadyExists = playlists.some(
      (playlist) =>
        playlist.name.toLowerCase() ===
        name.toLowerCase()
    );

    if (alreadyExists) {
      setError("A playlist with this name already exists.");
      return;
    }

    const newPlaylist = createPlaylist(name);

    if (!newPlaylist) {
      setError("Unable to create playlist.");
      return;
    }

    closeModal();

    navigate(`/playlists/${newPlaylist.id}`);
  };

  const handleDeletePlaylist = (
    event,
    playlistId
  ) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this playlist?"
    );

    if (!confirmed) return;

    deletePlaylist(playlistId);
  };

  const handlePlayPlaylist = (
    event,
    playlist
  ) => {
    event.stopPropagation();

    const songs = playlist.songs || [];

    if (songs.length === 0) return;

    // Playlist ka first song play hoga
    // Aur puri playlist queue me set hogi
    playSong(songs[0], songs);
  };

  return (
    <motion.div
      className="playlists-page"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
    >
      {/* HEADER */}

      <section className="playlists-hero">
        <div>
          <motion.div
            className="playlist-label"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <ListMusic size={16} />

            YOUR MUSIC COLLECTION
          </motion.div>

          <h1>
            My <span>Playlists</span>
          </h1>

          <p>
            Create playlists and keep your
            favourite music together.
          </p>
        </div>

        <motion.button
          type="button"
          className="create-playlist-btn"
          onClick={() => setShowModal(true)}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          <Plus size={20} />

          Create Playlist
        </motion.button>
      </section>

      {/* PLAYLIST GRID */}

      {playlists.length > 0 ? (
        <div className="playlists-grid">
          <AnimatePresence>
            {playlists.map(
              (playlist, index) => {
                const songs =
                  playlist.songs || [];

                return (
                  <motion.div
                    key={playlist.id}
                    className="playlist-card glass"
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -7,
                    }}
                    layout
                    onClick={() =>
                      navigate(
                        `/playlists/${playlist.id}`
                      )
                    }
                  >
                    {/* COVER */}

                    <div className="playlist-card-cover">
                      <Music2 size={40} />

                      {songs.length > 0 && (
                        <motion.button
                          type="button"
                          className="playlist-card-play"
                          onClick={(event) =>
                            handlePlayPlaylist(
                              event,
                              playlist
                            )
                          }
                          whileHover={{
                            scale: 1.1,
                          }}
                          whileTap={{
                            scale: 0.9,
                          }}
                          aria-label={`Play ${playlist.name}`}
                        >
                          <Play
                            size={20}
                            fill="currentColor"
                          />
                        </motion.button>
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="playlist-card-content">
                      <div>
                        <h3>
                          {playlist.name}
                        </h3>

                        <p>
                          {songs.length}{" "}
                          {songs.length === 1
                            ? "song"
                            : "songs"}
                        </p>
                      </div>

                      <motion.button
                        type="button"
                        className="delete-playlist-btn"
                        onClick={(event) =>
                          handleDeletePlaylist(
                            event,
                            playlist.id
                          )
                        }
                        whileHover={{
                          scale: 1.1,
                        }}
                        whileTap={{
                          scale: 0.9,
                        }}
                        aria-label="Delete playlist"
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
          className="playlists-empty glass"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
        >
          <div className="playlists-empty-icon">
            <Music2 size={48} />
          </div>

          <h2>
            No playlists yet
          </h2>

          <p>
            Create your first playlist and
            start adding your favourite songs.
          </p>

          <motion.button
            type="button"
            className="create-first-playlist"
            onClick={() => setShowModal(true)}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <Plus size={19} />

            Create Your First Playlist
          </motion.button>
        </motion.div>
      )}

      {/* CREATE PLAYLIST MODAL */}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="playlist-modal-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={closeModal}
          >
            <motion.div
              className="playlist-modal glass"
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 20,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                type="button"
                className="playlist-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="playlist-modal-icon">
                <ListMusic size={34} />
              </div>

              <h2>
                Create Playlist
              </h2>

              <p>
                Give your playlist a name.
              </p>

              <form
                onSubmit={handleCreatePlaylist}
              >
                <input
                  type="text"
                  placeholder="My Favourite Songs"
                  value={playlistName}
                  onChange={(event) => {
                    setPlaylistName(
                      event.target.value
                    );

                    setError("");
                  }}
                  autoFocus
                  maxLength={40}
                />

                {error && (
                  <p className="playlist-form-error">
                    {error}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={!playlistName.trim()}
                  whileHover={{
                    scale: playlistName.trim()
                      ? 1.03
                      : 1,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <Plus size={19} />

                  Create Playlist
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Playlists;
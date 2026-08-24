import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { motion } from "framer-motion";

import {
  Play,
  Pause,
  Clock3,
  TrendingUp,
  Music2,
  LoaderCircle,
  Trash2,
  Heart,
} from "lucide-react";

import api from "../api/axios";

import { usePlayer } from "../context/usePlayer";
import { useLikedSongs } from "../context/useLikedSongs.js";

function Search() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const urlQuery =
    searchParams.get("q") || "";

  const [query, setQuery] =
    useState("");

  const [songs, setSongs] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [searched, setSearched] =
    useState(false);

  const [error, setError] =
    useState("");

  const {
    likedSongs,
    toggleLikedSong,
  } = useLikedSongs();

  const {
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
  } = usePlayer();

  /* =========================
     RECENT SEARCHES
  ========================= */

  const [
    recentSearches,
    setRecentSearches,
  ] = useState(() => {
    try {
      const savedSearches =
        localStorage.getItem(
          "sargam_recent_searches"
        );

      const parsedSearches =
        savedSearches
          ? JSON.parse(savedSearches)
          : [];

      return Array.isArray(parsedSearches)
        ? parsedSearches
        : [];
    } catch {
      return [];
    }
  });

  /* =========================
     SAVE RECENT SEARCH
  ========================= */

  const saveRecentSearch = (searchText) => {
    const trimmedSearch =
      searchText.trim();

    if (!trimmedSearch) return;

    setRecentSearches(
      (previousSearches) => {
        const updatedSearches = [
          trimmedSearch,
          ...previousSearches.filter(
            (item) =>
              item.toLowerCase() !==
              trimmedSearch.toLowerCase()
          ),
        ].slice(0, 8);

        localStorage.setItem(
          "sargam_recent_searches",
          JSON.stringify(updatedSearches)
        );

        return updatedSearches;
      }
    );
  };

  /* =========================
     SEARCH MUSIC
  ========================= */

  const handleSearch = async (
    searchQuery = query
  ) => {
    const finalQuery =
      searchQuery.trim();

    if (!finalQuery) return;

    try {
      setLoading(true);
      setSearched(true);
      setError("");
      setSongs([]);

      setQuery(finalQuery);

      saveRecentSearch(finalQuery);

      const { data } =
        await api.get(
          "/youtube/search",
          {
            params: {
              q: finalQuery,
            },
          }
        );

      setSongs(
        Array.isArray(data?.songs)
          ? data.songs
          : []
      );
    } catch (err) {
      console.error(
        "YouTube Search Error:",
        err.response?.data ||
          err.message
      );

      setSongs([]);

      setError(
        "Music search failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     TOPBAR SEARCH
  ========================= */

  useEffect(() => {
    if (!urlQuery.trim()) return;

    if (
      urlQuery === query &&
      searched
    ) {
      return;
    }

    handleSearch(urlQuery);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

  /* =========================
     RECENT SEARCH CLICK
  ========================= */

  const useRecentSearch = (item) => {
    setQuery(item);

    setSearchParams({
      q: item,
    });
  };

  /* =========================
     DELETE RECENT SEARCH
  ========================= */

  const deleteRecentSearch = (
    searchItem
  ) => {
    setRecentSearches(
      (previousSearches) => {
        const updatedSearches =
          previousSearches.filter(
            (item) =>
              item !== searchItem
          );

        localStorage.setItem(
          "sargam_recent_searches",
          JSON.stringify(updatedSearches)
        );

        return updatedSearches;
      }
    );
  };

  /* =========================
     CLEAR ALL HISTORY
  ========================= */

  const clearAllRecentSearches = () => {
    setRecentSearches([]);

    localStorage.removeItem(
      "sargam_recent_searches"
    );
  };

  /* =========================
     PLAY SONG
  ========================= */

  const handlePlaySong = (song) => {
    const isCurrentSong =
      currentSong?.id === song.id;

    if (isCurrentSong) {
      togglePlay();
      return;
    }

    playSong(song, songs);
  };

  /* =========================
     LIKE / UNLIKE SONG
  ========================= */

  const handleToggleLike = (song) => {
    toggleLikedSong(song);
  };

  return (
    <motion.div
      className="search-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.35,
      }}
    >
      {/* HERO */}

      <section className="search-hero">
        <motion.div
          initial={{
            y: 25,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <div className="search-label">
            <Music2 size={16} />

            <span>
              DISCOVER SOMETHING NEW
            </span>
          </div>

          <h1>
            Find your{" "}
            <span>sound.</span>
          </h1>

          <p>
            Search songs, artists and
            music videos.
          </p>
        </motion.div>
      </section>

      {/* RECENT SEARCHES */}

      {!searched &&
        recentSearches.length > 0 && (
          <motion.section
            className="search-section"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="section-heading">
              <div>
                <span>
                  YOUR HISTORY
                </span>

                <h2>
                  Recent Searches
                </h2>
              </div>

              <button
                type="button"
                className="clear-history-btn"
                onClick={
                  clearAllRecentSearches
                }
              >
                Clear all
              </button>
            </div>

            <div className="recent-searches">
              {recentSearches.map(
                (item, index) => (
                  <motion.div
                    className="recent-item glass"
                    key={item}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.07,
                    }}
                    whileHover={{
                      x: 5,
                    }}
                  >
                    <button
                      type="button"
                      className="recent-search-main"
                      onClick={() =>
                        useRecentSearch(item)
                      }
                    >
                      <Clock3 size={18} />

                      <span>
                        {item}
                      </span>
                    </button>

                    <button
                      type="button"
                      className="delete-recent-search"
                      onClick={() =>
                        deleteRecentSearch(item)
                      }
                      aria-label={`Delete ${item}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </motion.div>
                )
              )}
            </div>
          </motion.section>
        )}

      {/* EMPTY HISTORY */}

      {!searched &&
        recentSearches.length === 0 && (
          <motion.div
            className="empty-search-history glass"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <Clock3 size={34} />

            <h3>
              No recent searches
            </h3>

            <p>
              Search for your favourite songs
              or artists and they will appear
              here.
            </p>
          </motion.div>
        )}

      {/* LOADING */}

      {loading && (
        <div className="search-loading">
          <LoaderCircle
            className="loading-icon"
            size={42}
          />

          <p>
            Finding your music...
          </p>
        </div>
      )}

      {/* SEARCH RESULTS */}

      {searched &&
        !loading && (
          <motion.section
            className="search-section"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >
            <div className="section-heading">
              <div>
                <span>
                  SEARCH RESULTS
                </span>

                <h2>
                  Results for "{query}"
                </h2>
              </div>

              <TrendingUp
                size={22}
                color="var(--gold)"
              />
            </div>

            {error ? (
              <div className="no-results glass">
                <Music2 size={35} />

                <h3>
                  Something went wrong
                </h3>

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  className="retry-search"
                  onClick={() =>
                    handleSearch(query)
                  }
                >
                  Try Again
                </button>
              </div>
            ) : songs.length > 0 ? (
              <div className="youtube-results">
                {songs.map(
                  (song, index) => {
                    const isCurrentSong =
                      currentSong?.id ===
                      song.id;

                    const showPause =
                      isCurrentSong &&
                      isPlaying;

                    const isLiked =
                      likedSongs.some(
                        (item) =>
                          item.id ===
                          song.id
                      );

                    return (
                      <motion.div
                        className={`youtube-song glass ${
                          isCurrentSong
                            ? "active-song"
                            : ""
                        }`}
                        key={
                          song.id ||
                          `${song.title}-${index}`
                        }
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.05,
                        }}
                        whileHover={{
                          y: -4,
                        }}
                      >
                        <img
                          src={song.thumbnail}
                          alt={song.title}
                        />

                        <div className="youtube-song-info">
                          <h3>
                            {song.title}
                          </h3>

                          <p>
                            {song.artist ||
                              "Unknown Artist"}
                          </p>
                        </div>

                        <div className="youtube-song-actions">
                          <motion.button
                            type="button"
                            className={`song-like-button ${
                              isLiked
                                ? "liked"
                                : ""
                            }`}
                            onClick={() =>
                              handleToggleLike(
                                song
                              )
                            }
                            whileHover={{
                              scale: 1.1,
                            }}
                            whileTap={{
                              scale: 0.9,
                            }}
                            aria-label={
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
                          </motion.button>

                          <motion.button
                            type="button"
                            className="youtube-play"
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
                            {showPause ? (
                              <Pause
                                size={20}
                                fill="currentColor"
                              />
                            ) : (
                              <Play
                                size={20}
                                fill="currentColor"
                              />
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="no-results glass">
                <Music2 size={35} />

                <h3>
                  No songs found
                </h3>

                <p>
                  Try another song or artist.
                </p>
              </div>
            )}
          </motion.section>
        )}
    </motion.div>
  );
}

export default Search;
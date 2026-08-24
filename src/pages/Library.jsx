import { motion } from "framer-motion";
import {
  Heart,
  Clock3,
  ListMusic,
  ArrowRight,
  Music2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useLikedSongs } from "../context/useLikedSongs";
import { usePlaylists } from "../context/usePlaylists";

import "../styles/global.css";

function Library() {
  const navigate = useNavigate();

  const { likedSongs = [] } = useLikedSongs();
  const { playlists = [] } = usePlaylists();

  return (
    <motion.div
      className="library-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* HERO */}

      <section className="library-hero">
        <div className="library-hero-content">
          <motion.div
            className="library-label"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Music2 size={16} />

            YOUR MUSIC SPACE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Your <span>Library.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            All your saved music, favourite songs
            and playlists in one place.
          </motion.p>
        </div>

        <motion.div
          className="library-hero-icon"
          initial={{ scale: 0.7, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 16,
            delay: 0.15,
          }}
        >
          <Music2 size={70} />
        </motion.div>
      </section>


      {/* COLLECTION */}

      <section className="library-section">
        <div className="library-section-heading">
          <div>
            <span>YOUR COLLECTION</span>

            <h2>Music Library</h2>
          </div>
        </div>


        <div className="library-grid">

          {/* LIKED SONGS */}

          <motion.button
            type="button"
            className="library-card glass"
            onClick={() => navigate("/liked")}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="library-card-top">
              <div className="library-card-icon liked-icon">
                <Heart
                  size={30}
                  fill="currentColor"
                />
              </div>

              <ArrowRight
                size={21}
                className="library-arrow"
              />
            </div>

            <div className="library-card-content">
              <h3>Liked Songs</h3>

              <p>
                Songs that you have added
                to your favourites.
              </p>
            </div>

            <div className="library-count">
              <Music2 size={15} />

              {likedSongs.length}{" "}
              {likedSongs.length === 1
                ? "song"
                : "songs"}
            </div>
          </motion.button>


          {/* RECENTLY PLAYED */}

          <motion.button
            type="button"
            className="library-card glass"
            onClick={() => navigate("/")}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="library-card-top">
              <div className="library-card-icon">
                <Clock3 size={30} />
              </div>

              <ArrowRight
                size={21}
                className="library-arrow"
              />
            </div>

            <div className="library-card-content">
              <h3>Recently Played</h3>

              <p>
                Your recently played
                music will appear here.
              </p>
            </div>

            <div className="library-count">
              <Clock3 size={15} />

              Music history
            </div>
          </motion.button>


          {/* PLAYLISTS */}

          <motion.button
            type="button"
            className="library-card glass"
            onClick={() => navigate("/playlists")}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="library-card-top">
              <div className="library-card-icon">
                <ListMusic size={30} />
              </div>

              <ArrowRight
                size={21}
                className="library-arrow"
              />
            </div>

            <div className="library-card-content">
              <h3>Your Playlists</h3>

              <p>
                Create and manage your
                favourite playlists.
              </p>
            </div>

            <div className="library-count">
              <ListMusic size={15} />

              {playlists.length}{" "}
              {playlists.length === 1
                ? "playlist"
                : "playlists"}
            </div>
          </motion.button>

        </div>
      </section>
    </motion.div>
  );
}

export default Library;
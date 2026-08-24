import { motion } from "framer-motion";
import {
  Heart,
  SkipBack,
  Play,
  SkipForward,
  Volume2,
  Repeat2,
  Shuffle,
  ListMusic,
} from "lucide-react";

function MusicPlayer() {
  return (
    <motion.div
      className="music-player glass"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.2,
      }}
    >
      {/* Current Song */}
      <div className="current-song">
        <motion.div
          className="song-cover"
          animate={{
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        >
          🎵
        </motion.div>

        <div>
          <strong>No song playing</strong>
          <span>Select a song to begin</span>
        </div>

        <button className="player-icon">
          <Heart size={19} />
        </button>
      </div>

      {/* Controls */}
      <div className="player-center">
        <div className="player-controls">
          <button className="player-icon">
            <Shuffle size={18} />
          </button>

          <button className="player-icon">
            <SkipBack size={21} />
          </button>

          <motion.button
            className="main-play"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play size={22} fill="currentColor" />
          </motion.button>

          <button className="player-icon">
            <SkipForward size={21} />
          </button>

          <button className="player-icon">
            <Repeat2 size={18} />
          </button>
        </div>

        <div className="progress-row">
          <span>0:00</span>

          <div className="progress-bar">
            <div className="progress" />
          </div>

          <span>0:00</span>
        </div>
      </div>

      {/* Volume */}
      <div className="player-right">
        <button className="player-icon">
          <ListMusic size={19} />
        </button>

        <Volume2 size={19} />

        <input
          type="range"
          min="0"
          max="100"
          defaultValue="70"
        />
      </div>
    </motion.div>
  );
}

export default MusicPlayer;
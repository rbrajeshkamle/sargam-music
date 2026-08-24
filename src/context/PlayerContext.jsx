import {
  createContext,
  useEffect,
  useState,
} from "react";

export const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  // =========================
  // CURRENT SONG
  // =========================
  const [currentSong, setCurrentSong] = useState(() => {
    try {
      const savedSong = localStorage.getItem(
        "sargam_current_song"
      );

      return savedSong
        ? JSON.parse(savedSong)
        : null;
    } catch {
      return null;
    }
  });

  // =========================
  // PLAY / PAUSE
  // =========================
  const [isPlaying, setIsPlaying] = useState(false);

  // =========================
  // QUEUE
  // =========================
  const [queue, setQueue] = useState(() => {
    try {
      const savedQueue = localStorage.getItem(
        "sargam_queue"
      );

      const parsedQueue = savedQueue
        ? JSON.parse(savedQueue)
        : [];

      return Array.isArray(parsedQueue)
        ? parsedQueue
        : [];
    } catch {
      return [];
    }
  });

  // =========================
  // VOLUME
  // =========================
  const [volume, setVolume] = useState(() => {
    try {
      const savedVolume = Number(
        localStorage.getItem("sargam_volume")
      );

      return savedVolume >= 0 &&
        savedVolume <= 100
        ? savedVolume
        : 70;
    } catch {
      return 70;
    }
  });

  // =========================
  // SAVE CURRENT SONG
  // =========================
  useEffect(() => {
    if (currentSong) {
      localStorage.setItem(
        "sargam_current_song",
        JSON.stringify(currentSong)
      );
    } else {
      localStorage.removeItem(
        "sargam_current_song"
      );
    }
  }, [currentSong]);

  // =========================
  // SAVE QUEUE
  // =========================
  useEffect(() => {
    localStorage.setItem(
      "sargam_queue",
      JSON.stringify(queue)
    );
  }, [queue]);

  // =========================
  // SAVE VOLUME
  // =========================
  useEffect(() => {
    localStorage.setItem(
      "sargam_volume",
      String(volume)
    );
  }, [volume]);

  // =========================
  // PLAY SONG
  // =========================
  const playSong = (song, songs = []) => {
    if (!song) return;

    setCurrentSong(song);

    if (
      Array.isArray(songs) &&
      songs.length > 0
    ) {
      setQueue(songs);
    } else {
      setQueue((previousQueue) => {
        const exists = previousQueue.some(
          (item) => item.id === song.id
        );

        return exists
          ? previousQueue
          : [...previousQueue, song];
      });
    }

    setIsPlaying(true);
  };

  // =========================
  // PLAY / PAUSE
  // =========================
  const togglePlay = () => {
    if (!currentSong) return;

    setIsPlaying((previous) => !previous);
  };

  // =========================
  // NEXT SONG
  // =========================
  const playNext = () => {
    if (!currentSong || queue.length === 0) {
      return;
    }

    const currentIndex = queue.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + 1) % queue.length;

    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  };

  // =========================
  // PREVIOUS SONG
  // =========================
  const playPrevious = () => {
    if (!currentSong || queue.length === 0) {
      return;
    }

    const currentIndex = queue.findIndex(
      (song) => song.id === currentSong.id
    );

    const previousIndex =
      currentIndex <= 0
        ? queue.length - 1
        : currentIndex - 1;

    setCurrentSong(queue[previousIndex]);
    setIsPlaying(true);
  };

  // =========================
  // UPDATE VOLUME
  // =========================
  const updateVolume = (value) => {
    const newVolume = Number(value);

    if (Number.isNaN(newVolume)) return;

    const safeVolume = Math.max(
      0,
      Math.min(100, newVolume)
    );

    setVolume(safeVolume);
  };

  // =========================
  // CLEAR PLAYER
  // =========================
  const clearPlayer = () => {
    setCurrentSong(null);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        queue,
        volume,

        playSong,
        togglePlay,
        playNext,
        playPrevious,
        updateVolume,
        clearPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
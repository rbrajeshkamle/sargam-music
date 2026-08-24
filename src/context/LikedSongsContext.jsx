import { createContext, useEffect, useState } from "react";

export const LikedSongsContext = createContext(null);

export function LikedSongsProvider({ children }) {
  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      const savedSongs = localStorage.getItem("likedSongs");

      return savedSongs ? JSON.parse(savedSongs) : [];
    } catch (error) {
      console.error("Failed to load liked songs:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "likedSongs",
        JSON.stringify(likedSongs)
      );
    } catch (error) {
      console.error("Failed to save liked songs:", error);
    }
  }, [likedSongs]);

  const addLikedSong = (song) => {
    if (!song || !song.id) return;

    setLikedSongs((prevSongs) => {
      const alreadyExists = prevSongs.some(
        (item) => item.id === song.id
      );

      if (alreadyExists) {
        return prevSongs;
      }

      return [...prevSongs, song];
    });
  };

  const removeLikedSong = (songId) => {
    setLikedSongs((prevSongs) =>
      prevSongs.filter(
        (song) => song.id !== songId
      )
    );
  };

  const toggleLikedSong = (song) => {
    if (!song || !song.id) return;

    setLikedSongs((prevSongs) => {
      const alreadyExists = prevSongs.some(
        (item) => item.id === song.id
      );

      if (alreadyExists) {
        return prevSongs.filter(
          (item) => item.id !== song.id
        );
      }

      return [...prevSongs, song];
    });
  };

  const isLiked = (songId) => {
    return likedSongs.some(
      (song) => song.id === songId
    );
  };

  const value = {
    likedSongs,
    addLikedSong,
    removeLikedSong,
    toggleLikedSong,
    isLiked,
  };

  return (
    <LikedSongsContext.Provider value={value}>
      {children}
    </LikedSongsContext.Provider>
  );
}
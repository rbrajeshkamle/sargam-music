import {
  createContext,
  useEffect,
  useState,
} from "react";

export const PlaylistsContext = createContext(null);

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState(() => {
    try {
      const savedPlaylists =
        localStorage.getItem("playlists");

      const parsedPlaylists = savedPlaylists
        ? JSON.parse(savedPlaylists)
        : [];

      return Array.isArray(parsedPlaylists)
        ? parsedPlaylists
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "playlists",
      JSON.stringify(playlists)
    );
  }, [playlists]);

  const createPlaylist = (name) => {
    const trimmedName = name.trim();

    if (!trimmedName) return null;

    const newPlaylist = {
      id: Date.now().toString(),
      name: trimmedName,
      songs: [],
      createdAt: new Date().toISOString(),
    };

    setPlaylists((prev) => [
      ...prev,
      newPlaylist,
    ]);

    return newPlaylist;
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) =>
      prev.filter(
        (playlist) =>
          playlist.id !== playlistId
      )
    );
  };

  const addSongToPlaylist = (
    playlistId,
    song
  ) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) {
          return playlist;
        }

        const alreadyExists =
          playlist.songs.some(
            (item) => item.id === song.id
          );

        if (alreadyExists) {
          return playlist;
        }

        return {
          ...playlist,
          songs: [
            ...playlist.songs,
            song,
          ],
        };
      })
    );
  };

  const removeSongFromPlaylist = (
    playlistId,
    songId
  ) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) {
          return playlist;
        }

        return {
          ...playlist,
          songs: playlist.songs.filter(
            (song) => song.id !== songId
          ),
        };
      })
    );
  };

  return (
    <PlaylistsContext.Provider
      value={{
        playlists,
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
      }}
    >
      {children}
    </PlaylistsContext.Provider>
  );
}
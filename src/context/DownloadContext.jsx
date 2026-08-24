import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const DownloadContext = createContext(null);

export function DownloadProvider({ children }) {
  const [downloadedSongs, setDownloadedSongs] = useState(() => {
    try {
      const savedSongs = localStorage.getItem(
        "sargam_downloaded_songs"
      );

      return savedSongs
        ? JSON.parse(savedSongs)
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "sargam_downloaded_songs",
      JSON.stringify(downloadedSongs)
    );
  }, [downloadedSongs]);

  const isDownloaded = (songId) => {
    return downloadedSongs.some(
      (song) => song.id === songId
    );
  };

  const downloadSong = async (song) => {
    if (!song) return;

    if (!song.audioUrl) {
      console.error(
        "This song does not have an authorized audio URL."
      );

      return {
        success: false,
        message:
          "Offline download is not available for this song.",
      };
    }

    if (isDownloaded(song.id)) {
      return {
        success: false,
        message: "Song is already downloaded.",
      };
    }

    try {
      const response = await fetch(song.audioUrl);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();

      const audioUrl = URL.createObjectURL(blob);

      const downloadedSong = {
        ...song,
        offlineAudioUrl: audioUrl,
        downloadedAt: Date.now(),
      };

      setDownloadedSongs((previousSongs) => [
        ...previousSongs,
        downloadedSong,
      ]);

      return {
        success: true,
        message:
          "Song downloaded for offline listening.",
      };
    } catch (error) {
      console.error(
        "Download Error:",
        error
      );

      return {
        success: false,
        message:
          "Failed to download the song.",
      };
    }
  };

  const removeDownload = (songId) => {
    setDownloadedSongs((previousSongs) =>
      previousSongs.filter(
        (song) => song.id !== songId
      )
    );
  };

  const value = {
    downloadedSongs,
    downloadSong,
    removeDownload,
    isDownloaded,
  };

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
}

export default DownloadContext;
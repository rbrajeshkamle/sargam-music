import {
  useContext,
} from "react";

import DownloadContext from "./DownloadContext";

export function useDownloads() {
  const context =
    useContext(DownloadContext);

  if (!context) {
    throw new Error(
      "useDownloads must be used inside DownloadProvider"
    );
  }

  return context;
}
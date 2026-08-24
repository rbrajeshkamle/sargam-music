import { useContext } from "react";

import {
  PlaylistsContext,
} from "./PlaylistContext";

export function usePlaylists() {
  const context =
    useContext(PlaylistsContext);

  if (!context) {
    throw new Error(
      "usePlaylists must be used inside PlaylistProvider"
    );
  }

  return context;
}
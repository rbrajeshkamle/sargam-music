import { useContext } from "react";

import {
  LikedSongsContext,
} from "./LikedSongsContext";

export function useLikedSongs() {
  const context = useContext(LikedSongsContext);

  if (context === null) {
    throw new Error(
      "useLikedSongs must be used inside LikedSongsProvider"
    );
  }

  return context;
}
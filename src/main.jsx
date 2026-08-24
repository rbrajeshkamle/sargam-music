import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import App from "./App";
import "./index.css";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  PlayerProvider,
} from "./context/PlayerContext";

import {
  PlaylistProvider,
} from "./context/PlaylistContext";

import {
  LikedSongsProvider,
} from "./context/LikedSongsContext";

import {
  DownloadProvider,
} from "./context/DownloadContext";

registerSW({
  immediate: true,
});

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LikedSongsProvider>
          <PlaylistProvider>
            <DownloadProvider>
              <PlayerProvider>
                <App />
              </PlayerProvider>
            </DownloadProvider>
          </PlaylistProvider>
        </LikedSongsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import Playlists from "./pages/Playlists";
import PlaylistDetails from "./pages/PlaylistDetails";

import AppLayout from "./components/layout/AppLayout";

import { useAuth } from "./context/AuthContext";


function ProtectedRoute({ children }) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        Loading Sargam...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


function App() {
  return (
    <>
      <Routes>

        {/* =====================
            PUBLIC ROUTES
        ===================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =====================
            PROTECTED APP
        ===================== */}

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >

          {/* HOME */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* SEARCH */}
          <Route
            path="/search"
            element={<Search />}
          />

          {/* LIBRARY */}
          <Route
            path="/library"
            element={<Library />}
          />

          {/* LIKED SONGS */}
          <Route
            path="/liked"
            element={<LikedSongs />}
          />

          {/* PLAYLISTS */}
          <Route
            path="/playlists"
            element={<Playlists />}
          />

          {/* PLAYLIST DETAILS */}
          <Route
            path="/playlists/:playlistId"
            element={<PlaylistDetails />}
          />

        </Route>


        {/* =====================
            FALLBACK
        ===================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>


      {/* =====================
          TOAST
      ===================== */}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#171412",
            color: "#f5e6d3",
            border:
              "1px solid rgba(255,235,210,0.12)",
          },
        }}
      />
    </>
  );
}

export default App;
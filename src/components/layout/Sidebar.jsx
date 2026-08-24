import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  House,
  Search,
  Library,
  Heart,
  ListMusic,
  Music2,
  Plus,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    name: "Home",
    path: "/",
    icon: House,
  },
  {
    name: "Search",
    path: "/search",
    icon: Search,
  },
  {
    name: "Library",
    path: "/library",
    icon: Library,
  },
  {
    name: "Liked Songs",
    path: "/liked",
    icon: Heart,
  },
];

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <motion.aside
      className="sidebar glass"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
    >
      <div>
        <NavLink to="/" className="brand">
          <motion.div
            className="brand-icon"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            <Music2 size={23} />
          </motion.div>

          <div>
            <h1>SARGAM</h1>
            <span>Old Soul. Endless Music.</span>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="playlist-section">
          <p>YOUR PLAYLISTS</p>

          <button className="create-playlist">
            <Plus size={19} />
            Create Playlist
          </button>

          <NavLink
            to="/playlists"
            className="playlist-link"
          >
            <ListMusic size={18} />
            My Playlists
          </NavLink>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="user-info">
          <strong>{user?.name}</strong>
          <span>{user?.email}</span>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
          title="Logout"
        >
          <LogOut size={19} />
        </button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
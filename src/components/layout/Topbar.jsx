import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  User,
} from "lucide-react";

function Topbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <motion.header
      className="topbar"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="topbar-search glass">
        <Search size={20} />

        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="topbar-search-button"
          onClick={handleSearch}
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>

      <div className="topbar-actions">
        <button className="glass-button">
          <Bell size={20} />
        </button>

        <button className="glass-button">
          <User size={20} />
        </button>
      </div>
    </motion.header>
  );
}

export default Topbar;
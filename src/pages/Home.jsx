import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  Library,
  ArrowUpRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
  };

  const cards = [
    {
      title: "Discover Music",
      description:
        "Search and play songs from your favourite artists.",
      icon: Search,
      path: "/search",
    },
    {
      title: "Liked Songs",
      description:
        "Keep all the songs you love in one beautiful collection.",
      icon: Heart,
      path: "/liked",
    },
    {
      title: "Your Library",
      description:
        "Build your own music collection and playlists.",
      icon: Library,
      path: "/library",
    },
  ];

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* HERO */}

      <section className="home-hero">
        <span className="home-label">
          🎵 WELCOME TO SARGAM
        </span>

        <h1>
          {getGreeting()}<span>{" "}{user?.name || "Brajesh"}</span>
        </h1>

        <p>
          Discover music that matches your soul.
          <br />
          Your favourite songs are waiting for you.
        </p>
      </section>

      {/* DISCOVER */}

      <section className="home-section">
        <div className="section-heading">
          <div>
            <span>DISCOVER</span>

            <h2>Made for you</h2>
          </div>
        </div>

        <div className="home-grid">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.button
                type="button"
                className="home-card glass"
                key={card.title}
                onClick={() =>
                  navigate(card.path)
                }
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                }}
                whileHover={{
                  y: -7,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <div className="home-card-top">
                  <div className="home-card-icon">
                    <Icon size={28} />
                  </div>

                  <ArrowUpRight
                    className="home-card-arrow"
                    size={20}
                  />
                </div>

                <div className="home-card-content">
                  <h3>
                    {card.title}
                  </h3>

                  <p>
                    {card.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}

export default Home;
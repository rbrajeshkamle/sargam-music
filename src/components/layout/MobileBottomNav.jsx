import { Home, Search, Heart, Library } from "lucide-react";
import { NavLink } from "react-router-dom";

function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" className="mobile-nav-item">
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/search" className="mobile-nav-item">
        <Search size={22} />
        <span>Search</span>
      </NavLink>

      <NavLink to="/liked" className="mobile-nav-item">
        <Heart size={22} />
        <span>Liked</span>
      </NavLink>

      <NavLink to="/library" className="mobile-nav-item">
        <Library size={22} />
        <span>Library</span>
      </NavLink>
    </nav>
  );
}

export default MobileBottomNav;
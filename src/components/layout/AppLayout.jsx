import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Player from "../player/Player";
import mobileBottomNav from "./MobileBottomNav";

function AppLayout() {
  return (
    <div className="app-layout">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="main-area">
        <Topbar />

        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {/* BOTTOM MUSIC PLAYER */}
      <Player />

      <mobileBottomNav />

    </div>
  );
}

export default AppLayout;
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import logo from "../../assets/images/logo.svg";
import backIcon from "../../assets/images/back-icon.svg";
import searchIcon from "../../assets/images/search-icon.svg";
import notificationIcon from "../../assets/images/bell-icon.svg";
import menuIcon from "../../assets/images/menu-icon.svg";

import TopBarMenu from "./top_bar_components/TopBarMenu";
import Notifications from "./top_bar_components/Notifications";

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isHome = location.pathname === "/home";

  return (
    <>
      {/* Top Bar */}
      <div className="flex flex-row justify-between bg-white px-s fixed top-0 left-0 w-full h-[60px] items-center z-50">
        {isHome ? (
          <img
            src={logo}
            alt="logo"
            className="h-[25px] w-auto cursor-default"
          />
        ) : (
          <img
            src={backIcon}
            alt="back"
            className="h-[25px] w-auto cursor-pointer"
            onClick={() => navigate(-1)}
          />
        )}

        <div className="flex flex-row gap-s">
          <img
            src={searchIcon}
            alt="search"
            className="h-[20px] w-auto cursor-pointer"
          />
          <img
            src={notificationIcon}
            alt="notifications"
            className="h-[20px] w-auto cursor-pointer"
            onClick={() => setNotificationsOpen(true)}
          />
          <img
            src={menuIcon}
            alt="menu"
            className="h-[20px] w-auto cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </div>

      {/* Sliding Menu */}
      <TopBarMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Notifications
        notificationsOpen={notificationsOpen}
        setNotificationsOpen={setNotificationsOpen}
      />
    </>
  );
}

export default TopBar;

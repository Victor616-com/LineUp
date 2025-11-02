import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import backIcon from "../../assets/images/back-icon.svg";
import searchIcon from "../../assets/images/search-icon.svg";
import notificationIcon from "../../assets/images/bell-icon.svg";
import menuIcon from "../../assets/images/menu-icon.svg";
import closeIcon from "../../assets/images/x-icon.svg";
import logo from "../../assets/images/logo.svg";

import lineProIcon from "../../assets/images/linePro-icon.svg";
import saveIcon from "../../assets/images/save-icon.svg";
import insightsIcon from "../../assets/images/insights-icon.svg";
import inviteFriendsIcon from "../../assets/images/inviteFriends-icon.svg";
import rateIcon from "../../assets/images/star-icon.svg";
import settingsIcon from "../../assets/images/settings-icon.svg";
import help from "../../assets/images/help-icon.svg";
import logOutIcon from "../../assets/images/log-out-icon.svg";
import { UserAuth } from "../context/AuthContext";

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === "/home";

  const { session, signOut } = UserAuth();
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

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
          />
          <img
            src={menuIcon}
            alt="menu"
            className="h-[20px] w-auto cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </div>

      {/*Sliding Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white shadow-xl z-[100] px-s transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button */}
        <div className="flex justify-center items-center w-full h-[60px] relative ">
          <img
            src={closeIcon}
            alt="close-menu"
            className="h-[11px] w-auto absolute left-0 cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
          <p className="text-m ">Menu</p>
        </div>

        {/* Menu links */}
        <div className="flex flex-col gap-l mt-[15px]">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-xs">
              <img src={lineProIcon} alt="Line Up Pro" />
              <p className="text-m">Get Pro lineUp</p>
            </div>
            <img src={backIcon} alt="follow link" className="rotate-180" />
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-xs">
              <img src={saveIcon} alt="save" />
              <p className="text-m">Save</p>
            </div>
            <img src={backIcon} alt="follow link" className="rotate-180" />
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-xs">
              <img src={insightsIcon} alt="insights" />
              <p className="text-m">Insights</p>
            </div>
            <img src={backIcon} alt="follow link" className="rotate-180" />
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-xs">
              <img src={inviteFriendsIcon} alt="invite firends" />
              <p className="text-m">Invite Friends</p>
            </div>
            <img src={backIcon} alt="follow link" className="rotate-180" />
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-xs">
              <img src={rateIcon} alt="star" />
              <p className="text-m">Rate the app</p>
            </div>
            <img src={backIcon} alt="follow link" className="rotate-180" />
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-xs">
              <img src={settingsIcon} alt="settings" />
              <p className="text-m">Settings</p>
            </div>
            <img src={backIcon} alt="follow link" className="rotate-180" />
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-xs">
              <img src={help} alt="help" />
              <p className="text-m">Help</p>
            </div>
            <img src={backIcon} alt="follow link" className="rotate-180" />
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-xs">
              <img src={logOutIcon} alt="log out" />
              <p onClick={handleSignOut} className="text-m">
                Log out
              </p>
            </div>
            <img src={backIcon} alt="follow link" className="rotate-180" />
          </div>
        </div>
      </div>
    </>
  );
}

export default TopBar;

import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import ChatsBox from "../components/chats_components/ChatsBox";

import searchIcon from "../../assets/images/search-icon.svg";
import writeMessageIcon from "../../assets/images/pencil.svg";

function ChatsPage() {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="w-full flex h-screen justify-center padding-m">
      <div className="border-[1px] border-yellow max-w-6xl w-full rounded-lg padding-m">
        <div className="flex justify-between h-20">
          {/* Title box */}
          <div className="text-heading1">Messages</div>
          <div className="flex">
            <img
              src={searchIcon}
              alt="search"
              className="h-[20px] w-auto cursor-pointer"
            />
            <img
              src={writeMessageIcon}
              alt="write message"
              className="h-[20px] w-auto cursor-pointer"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-row justify-around items-center mt-[20px]">
          <button
            onClick={() => setActiveTab("chats")}
            className={`w-full h-[50px] rounded-tl-medium bg-white text-m transition-all duration-200 ${
              activeTab === "chats" ? "text-black" : "text-gray-500"
            }`}
          >
            Chats
          </button>
          <div className="w-[1px] bg-lightGray h-[20px] absolute"></div>
          <button
            onClick={() => setActiveTab("groups")}
            className={`w-full h-[50px] rounded-tr-medium bg-white transition-all duration-200 ${
              activeTab === "groups" ? " text-black" : "text-gray-500"
            }`}
          >
            Groups
          </button>
        </div>

        {/* Tab Content */}
        <div className="px-m py-s bg-white">
          {activeTab === "chats" ? (
            <ChatsBox />
          ) : (
            <p className="text-m">This is the Groups section content.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatsPage;

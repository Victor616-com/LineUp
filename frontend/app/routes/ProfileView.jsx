import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import profileImg from "../../assets/images/profile-placeholder.png";
import ProfileAbout from "../components/ProfileAbout";
import menu from "../../assets/images/menu-dots.svg";
import { supabase } from "../supabaseClient";
import ProfileNotes from "../components/ProfileNotes";
import { UserAuth } from "../context/AuthContext";
import StartChatButton from "../components/chats_components/StartChatButton";

const ProfileView = () => {
  const { session } = UserAuth();
  const { id } = useParams(); // ✅ The profile user ID from URL
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [notesCount, setNoteCount] = useState(0);
  // ✅ Fetch profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url, bio, about_me, looking_for, genres ")
        .eq("id", id)
        .single();

      if (error) console.error("Error loading profile:", error);
      else setProfile(data);
    };

    fetchProfile();
  }, [id]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id || null);
    };
    getUser();
  }, []);

  // Connections
  const handleConnect = async () => {
    if (!session?.user) return alert("You must be logged in to connect.");

    const fromUser = session.user.id; // current user
    const toUser = id; // the profile being viewed

    if (fromUser === toUser) return alert("You cannot connect to yourself.");

    // Check if a connection already exists
    const { data: existing } = await supabase
      .from("connections")
      .select("id, status")
      .eq("from_user", fromUser)
      .eq("to_user", toUser)
      .single();

    if (existing) {
      if (existing.status === "pending") return alert("Request already sent.");
      if (existing.status === "accepted")
        return alert("You are already connected.");
    }

    // Insert connection request
    const { error } = await supabase.from("connections").insert([
      {
        from_user: fromUser,
        to_user: toUser,
        status: "pending",
      },
    ]);

    if (error) console.error(error);
    else setConnectionStatus("pending");
  };

  //Connection status
  useEffect(() => {
    const fetchConnectionStatus = async () => {
      if (!currentUserId || currentUserId === id) return;

      const { data } = await supabase
        .from("connections")
        .select("status")
        .or(`from_user.eq.${currentUserId},to_user.eq.${id}`)
        .single();

      setConnectionStatus(data?.status || null);
    };

    fetchConnectionStatus();
  }, [currentUserId, id]);

  //gets the number of connections a user has and the number of notes he made
  useEffect(() => {
    const fetchCounts = async () => {
      // Count accepted connections
      const { count: connectionsCount, error: connectionError } = await supabase
        .from("connections")
        .select("id", { count: "exact", head: true })
        .or(`from_user.eq.${id},to_user.eq.${id}`)
        .eq("status", "accepted");

      if (!connectionError) setConnectionCount(connectionsCount || 0);

      // Count notes made by this user
      const { count: notesCount, error: notesError } = await supabase
        .from("notes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", id);

      if (!notesError) setNoteCount(notesCount || 0);
    };

    fetchCounts();
  }, [id]);

  if (!profile)
    return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="">
      <div className="relative flex flex-col items-center justify-center gap-s mt-[10px] bg-profileColor1 py-m rounded-medium mx-[10px]">
        {/* Menu Button */}
        <img
          onClick={() => setShowMenu((prev) => !prev)}
          className="absolute right-[30px] top-[30px] scale-[1.2] cursor-pointer"
          src={menu}
          alt="menu"
        />

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-[30px] top-[50px] z-50 bg-white"
          >
            {/* Show Edit Profile only if this is YOUR profile */}
            {currentUserId === id && (
              <Link to={`/profile/${id}/edit`}>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  Edit Profile
                </button>
              </Link>
            )}
            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
              Share Profile
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
              Archived
            </button>
          </div>
        )}

        {/* Profile Header Content */}
        <div className="flex flex-row items-center justify-between w-full">
          {/* Connections */}
          <div className="flex-1 flex flex-col items-center text-center text-white">
            <p className="text-m text-white">{connectionCount}</p>
            <p className="text-xs text-lightGray">Connections</p>
          </div>
          {/* Profile Image */}
          <img
            className="w-[150px] h-[150px] rounded-full object-cover ring-1 ring-white"
            src={
              profile?.avatar_url
                ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${profile.avatar_url}`
                : profileImg
            }
            alt="profile"
          />
          {/* Notes */}
          <div className="flex-1 flex flex-col items-center text-center text-white">
            <p className="text-m text-white">{notesCount}</p>
            <p className="text-xs text-lightGray">Notes</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <p className="text-l text-white">{profile.name} </p>
          <p className="text-s text-lightGray">{profile.bio}</p>
        </div>

        <div className="flex justify-space-between gap-m">
          <button
            onClick={handleConnect}
            className="bg-yellow px-m py-xxs rounded-medium cursor-pointer"
            disabled={
              connectionStatus === "pending" || connectionStatus === "accepted"
            }
          >
            {connectionStatus === "accepted"
              ? "Connected"
              : connectionStatus === "pending"
                ? "Pending"
                : "Connect"}
          </button>
          <StartChatButton targetUserId={id} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-row justify-around items-center mt-[20px]">
        <button
          onClick={() => setActiveTab("about")}
          className={`w-full h-[50px] rounded-tl-medium bg-white text-m transition-all duration-200 ${
            activeTab === "about" ? "text-black" : "text-gray-500"
          }`}
        >
          About
        </button>
        <div className="w-[1px] bg-lightGray h-[20px] absolute"></div>
        <button
          onClick={() => setActiveTab("notes")}
          className={`w-full h-[50px] rounded-tr-medium bg-white transition-all duration-200 ${
            activeTab === "notes" ? " text-black" : "text-gray-500"
          }`}
        >
          Notes
        </button>
      </div>

      {/* Tab Content */}
      <div className=" py-s bg-white">
        {activeTab === "about" ? (
          <ProfileAbout profile={profile} />
        ) : (
          <ProfileNotes userId={id} />
        )}
      </div>
    </div>
  );
};

export default ProfileView;

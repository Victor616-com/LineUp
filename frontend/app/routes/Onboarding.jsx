import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import logo from "../../assets/images/logo-purple.svg";

function Onboarding() {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000); // 3s = match animation duration

    return () => clearTimeout(timer);
  }, []);

  if (showContent) {
    return (
      <div className="w-full h-dvh flex flex-col gap-l justify-center items-center bg-white">
        <h1 className="text-2xl">Welcome to Lineup 🎶</h1>
        <button
          className="bg-yellow w-fit px-xs py-xxs rounded-medium cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Get started
        </button>
      </div>
    );
  }

  return (
    <div className="onboarding-screen w-full h-dvh flex justify-center items-center bg-yellow">
      <img src={logo} alt="lineup logo" className="logo-anim" />
    </div>
  );
}

export default Onboarding;

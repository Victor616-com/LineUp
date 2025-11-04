import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import logo from "../../assets/images/logo-purple.svg";

function Onboarding() {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Play splash animation for all users
    const timer = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");

      if (hasSeenOnboarding) {
        // Returning user → go to signin
        navigate("/signin");
      } else {
        // First-time user → show welcome screen
        setShowContent(true);
      }
    }, 5000); // animation duration + optional hold

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGetStarted = () => {
    // Save onboarding completion so splash won't repeat
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/signup");
  };

  //This has to be changed to show the app features
  if (showContent) {
    return (
      <div className="w-full h-dvh flex flex-col gap-l justify-center items-center bg-white">
        <h1 className="text-2xl">Welcome to Lineup 🎶</h1>
        <button
          className="bg-yellow w-fit px-xs py-xxs rounded-medium cursor-pointer"
          onClick={handleGetStarted}
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

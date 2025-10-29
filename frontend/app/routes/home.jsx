"use client";
import { useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Home() {
  const { session, signOut } = UserAuth();
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  // Sign out function
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!session) return;
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();
      setProfile(data);
      console.log("Loaded profile:", data);
    };
    loadProfile();
  }, [session]);

  return (
    <PrivateRoute>
      <main className="font-extrabold text-m">
        <h1>Home</h1>
        <h2>Welcome, {profile?.username} 🎉</h2>
        <p onClick={handleSignOut} className="text-blue-600 cursor-pointer">
          Sign out
        </p>
      </main>
    </PrivateRoute>
  );
}

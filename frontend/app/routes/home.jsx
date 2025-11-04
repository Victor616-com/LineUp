"use client";
import { Link, useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Home() {
  const { session, signOut } = UserAuth();
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!session) return;
      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", session.user.id)
        .single();
      setProfile(data);
      console.log("Loaded profile:", data);
    };
    loadProfile();
  }, [session]);

  return (
    <PrivateRoute>
      <main className="font-extrabold text-m px-s flex flex-col gap-s">
        <h1>Home</h1>
        <h2>Welcome, {profile?.name} 🎉</h2>

        {session?.user && (
          <div className="flex flex-col gap-s">
            <Link to={`/profile/${session.user.id}`} className="text-blue-500">
              My Profile
            </Link>
            <Link to={`/create`} className="text-blue-500 ml-s">
              Create Note
            </Link>
          </div>
        )}
      </main>
    </PrivateRoute>
  );
}

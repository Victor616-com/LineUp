import React, { useState, useEffect } from "react";
import profilePic from "../../assets/images/profile-placeholder.png";
import TagSelector from "../components/NoteTagSelector";
import NoteInputField from "../components/NoteInputField";
import AddMediaBtn from "../components/AddMediaBtn";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";

function CreatePage() {
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const [profile, setProfile] = useState(null);
  const { session } = UserAuth(); // current session

  // Fetch user profile from profiles table
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return; // guard

      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url, bio, about_me, looking_for, genres")
        .eq("id", session.user.id)
        .single();

      if (error) console.error("Error loading profile:", error);
      else setProfile(data);
    };

    fetchProfile();
  }, [session]);

  const handlePost = async () => {
    if (!session) {
      alert("You must be logged in to post!");
      return;
    }

    let media_url = null;
    if (media) {
      const fileName = `${Date.now()}-${media.name}`;
      const { data, error } = await supabase.storage
        .from("notes_media")
        .upload(fileName, media);

      if (error) console.error("Upload error:", error);
      else {
        media_url = supabase.storage.from("notes_media").getPublicUrl(fileName)
          .data.publicUrl;
      }
    }

    const { error } = await supabase.from("notes").insert([
      {
        title,
        description,
        media_url,
        tags: tags.length > 0 ? tags : null, // make sure it's null or array
        user_id: session.user.id,
      },
    ]);

    if (error) console.error("Insert error:", error);
    else {
      alert("Note created!");
      setTitle("");
      setDescription("");
      setMedia(null);
      setTags([]);
    }
  };

  return (
    <div className="px-s flex flex-col gap-[25px] w-full">
      <div className="flex flex-row gap-xs items-center w-full">
        <img
          className="w-10 h-10 rounded-full object-cover ring-1 ring-white"
          src={
            profile?.avatar_url
              ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${profile.avatar_url}`
              : profilePic
          }
          alt="profile"
        />
        <p className="text-m">{profile?.name || "Profile Name"}</p>
      </div>

      <TagSelector onSave={(updatedTags) => setTags(updatedTags)} />

      <NoteInputField
        value={title}
        onChange={setTitle}
        placeholder="Write a title"
      />

      <AddMediaBtn media={setMedia} />

      <NoteInputField
        as="textarea"
        value={description}
        onChange={setDescription}
        placeholder="Write your post..."
      />

      <button
        onClick={handlePost}
        className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded-lg"
      >
        Post
      </button>
    </div>
  );
}

export default CreatePage;

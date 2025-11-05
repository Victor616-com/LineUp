import React from "react";
import profilePic from "../../assets/images/profile-placeholder.png";

const menu = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="18" cy="12" r="1" fill="#1E1E1E" />
    <circle cx="12" cy="12" r="1" fill="#1E1E1E" />
    <circle cx="6" cy="12" r="1" fill="#1E1E1E" />
  </svg>
);

function Note({ note }) {
  return (
    <div className="flex flex-col gap-s border-b border-gray-200 py-5">
      <div className="flex flex-row justify-between items-center px-xs">
        <div className="flex flex-row gap-xs">
          <div className="flex flex-row gap-xxs items-center">
            <img
              className="w-6 h-6 rounded-full object-cover ring-1 ring-white"
              src={
                note.avatar_url
                  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${note.avatar_url}`
                  : profilePic
              }
              alt="profile-image"
            />
            <p className="text-s">{note.name || "Profile Name"}</p>
          </div>
          <div className="flex flex-row gap-xxs items-center">
            {note.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs text-[#55555] px-xxs py-xxxs rounded-full border border-[#55555]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {menu}
      </div>

      <h2 className="text-heading3 px-xs">{note.title}</h2>

      {note.media_url && (
        <img
          src={note.media_url}
          alt="note media"
          className="w-full h-auto rounded-small"
        />
      )}

      <p className="text-m wrap-break-word w-full px-xs">{note.description}</p>
    </div>
  );
}

export default Note;

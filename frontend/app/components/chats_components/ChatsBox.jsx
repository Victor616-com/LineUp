import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { ChatsPreview } from "./ChatsPreview";
import { useThreadsPreview } from "../../hooks/useThreadsPreview";

export default function ChatsBox() {
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get logged-in user
  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!ignore) setCurrentUserId(error ? null : (data?.user?.id ?? null));
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // Only fetch when we know the user
  const { threads, loading } = useThreadsPreview(currentUserId);

  if (!currentUserId)
    return <div className="p-4 text-sm text-gray-500">Authenticating…</div>;
  if (loading)
    return <div className="p-4 text-sm text-gray-500">Loading chats…</div>;

  // Map RPC rows → ChatsPreview shape
  const adaptedThreads = (threads || []).map((row) => ({
    id: row.thread_id,
    title: row.preview_title,
    updatedAt: row.last_time,
    messages: row.last_time
      ? [
          {
            id: "last",
            text: row.last_text,
            senderId: null, // don't put a name here; it's an ID field
            createdAt: row.last_time,
          },
        ]
      : [],
    _unread: row.unread_count,
    _lastSenderName: row.last_sender_name,
    _lastSenderAvatar: row.last_sender_avatar,
  }));

  return (
    <div className="p-6">
      <ChatsPreview
        threads={adaptedThreads}
        currentUserId={currentUserId}
        usersMap={{}} // not needed when using _lastSenderName/_lastSenderAvatar
        onOpenThread={(t) => console.log("open thread:", t.id)}
      />
    </div>
  );
}

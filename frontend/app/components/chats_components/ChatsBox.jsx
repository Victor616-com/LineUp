import React from "react";
import { supabase } from "../../supabaseClient";
import { ChatsPreview } from "./ChatsPreview";
import { useThreadsPreview } from "../../hooks/useThreadsPreview";

function ChatsBox({ currentUserId }) {
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get logged-in user
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id || null);
    }
    loadUser();
  }, []);

  // Fetch chats only when we know who the user is
  const { threads, loading } = useThreadsPreview(currentUserId);

  // Loading states
  if (!currentUserId) return <div>Authenticating...</div>;
  if (loading) return <div>Loading chats...</div>;

  // Transform RPC result into the shape your ChatsPreview expects
  const adaptedThreads = threads.map((row) => ({
    id: row.thread_id,
    title: row.preview_title,
    updatedAt: row.last_time,
    messages: row.last_time
      ? [
          {
            id: "last",
            text: row.last_text,
            senderId: row.last_sender_name, // because we are showing a preview
            createdAt: row.last_time,
          },
        ]
      : [],
    _unread: row.unread_count,
    _lastSenderName: row.last_sender_name,
    _lastSenderAvatar: row.last_sender_avatar,
  }));

  return (
    <ChatsPreview
      threads={adaptedThreads}
      currentUserId={currentUserId}
      usersMap={{}} // not needed now
      onOpenThread={(t) => console.log("open thread:", t.id)}
    />
  );
}

export default ChatsBox;

import React from "react";

/**
 * ChatsPreview — conversation list with unread badges and last-message preview.
 *
 * Replace the in-memory `mockThreads`/`mockUsers` with your Supabase queries later.
 */

// ------- Types (keep simple; switch to your real types later) -------
/**
 * A participant in a thread
 */
const Roles = {
  MEMBER: "member",
  ADMIN: "admin",
};

/**
 * Thread shape with nested data to keep the demo self-contained.
 * In production you'll typically join across tables instead.
 */

// Mock Users Map (id -> user basics)
export const mockUsers = {
  u1: { id: "u1", name: "Sveta" },
  u2: { id: "u2", name: "Alex" },
  u3: { id: "u3", name: "Maja" },
  u4: { id: "u4", name: "Bot" },
};

// Demo dataset (threads with participants, messages, messageStatus)
export const mockThreads = [
  {
    id: "t1",
    title: null, // will be derived from participants
    createdBy: "u1",
    updatedAt: "2025-11-05T10:20:00Z",
    participants: [
      { userId: "u1", role: Roles.ADMIN, joinedAt: "2025-11-01T09:00:00Z" },
      { userId: "u2", role: Roles.MEMBER, joinedAt: "2025-11-01T09:05:00Z" },
    ],
    messages: [
      {
        id: "m1",
        threadId: "t1",
        senderId: "u1",
        text: "Kickoff!",
        createdAt: "2025-11-05T10:00:00Z",
      },
      {
        id: "m2",
        threadId: "t1",
        senderId: "u2",
        text: "On it.",
        createdAt: "2025-11-05T10:20:00Z",
      },
    ],
    messageStatus: [
      {
        messageId: "m2",
        userId: "u1",
        status: "read",
        updatedAt: "2025-11-05T10:21:00Z",
      },
      {
        messageId: "m2",
        userId: "u2",
        status: "read",
        updatedAt: "2025-11-05T10:20:10Z",
      },
    ],
  },
  {
    id: "t2",
    title: "Design Handoff",
    createdBy: "u3",
    updatedAt: "2025-11-05T08:05:00Z",
    participants: [
      { userId: "u1", role: Roles.MEMBER, joinedAt: "2025-11-04T08:00:00Z" },
      { userId: "u3", role: Roles.ADMIN, joinedAt: "2025-11-04T08:00:00Z" },
      { userId: "u2", role: Roles.MEMBER, joinedAt: "2025-11-04T08:00:00Z" },
    ],
    messages: [
      {
        id: "m3",
        threadId: "t2",
        senderId: "u3",
        text: "Pushed latest Figma.",
        createdAt: "2025-11-05T08:00:00Z",
      },
      {
        id: "m4",
        threadId: "t2",
        senderId: "u2",
        text: "Looks good!",
        createdAt: "2025-11-05T08:05:00Z",
      },
    ],
    messageStatus: [
      {
        messageId: "m3",
        userId: "u1",
        status: "delivered",
        updatedAt: "2025-11-05T08:01:00Z",
      },
      {
        messageId: "m4",
        userId: "u1",
        status: "delivered",
        updatedAt: "2025-11-05T08:06:00Z",
      },
      {
        messageId: "m3",
        userId: "u2",
        status: "read",
        updatedAt: "2025-11-05T08:01:00Z",
      },
      {
        messageId: "m4",
        userId: "u2",
        status: "read",
        updatedAt: "2025-11-05T08:06:00Z",
      },
      {
        messageId: "m3",
        userId: "u3",
        status: "read",
        updatedAt: "2025-11-05T08:00:10Z",
      },
      {
        messageId: "m4",
        userId: "u3",
        status: "read",
        updatedAt: "2025-11-05T08:05:10Z",
      },
    ],
  },
  {
    id: "t3",
    title: null, // DM with the bot
    createdBy: "u4",
    updatedAt: "2025-11-05T06:30:00Z",
    participants: [
      { userId: "u1", role: Roles.MEMBER, joinedAt: "2025-11-05T06:00:00Z" },
      { userId: "u4", role: Roles.ADMIN, joinedAt: "2025-11-05T06:00:00Z" },
    ],
    messages: [
      {
        id: "m5",
        threadId: "t3",
        senderId: "u1",
        text: "Remind me at 3pm.",
        createdAt: "2025-11-05T06:25:00Z",
      },
      {
        id: "m6",
        threadId: "t3",
        senderId: "u4",
        text: "Okay, set!",
        createdAt: "2025-11-05T06:30:00Z",
      },
    ],
    messageStatus: [
      {
        messageId: "m6",
        userId: "u1",
        status: "delivered",
        updatedAt: "2025-11-05T06:31:00Z",
      },
      {
        messageId: "m6",
        userId: "u4",
        status: "read",
        updatedAt: "2025-11-05T06:30:10Z",
      },
    ],
  },
];

// ------- Helpers -------
function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return d.toLocaleDateString();
}

function otherParticipants(thread, currentUserId) {
  return thread.participants
    .map((p) => p.userId)
    .filter((uid) => uid !== currentUserId);
}

export function deriveTitle(thread, currentUserId, usersMap) {
  if (thread.title && thread.title.trim().length > 0) return thread.title;
  const others = otherParticipants(thread, currentUserId).map(
    (uid) => usersMap[uid]?.name || uid,
  );
  if (others.length === 0) return "(Empty)";
  if (others.length === 1) return others[0];
  if (others.length === 2) return `${others[0]} & ${others[1]}`;
  return `${others[0]}, ${others[1]} +${others.length - 2}`;
}

function lastMessage(thread) {
  if (!thread.messages?.length) return null;
  // messages are small; safe to sort here. In prod, query already ordered by created_at desc limit 1.
  return [...thread.messages]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .at(-1);
}

function unreadCount(thread, currentUserId) {
  // Count messages not marked read for current user and not sent by current user
  const statuses = thread.messageStatus || [];
  const isReadBy = (mid) =>
    statuses.some(
      (s) =>
        s.messageId === mid &&
        s.userId === currentUserId &&
        s.status === "read",
    );
  return thread.messages.filter(
    (m) => m.senderId !== currentUserId && !isReadBy(m.id),
  ).length;
}

function initialsFor(title) {
  const parts = title.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Limit preview to ~50 chars (like most messengers)
function previewText(text = "", limit = 50) {
  if (text.length <= limit) return text;
  return text.slice(0, limit - 1) + "…";
}

// ------- UI Components -------
function ThreadItem({ thread, currentUserId, usersMap, onOpen }) {
  const last = lastMessage(thread);
  const title = deriveTitle(thread, currentUserId, usersMap);
  const unreadCountForUser = unreadCount(thread, currentUserId);
  const isUnread = unreadCountForUser > 0 && last?.senderId !== currentUserId;
  const senderName = last?.senderId
    ? usersMap[last.senderId]?.name || last.senderId
    : "";

  return (
    <button
      onClick={() => onOpen?.(thread)}
      className={`w-full text-left group`}
    >
      <div className="w-full flex items-start gap-3 p-4 rounded-2xl border bg-white shadow-sm hover:shadow transition">
        {/* Avatar */}
        <div className="flex-none w-10 h-10 rounded-2xl bg-gray-200 grid place-items-center text-sm font-semibold">
          {initialsFor(senderName || title)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <div
              className={`truncate ${isUnread ? "font-semibold" : "font-medium"}`}
            >
              {senderName || title}
            </div>
            <div className="ml-auto text-xs text-gray-500 whitespace-nowrap">
              {formatTime(last?.createdAt)}
            </div>
          </div>
          <div
            className={`text-sm truncate ${isUnread ? "font-semibold" : "text-gray-600"}`}
          >
            {previewText(last?.text || "Start the conversation", 50)}
          </div>
        </div>

        {/* Unread badge */}
        {unreadCountForUser > 0 && (
          <div className="flex-none text-xs px-2 py-1 rounded-full bg-black text-white self-start">
            {unreadCountForUser}
          </div>
        )}
      </div>
    </button>
  );
}

/**
 * ChatsPreview props
 * - threads: array of threads
 * - currentUserId: the logged-in user id
 * - onOpenThread: callback(thread) when clicked
 */
export function ChatsPreview({
  threads,
  currentUserId,
  usersMap = {},
  onOpenThread,
}) {
  const sorted = [...(threads || [])].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <div className="w-full max-w-md mx-auto p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">Chats</h2>
        <span className="text-xs text-gray-500">
          {sorted.length} thread{sorted.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="space-y-2">
        {sorted.map((t) => (
          <ThreadItem
            key={t.id}
            thread={t}
            currentUserId={currentUserId}
            usersMap={usersMap}
            onOpen={onOpenThread}
          />
        ))}
      </div>
    </div>
  );
}

// ------- Demo wrapper for quick preview in this canvas -------
export default function App() {
  const handleOpen = (thread) => {
    alert(`Open thread: ${deriveTitle(thread, "u1", mockUsers)}`);
  };
  return (
    <div className="min-h-screen bg-white p-6">
      <ChatsPreview
        threads={mockThreads}
        currentUserId="u1"
        usersMap={mockUsers}
        onOpenThread={handleOpen}
      />
    </div>
  );
}

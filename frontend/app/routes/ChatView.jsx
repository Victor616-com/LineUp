import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../supabaseClient";

// --- config ---
const PAGE_SIZE = 30;

// --- helpers ---
function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function fmtDay(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function sameDay(a, b) {
  const da = new Date(a),
    db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}
function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// --- message bubble ---
function Bubble({ mine, msg, name, avatarUrl }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      {!mine && (
        <div className="mr-2">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-200 grid place-items-center text-[10px] font-semibold text-gray-700">
              {initials(name)}
            </div>
          )}
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-black text-white" : "bg-white border"}`}
      >
        {/* group header (sender name) only for others; shown by group container, not here */}
        <div>{msg.text}</div>
        <div
          className={`text-[10px] mt-1 ${mine ? "opacity-80" : "text-gray-500"}`}
        >
          {fmtTime(msg.created_at)}
        </div>
      </div>
    </div>
  );
}

// --- page ---
export default function ChatView() {
  const { threadId } = useParams();
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]); // ascending by created_at
  const [oldestLoadedAt, setOldestLoadedAt] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState("");
  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const isLoadingMoreRef = useRef(false);

  // auth
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setMe(data?.user?.id || null);
    })();
  }, []);

  // fetch a page of messages (older → newest page)
  async function fetchPage({ before = null } = {}) {
    let q = supabase
      .from("messages")
      .select("id, thread_id, sender_id, text, created_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (before) q = q.lt("created_at", before);

    const { data, error } = await q;
    if (error) {
      console.error("messages fetch error:", error);
      return [];
    }

    const rows = (data || []).map((r) => ({
      ...r,
      name: undefined, // we'll fill later
      avatar_url: null, // we'll fill later
    }));

    rows.reverse(); // newest->oldest to ascending
    return rows;
  }

  // initial load
  useEffect(() => {
    if (!threadId) return;
    (async () => {
      const page = await fetchPage();
      setMessages(page);
      setOldestLoadedAt(page[0]?.created_at || null);
      setHasMore(page.length === PAGE_SIZE);
      // jump to bottom
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "auto" }),
        0,
      );
    })();
    // realtime subscribe
    const channel = supabase
      .channel(`chat-${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const m = payload.new;
          setMessages((prev) => {
            if (prev.some((x) => x.id === m.id)) return prev;
            return [...prev, { ...m, name: undefined, avatar_url: null }];
          });
          setTimeout(
            () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
            0,
          );
        },
      )
      .subscribe();
    return () => channel.unsubscribe();
  }, [threadId]);

  // infinite scroll up
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    async function onScroll() {
      if (isLoadingMoreRef.current || !hasMore) return;
      if (el.scrollTop <= 0) {
        isLoadingMoreRef.current = true;
        const prevHeight = el.scrollHeight;
        const page = await fetchPage({ before: oldestLoadedAt });
        setMessages((cur) => [...page, ...cur]);
        setOldestLoadedAt(page[0]?.created_at || oldestLoadedAt);
        setHasMore(page.length === PAGE_SIZE);
        // maintain scroll position after prepending
        setTimeout(() => {
          const newHeight = el.scrollHeight;
          el.scrollTop = newHeight - prevHeight;
          isLoadingMoreRef.current = false;
        }, 0);
      }
    }

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, oldestLoadedAt]);

  async function sendMessage(e) {
    e?.preventDefault();
    if (!text.trim() || !me) return;
    const { error } = await supabase.from("messages").insert({
      thread_id: threadId,
      sender_id: me,
      text: text.trim(),
    });
    if (!error) setText("");
  }

  // group by day, then by consecutive sender
  const grouped = useMemo(() => {
    const days = [];
    let dayBucket = null;
    let lastSender = null;

    for (const msg of messages) {
      if (!dayBucket || !sameDay(dayBucket.day, msg.created_at)) {
        dayBucket = { day: msg.created_at, groups: [] };
        days.push(dayBucket);
        lastSender = null;
      }
      if (!lastSender || lastSender !== msg.sender_id) {
        dayBucket.groups.push({
          sender_id: msg.sender_id,
          name: msg.name,
          avatar_url: msg.avatar_url,
          items: [msg],
        });
        lastSender = msg.sender_id;
      } else {
        dayBucket.groups[dayBucket.groups.length - 1].items.push(msg);
      }
    }
    return days;
  }, [messages]);

  if (!me)
    return <div className="p-4 text-sm text-gray-500">Authenticating…</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* header */}
      <div className="p-3 border-b font-semibold">Chat</div>

      {/* history */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-3 bg-gray-50">
        {hasMore && (
          <div className="text-center text-xs text-gray-500 mb-2">
            Pull up to load earlier…
          </div>
        )}

        {grouped.map((day) => (
          <div key={day.day} className="mb-4">
            {/* day separator */}
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="mx-3 text-[11px] text-gray-500">
                {fmtDay(day.day)}
              </div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {day.groups.map((g, i) => {
              const mine = g.sender_id === me;
              return (
                <div
                  key={i}
                  className={`mt-2 space-y-1 ${mine ? "text-right" : "text-left"}`}
                >
                  {!mine && (
                    <div className="ml-9 mb-1 text-[11px] text-gray-600">
                      {g.name || "User"}
                    </div>
                  )}
                  {g.items.map((m) => (
                    <Bubble
                      key={m.id}
                      mine={mine}
                      msg={m}
                      name={g.name}
                      avatarUrl={g.avatar_url}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* composer */}
      <form onSubmit={sendMessage} className="p-3 border-t flex gap-2 bg-white">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border rounded-xl px-3 py-2"
        />
        <button className="px-4 py-2 rounded-xl bg-black text-white">
          Send
        </button>
      </form>
    </div>
  );
}

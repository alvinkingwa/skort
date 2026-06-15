import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Send,
  ChevronRight,
  Loader2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { G, GH, sessionIcon, sessionBadge } from "./helpers";
import { useAuth } from "../../context/AuthContext";

// Matches the backend DTO fields
interface Conversation {
  id: number;
  modelTopic: boolean;
  topicModel: { name?: string; email?: string } | null;
  topicBnb: { name?: string } | null;
  convoMarker: string;
  unreadMessages: number;
  lastMessage: string;
  lastMessageTime: string;
  assigned: boolean;
}

// Adjust fields to match your actual message DTO
interface Message {
  id: number;
  content: string;
  senderId: number | string;
  sentAt: string;
  senderType?: string; // e.g. "MODEL" | "BNB" | "ADMIN" — adjust to your backend enum
}

const TabInbox = () => {
  const { user } = useAuth();

  // ── Conversations list state ──────────────────────────────────────────────
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversationExists, setConversationExists] = useState<boolean | null>(null);

  // ── Open conversation state ───────────────────────────────────────────────
  const [open, setOpen] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // ── Reply state ───────────────────────────────────────────────────────────
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  // ── Edit state ────────────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [updating, setUpdating] = useState(false);

  // ── Delete state ──────────────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Auto-scroll to bottom of messages
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Check conversation exists, then fetch list ───────────────────────────
  useEffect(() => {
    if (!user?.token || !user?.id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Step 1 — check if a conversation exists for this user
        const checkRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/messages/check-conversation-exists`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              topicId: user.id,
              receiverType: "MODEL",
            }),
          },
        );
        const checkJson = await checkRes.json();
        if (!checkRes.ok) throw new Error(checkJson.message ?? "Check failed");

        const exists = checkJson.data === true || checkJson.exists === true || checkJson.data?.exists === true;
        setConversationExists(exists);

        // Step 2 — only fetch conversations if one exists
        if (!exists) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/messages/conversations/fetch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ pageNumber: 0, pageSize: 50 }),
          },
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Request failed");
        setConversations(
          Array.isArray(json.data) ? json.data : (json.data?.content ?? []),
        );
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load conversations",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.token, user?.id]);

  // ── Fetch messages when a conversation is opened ──────────────────────────
  // ── Fetch messages when a conversation is opened ──────────────────────────
  useEffect(() => {
    if (open === null || !user?.token) return;

    // Look up the conversation so we can use its fields as filter params
    const convo = conversations.find((x) => x.id === open);
    if (!convo) return;

    (async () => {
      setMessagesLoading(true);
      setMessagesError(null);
      setMessages([]);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/skort_app/messages/messages/fetch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              pageNumber: 0,
              pageSize: 50,
              // Use topicModel email as receiver filter when available
              ...(convo.topicModel?.email && {
                receiverEmail: convo.topicModel.email,
              }),
              // Use name from topicModel or topicBnb as fallback
              ...(convo.topicModel?.name
                ? { receiverName: convo.topicModel.name }
                : convo.topicBnb?.name
                  ? { receiverName: convo.topicBnb.name }
                  : {}),
            }),
          },
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Failed to load messages");

        const fetched: Message[] = Array.isArray(json.data)
          ? json.data
          : (json.data?.content ?? []);

        setMessages(fetched);
      } catch (e) {
        setMessagesError(
          e instanceof Error ? e.message : "Failed to load messages",
        );
      } finally {
        setMessagesLoading(false);
      }
    })();
  }, [open, user?.token, conversations]);

  // ── Scroll to bottom whenever messages change ─────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getDisplayName = (c: Conversation) =>
    c.topicModel?.name ?? c.topicBnb?.name ?? c.convoMarker ?? "Unknown";

  const formatTime = (dt: string) => {
    if (!dt) return "";
    const d = new Date(dt);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  /**
   * Determine whether a message was sent by the currently logged-in user.
   * Adjust this logic to match your actual auth/message structure.
   */
  const isOwnMessage = (msg: Message) =>
    String(msg.senderId) === String(user?.id) ||
    msg.senderType === "ADMIN";

  // ── Send reply via multipart/form-data ───────────────────────────────────
  const handleSend = async () => {
    if (!reply.trim() || open === null) return;

    const convo = conversations.find((x) => x.id === open);
    if (!convo) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.append("messageContent", reply.trim());
      formData.append("convoMarker", convo.convoMarker ?? "");
      formData.append("topicId", String(user?.id ?? ""));
      formData.append("receiverType", convo.modelTopic ? "MODEL" : "BNB");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/messages/send`,
        {
          method: "POST",
          headers: {
            // Do NOT set Content-Type — browser sets it automatically with boundary
            Authorization: `Bearer ${user?.token}`,
          },
          body: formData,
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Send failed");

      // Optimistically append the sent message
      const optimistic: Message = {
        id: Date.now(),
        content: reply.trim(),
        senderId: user?.id ?? "me",
        sentAt: new Date().toISOString(),
        senderType: "ADMIN",
      };
      setMessages((prev) => [...prev, optimistic]);
      setReply("");
    } catch {
      // silently fail — add a toast here if needed
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Update (edit) an existing message ────────────────────────────────────
  const handleUpdate = async (msg: Message) => {
    if (!editContent.trim() || updating) return;

    const convo = conversations.find((x) => x.id === open);
    if (!convo) return;

    setUpdating(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/messages/update-message/${msg.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            messageContent: editContent.trim(),
            convoMarker: convo.convoMarker ?? "",
            topicId: user?.id,
            receiverType: convo.modelTopic ? "MODEL" : "BNB",
          }),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Update failed");

      // Update message content in local state
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, content: editContent.trim() } : m,
        ),
      );
      setEditingId(null);
      setEditContent("");
    } catch {
      // silently fail — add a toast here if needed
    } finally {
      setUpdating(false);
    }
  };

  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // ── Delete a message ──────────────────────────────────────────────────────
  const handleDelete = async (msgId: number) => {
    setDeletingId(msgId);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/skort_app/messages/delete-message/${msgId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Delete failed");

      // Remove message from local state
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch {
      // silently fail — add a toast here if needed
    } finally {
      setDeletingId(null);
    }
  };

  // ── Loading / Error states (conversations list) ───────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: G }} />
        <p className="text-xs text-zinc-500">Loading conversations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="w-8 h-8 text-zinc-600" />
        <p className="text-zinc-400 text-sm font-semibold">Failed to load</p>
        <p className="text-zinc-600 text-xs">{error}</p>
      </div>
    );
  }

  // ── Open conversation (chat view) ─────────────────────────────────────────
  if (open !== null) {
    const c = conversations.find((x) => x.id === open)!;

    return (
      <div className="flex flex-col h-full">
        {/* Back button */}
        <button
          onClick={() => {
            setOpen(null);
            setMessages([]);
            setMessagesError(null);
          }}
          className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-bold mb-4 w-fit transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to inbox
        </button>

        {/* Conversation header */}
        <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-3 flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
            {getDisplayName(c).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{getDisplayName(c)}</p>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-lg ${sessionBadge(c.modelTopic ? "Model" : "BnB")}`}
            >
              {sessionIcon(c.modelTopic ? "Model" : "BnB")}{" "}
              {c.modelTopic ? "Model" : "BnB"}
            </span>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 min-h-0">
          {/* Loading state */}
          {messagesLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: G }} />
              <p className="text-xs text-zinc-500">Loading messages…</p>
            </div>
          )}

          {/* Error state */}
          {messagesError && !messagesLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <AlertCircle className="w-6 h-6 text-zinc-600" />
              <p className="text-zinc-400 text-xs font-semibold">
                Could not load messages
              </p>
              <p className="text-zinc-600 text-[11px]">{messagesError}</p>
            </div>
          )}

          {/* Empty state */}
          {!messagesLoading && !messagesError && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <MessageSquare className="w-6 h-6 text-zinc-700" />
              <p className="text-zinc-600 text-xs">No messages yet.</p>
            </div>
          )}

          {/* Message bubbles */}
          {!messagesLoading &&
            !messagesError &&
            messages.map((msg) => {
              const own = isOwnMessage(msg);
              const isEditing = editingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${own ? "justify-end" : "justify-start"}`}
                >
                  {isEditing ? (
                    /* ── Inline edit mode ── */
                    <div className="flex flex-col gap-1.5 max-w-[80%] w-full">
                      <input
                        autoFocus
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleUpdate(msg);
                          }
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="w-full bg-zinc-700 border border-white/[0.15] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                      />
                      <div className="flex gap-2 justify-end items-center">
                        <button
                          onClick={() => handleDelete(msg.id)}
                          disabled={deletingId === msg.id}
                          className="text-[11px] text-red-400 hover:text-red-300 transition-colors px-2 py-1 disabled:opacity-40 mr-auto"
                        >
                          {deletingId === msg.id ? "Deleting…" : "Delete"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(msg)}
                          disabled={!editContent.trim() || updating}
                          className="text-[11px] font-semibold text-white px-3 py-1 rounded-lg disabled:opacity-40 transition-opacity"
                          style={{ background: G }}
                        >
                          {updating ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Normal bubble ── */
                    <div
                      onClick={() => own && startEdit(msg)}
                      className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] ${
                        own
                          ? "rounded-br-sm text-white cursor-pointer hover:opacity-90 transition-opacity"
                          : "rounded-bl-sm bg-zinc-800 border border-white/[0.05] text-zinc-200"
                      }`}
                      style={own ? { background: G } : undefined}
                    >
                      <p>{msg.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${own ? "justify-end" : ""}`}>
                        <p className={`text-[10px] ${own ? "text-white/50" : "text-zinc-500"}`}>
                          {formatTime(msg.sentAt)}
                        </p>
                        {own && (
                          <p className="text-[10px] text-white/30">· tap to edit</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Reply input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Reply…"
            disabled={sending}
            className="flex-1 bg-zinc-800 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!reply.trim() || sending}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-opacity disabled:opacity-40"
            style={{ background: G }}
            onMouseEnter={(e) =>
              !sending && (e.currentTarget.style.background = GH)
            }
            onMouseLeave={(e) =>
              !sending && (e.currentTarget.style.background = G)
            }
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // ── Conversations list ────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      {(conversationExists === false || conversations.length === 0) && (
        <p className="text-center text-zinc-600 text-xs py-16">
          No conversations yet.
        </p>
      )}
      {conversations.map((c) => (
        <button
          key={c.id}
          onClick={() => setOpen(c.id)}
          className="w-full bg-zinc-900 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3 hover:border-white/[0.15] transition-all text-left"
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
              {getDisplayName(c).charAt(0).toUpperCase()}
            </div>
            {c.unreadMessages > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center"
                style={{ background: G }}
              >
                {c.unreadMessages}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p
                className={`text-sm font-bold ${c.unreadMessages > 0 ? "text-white" : "text-zinc-300"}`}
              >
                {getDisplayName(c)}
              </p>
              <span className="text-[10px] text-zinc-600 shrink-0 ml-2">
                {formatTime(c.lastMessageTime)}
              </span>
            </div>
            <p
              className={`text-xs truncate ${c.unreadMessages > 0 ? "text-zinc-400" : "text-zinc-600"}`}
            >
              {c.lastMessage}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />
        </button>
      ))}
    </div>
  );
};

export default TabInbox;
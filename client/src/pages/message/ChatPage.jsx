import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useMessageStore from "../../store/messageStore";
import MessageInput from "./MessageInput";
import ReactionPicker from "./ReactionPicker";
import useAuthStore from "../../store/authStore";

const ChatPage = () => {
  const { otherUserId } = useParams();
  const bottomRef = useRef(null);
  const menuRef = useRef(null); // Ref for context menu

  const [activeReactionMsg, setActiveReactionMsg] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const { user } = useAuthStore();
  const {
    messages,
    fetchMessages,
    markAllRead,
    typingUsers,
    isLoading,
    reactToMessage,
    removeReaction,
    deleteMessage,
  } = useMessageStore();

  useEffect(() => {
    fetchMessages(otherUserId);
    markAllRead(otherUserId);
  }, [otherUserId]);

  // ✅ Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedMessage &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setSelectedMessage(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedMessage]);

  if (isLoading) {
    return <div className="p-6 text-slate-400">Loading chat...</div>;
  }

  // 🔥 THE FIX: Sort messages by Date (Oldest -> Newest)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-800">
        <h2 className="font-semibold">Chat</h2>
        {typingUsers[otherUserId] && (
          <p className="text-xs text-slate-400 animate-pulse">Typing...</p>
        )}
      </div>

      {/* MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedMessages.map((msg) => {
          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

          const isOwn = senderId !== otherUserId;
          const myReaction = msg.reactions?.find((r) => r.userId === user?._id);

          return (
            <div
              key={msg._id || `${senderId}-${msg.createdAt}`}
              className="relative"
            >
              {/* MESSAGE BUBBLE */}
              <div
                onDoubleClick={() =>
                  setActiveReactionMsg(
                    activeReactionMsg === msg._id ? null : msg._id
                  )
                }
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSelectedMessage(msg);
                }}
                className={`relative max-w-md px-4 py-2 rounded text-sm cursor-pointer
                  ${isOwn ? "bg-blue-600 ml-auto" : "bg-slate-800"}`}
              >
                <p>{msg.content}</p>

                {/* TIME & STATUS */}
                <span className="block text-[10px] text-slate-300 mt-1 flex items-center gap-1 justify-end">
                  {msg.timeAgo}
                  {isOwn && (
                    <>
                      {msg.deliveryStatus === "sent" && "✓"}
                      {msg.deliveryStatus === "delivered" && "✓✓"}
                      {msg.deliveryStatus === "read" && (
                        <span className="text-blue-400">✓✓</span>
                      )}
                    </>
                  )}
                  {msg.isEdited && " (edited)"}
                </span>

                {/* DELETE MENU */}
                {selectedMessage?._id === msg._id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded shadow text-xs z-50"
                  >
                    <button
                      onClick={() => {
                        deleteMessage(msg._id, false);
                        setSelectedMessage(null);
                      }}
                      className="block px-3 py-2 hover:bg-slate-800 w-full text-left"
                    >
                      Delete for me
                    </button>

                    {isOwn && (
                      <button
                        onClick={() => {
                          deleteMessage(msg._id, true);
                          setSelectedMessage(null);
                        }}
                        className="block px-3 py-2 hover:bg-slate-800 w-full text-left text-red-400"
                      >
                        Delete for everyone
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* REACTIONS */}
              {msg.reactions?.length > 0 && (
                <div
                  className={`flex gap-1 mt-1 ${isOwn ? "justify-end" : ""}`}
                >
                  {msg.reactions.map((r) => (
                    <span
                      key={r.userId}
                      className="bg-slate-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      {r.emoji}
                    </span>
                  ))}
                </div>
              )}

              {/* REACTION PICKER */}
              {activeReactionMsg === msg._id && (
                <div className={`${isOwn ? "flex justify-end" : ""}`}>
                  <ReactionPicker
                    onSelect={(emoji) => {
                      if (myReaction?.emoji === emoji) {
                        removeReaction(msg._id);
                      } else {
                        reactToMessage(msg._id, emoji);
                      }
                      setActiveReactionMsg(null);
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      <MessageInput receiverId={otherUserId} />
    </div>
  );
};

export default ChatPage;

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMessageStore from "../../store/messageStore";
import MessageInput from "./MessageInput";
import ReactionPicker from "./ReactionPicker";
import useAuthStore from "../../store/authStore";
import { Video, Phone } from "lucide-react";

import { io } from "socket.io-client";

const ChatPage = () => {
  const { otherUserId } = useParams();
  const bottomRef = useRef(null);
  const menuRef = useRef(null); // Ref for context menu

  const [activeReactionMsg, setActiveReactionMsg] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

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
    activeChatUserDetails,
    onlineUsers,
  } = useMessageStore();

  const isOnline = onlineUsers?.includes(otherUserId);

  useEffect(() => {
    fetchMessages(otherUserId);
    markAllRead(otherUserId);
    
    // Connect a local socket just to trigger calls if we aren't using the global one
    const newSocket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001", {
      withCredentials: true,
    });
    setSocket(newSocket);
    
    return () => newSocket.disconnect();
  }, [otherUserId]);

  const initiateCall = (type) => {
    const roomId = `${user?._id}-${otherUserId}`;
    if (socket) {
      socket.emit("callUser", {
        userToCall: otherUserId,
        signalData: roomId,
        from: user?._id,
        name: user?.name,
      });
    }
    navigate(`/call/${roomId}`);
  };

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
    return <div className="px-4 py-6 text-slate-400">Loading chat...</div>;
  }

  // 🔥 THE FIX: Sort messages by Date (Oldest -> Newest)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="flex-1 bg-slate-950 text-white flex flex-col sm:h-[calc(100dvh-64px)] min-h-[calc(100vh-140px)]">
      {/* HEADER */}
      <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.history.back()} 
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            {activeChatUserDetails?.profilePicture ? (
              <img 
                src={activeChatUserDetails.profilePicture} 
                alt="Profile" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-700 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 shadow-sm">
                {activeChatUserDetails?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            
            <div className="flex flex-col">
              <h2 className="font-semibold text-white leading-tight">
                {activeChatUserDetails?.name || 'Loading...'}
              </h2>
              {typingUsers[otherUserId] ? (
                <p className="text-xs text-blue-400 font-medium animate-pulse mt-0.5">typing...</p>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                  <p className={`text-xs ${isOnline ? 'text-green-400' : 'text-slate-400'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CALL ACTION BUTTONS */}
        <div className="flex items-center gap-1 sm:gap-3 mr-2 sm:mr-4">
          <button 
            onClick={() => initiateCall('voice')}
            className="p-2 sm:p-2.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-green-400 transition-colors bg-slate-800/50 border border-slate-700/50"
            title="Voice Call"
          >
            <Phone size={18} className="sm:w-5 sm:h-5" />
          </button>
          
          <button 
            onClick={() => initiateCall('video')}
            className="p-2 sm:p-2.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-blue-400 transition-colors bg-slate-800/50 border border-slate-700/50"
            title="Video Call"
          >
            <Video size={20} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3">
        {sortedMessages.map((msg) => {
          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

          const isOwn = senderId !== otherUserId;
          const myReaction = msg.reactions?.find((r) => r.userId === user?._id);

          return (
            <div
              key={msg._id || `${senderId}-${msg.createdAt}`}
              className={`relative flex gap-2 w-full ${isOwn ? "justify-end" : "justify-start"}`}
            >
              {/* Other User Avatar */}
              {!isOwn && (
                <div className="flex-shrink-0 self-end mb-1">
                  {activeChatUserDetails?.profilePicture ? (
                    <img
                      src={activeChatUserDetails.profilePicture}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full border border-slate-700 shadow-sm object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs shadow-sm">
                      {activeChatUserDetails?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
              )}

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
                className={`relative max-w-[85%] sm:max-w-md px-3 sm:px-4 py-2 rounded-2xl text-sm shadow-sm
                  ${
                    isOwn 
                      ? "bg-blue-600 ml-auto rounded-br-sm text-white" 
                      : "bg-slate-800 rounded-bl-sm text-slate-100"
                  }`}
              >
                <p className="break-words whitespace-pre-wrap">{msg.content}</p>

                {/* ATTACHMENTS */}
                {msg.attachments?.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {msg.attachments.map((att, index) => (
                      <div key={index}>
                        {att.type === "image" ? (
                          <img src={att.url} alt="attachment" className="max-w-full rounded-lg max-h-60 object-contain" />
                        ) : att.type === "video" ? (
                          <video src={att.url} controls className="max-w-full rounded-lg max-h-60" />
                        ) : att.type === "audio" ? (
                          <audio src={att.url} controls className="max-w-full h-10" />
                        ) : (
                          <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-300 hover:text-blue-200 underline text-sm bg-slate-900/50 p-2 rounded">
                            📄 View File
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

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

              {/* Own User Avatar */}
              {isOwn && (
                <div className="flex-shrink-0 self-end mb-1">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="My Avatar"
                      className="w-7 h-7 rounded-full border border-slate-700 shadow-sm object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center font-bold text-blue-200 text-xs shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
              )}

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

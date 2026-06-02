import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMessageStore from "../../store/messageStore";
import MessageInput from "./MessageInput";
import ReactionPicker from "./ReactionPicker";
import useAuthStore from "../../store/authStore";
import { Video, Phone, ChevronLeft, CheckCircle2, ShieldAlert, FileText } from "lucide-react";
import SEO from "../../components/SEO";

import { io } from "socket.io-client";

const ChatPage = () => {
  const { otherUserId } = useParams();
  const bottomRef = useRef(null);
  const menuRef = useRef(null);

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
    
    const newSocket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001", {
      withCredentials: true,
    });
    setSocket(newSocket);
    
    return () => newSocket.disconnect();
  }, [otherUserId, fetchMessages, markAllRead]);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Loading chat...
      </div>
    );
  }

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="flex-1 bg-slate-950 text-white flex flex-col sm:h-[calc(100dvh-64px)] min-h-[calc(100vh-140px)] relative overflow-hidden">
      <SEO title={`Chat ${activeChatUserDetails?.name ? `- ${activeChatUserDetails.name}` : ''}`} path={`/messages/${otherUserId}`} noIndex />
      
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.history.back()} 
            className="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              {activeChatUserDetails?.profilePicture ? (
                <img 
                  src={activeChatUserDetails.profilePicture} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400 shadow-sm border border-slate-700">
                  {activeChatUserDetails?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              {isOnline && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              )}
            </div>
            
            <div className="flex flex-col">
              <h2 className="font-bold text-white text-base leading-tight">
                {activeChatUserDetails?.name || 'Loading...'}
              </h2>
              {typingUsers[otherUserId] ? (
                <p className="text-xs font-medium text-indigo-400 animate-pulse mt-0.5">typing...</p>
              ) : (
                <p className={`text-[11px] font-medium mt-0.5 ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isOnline ? 'Active Now' : 'Offline'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CALL ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => initiateCall('voice')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors border border-slate-700 shadow-sm"
            title="Voice Call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button 
            onClick={() => initiateCall('video')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 transition-colors border border-slate-700 shadow-sm"
            title="Video Call"
          >
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-950 relative z-10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-slate-900/50 before:to-transparent before:pointer-events-none">
        
        {sortedMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
             <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 mb-4 border border-slate-800">
               <span className="text-2xl">👋</span>
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Start the conversation</h3>
             <p className="text-slate-400 text-sm max-w-sm">
               Send a message to {activeChatUserDetails?.name || 'them'} to get things started.
             </p>
          </div>
        )}

        {sortedMessages.map((msg) => {
          const senderId = typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
          const isOwn = senderId !== otherUserId;
          const myReaction = msg.reactions?.find((r) => r.userId === user?._id);
          const isAdminMsg = msg.senderId?.role === "admin";

          return (
            <div
              key={msg._id || `${senderId}-${msg.createdAt}`}
              className={`relative flex gap-3 w-full ${isOwn ? "justify-end" : "justify-start"}`}
            >
              {/* Other User Avatar */}
              {!isOwn && (
                <div className="flex-shrink-0 self-end mb-1.5 hidden sm:block">
                  {activeChatUserDetails?.profilePicture ? (
                    <img src={activeChatUserDetails.profilePicture} alt="Avatar" className="w-8 h-8 rounded-lg border border-slate-700 shadow-sm object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs shadow-sm border border-slate-700">
                      {activeChatUserDetails?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
              )}

              {/* MESSAGE BUBBLE */}
              <div className={`flex flex-col max-w-[85%] sm:max-w-md relative group ${isOwn ? "items-end" : "items-start"}`}>
                
                {isAdminMsg && (
                   <span className="text-[10px] font-bold text-amber-500 mb-1 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 w-fit">
                      <ShieldAlert className="w-3 h-3" /> Admin Message
                   </span>
                )}

                <div
                  onDoubleClick={() => setActiveReactionMsg(activeReactionMsg === msg._id ? null : msg._id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedMessage(msg);
                  }}
                  className={`relative px-4 py-3 rounded-2xl text-sm shadow-sm transition-all duration-200
                    ${
                      isAdminMsg ? "bg-amber-600/20 border border-amber-500/30 text-amber-50 rounded-tl-sm" : 
                      isOwn 
                        ? "bg-indigo-600 ml-auto rounded-br-sm text-white shadow-indigo-600/20" 
                        : "bg-slate-800 rounded-bl-sm text-slate-100 border border-slate-700/50"
                    }`}
                >
                  <p className="break-words whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>

                  {/* ATTACHMENTS */}
                  {msg.attachments?.length > 0 && (
                    <div className="flex flex-col gap-2 mt-3">
                      {msg.attachments.map((att, index) => (
                        <div key={index} className="overflow-hidden rounded-xl border border-white/10">
                          {att.type === "image" ? (
                            <img src={att.url} alt="attachment" className="max-w-full max-h-60 object-cover" />
                          ) : att.type === "video" ? (
                            <video src={att.url} controls className="max-w-full max-h-60" />
                          ) : att.type === "audio" ? (
                            <audio src={att.url} controls className="max-w-[200px] h-10" />
                          ) : (
                            <a href={att.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 font-medium text-sm p-3 transition-colors ${isOwn ? "bg-black/20 hover:bg-black/30" : "bg-slate-900/50 hover:bg-slate-900"}`}>
                              <FileText className="w-4 h-4" /> View File
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DELETE MENU */}
                  {selectedMessage?._id === msg._id && (
                    <div ref={menuRef} className={`absolute top-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl text-sm font-medium z-50 overflow-hidden min-w-[160px] ${isOwn ? "right-0" : "left-0"}`}>
                      <button onClick={() => { deleteMessage(msg._id, false); setSelectedMessage(null); }} className="block px-4 py-3 hover:bg-slate-800 w-full text-left text-slate-200 transition-colors">
                        Delete for me
                      </button>
                      {isOwn && (
                        <button onClick={() => { deleteMessage(msg._id, true); setSelectedMessage(null); }} className="block px-4 py-3 hover:bg-rose-900/30 w-full text-left text-rose-400 transition-colors border-t border-slate-800">
                          Delete for everyone
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* TIME, STATUS & REACTIONS ROW */}
                <div className={`flex items-center gap-2 mt-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                  <span className="text-[10px] text-slate-500 font-medium px-1 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {msg.timeAgo}
                    {isOwn && (
                      <>
                        {msg.deliveryStatus === "sent" && "✓"}
                        {msg.deliveryStatus === "delivered" && "✓✓"}
                        {msg.deliveryStatus === "read" && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
                      </>
                    )}
                    {msg.isEdited && " (edited)"}
                  </span>

                  {/* REACTIONS */}
                  {msg.reactions?.length > 0 && (
                    <div className="flex gap-1">
                      {msg.reactions.map((r) => (
                        <span key={r.userId} className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full text-xs shadow-sm">
                          {r.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* REACTION PICKER */}
                {activeReactionMsg === msg._id && (
                  <div className={`mt-2 ${isOwn ? "self-end" : "self-start"}`}>
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

            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="relative z-20">
         <MessageInput receiverId={otherUserId} />
      </div>
    </div>
  );
};

export default ChatPage;

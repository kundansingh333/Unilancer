import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useOrderStore from "../../store/orderStore";
import useAuthStore from "../../store/authStore";
import { adminSendOrderMessage } from "../../api/adminApi";
import { uploadImage } from "../../api/uploadApi"; // We'll use this for file uploads too
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, Smile, X, Video, Phone } from "lucide-react";

const OrderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const {
    currentOrder,
    isLoading,
    error,
    fetchOrderById,
    acceptOrder,
    deliverWork,
    requestRevision,
    completeOrder,
    cancelOrder,
    raiseDispute,
    addOrderMessage,
    rateOrder,
    setError,
  } = useOrderStore();

  const [messageText, setMessageText] = useState("");
  const [revisionReason, setRevisionReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const [deliverables, setDeliverables] = useState([
    { type: "link", name: "", url: "", description: "" },
  ]);

  const navigate = useNavigate();

  // Socket & Real-time Chat States
  const [socket, setSocket] = useState(null);
  const [typingUser, setTypingUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!user || !id) return;
    const newSocket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001", {
      withCredentials: true,
    });

    setSocket(newSocket);
    newSocket.emit("joinOrder", id);

    return () => {
      newSocket.disconnect();
    };
  }, [user, id]);

  // Handle incoming real-time messages and typing events
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (data) => {
      if (data.orderId === id) {
        // Optimistically update the store's currentOrder to include this new message
        useOrderStore.setState((state) => {
          if (!state.currentOrder) return state;
          
          // Check if message already exists to prevent duplicates
          const exists = state.currentOrder.messages.find(m => m._id === data.message._id);
          if (exists) return state;

          return {
            ...state,
            currentOrder: {
              ...state.currentOrder,
              messages: [...state.currentOrder.messages, data.message],
            },
          };
        });
        
        // Clear typing indicator when a message arrives
        setTypingUser("");
      }
    });

    socket.on("orderTyping", (data) => {
      if (data.isTyping && data.userId !== user?._id) {
        setTypingUser(data.userName);
      } else {
        setTypingUser("");
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("orderTyping");
    };
  }, [socket, id, user]);

  // Debounced typing handler
  useEffect(() => {
    if (!socket || !id || !user) return;
    const typingTimeout = setTimeout(() => {
      socket.emit("orderTyping", { orderId: id, userId: user._id, userName: user.name, isTyping: false });
    }, 2000);

    return () => clearTimeout(typingTimeout);
  }, [messageText, socket, id, user]);

  const handleMessageTyping = (e) => {
    setMessageText(e.target.value);
    if (socket) {
      socket.emit("orderTyping", { orderId: id, userId: user._id, userName: user.name, isTyping: true });
    }
  };

  const handleEmojiClick = (emojiObj) => {
    setMessageText((prev) => prev + emojiObj.emoji);
  };

  //messages
  const initiateCall = (type) => {
    if (!currentOrder) return;
    
    // Determine who to call
    const otherUserId =
      currentOrder.clientId?._id === user?._id
        ? currentOrder.freelancerId?._id
        : currentOrder.clientId?._id;

    if (!otherUserId) return;

    const roomId = `order-${id}`;
    
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

  const handleOpenChat = () => {
    if (!currentOrder) return;

    const otherUserId =
      currentOrder.clientId?._id === user?._id
        ? currentOrder.freelancerId?._id
        : currentOrder.clientId?._id;

    if (!otherUserId) return;

    navigate(`/messages/${otherUserId}`);
  };

  useEffect(() => {
    fetchOrderById(id);
  }, [id, fetchOrderById]);

  useEffect(() => {
    // When order changes, if it already has deliveredWork, prefill deliverables (optional)
    if (currentOrder?.deliveredWork && currentOrder.deliveredWork.length > 0) {
      setDeliverables(
        currentOrder.deliveredWork.map((d) => ({
          type: d.type || "link",
          name: d.name || "",
          url: d.url || "",
          description: d.description || "",
        }))
      );
    }
  }, [currentOrder]);

  const isClient = currentOrder
    ? currentOrder.clientId?._id === user?._id
    : false;
  const isFreelancer = currentOrder
    ? currentOrder.freelancerId?._id === user?._id
    : false;
  const isAdmin = user?.role === "admin";

  const handleAccept = async () => {
    const res = await acceptOrder(id);
    if (!res.success) toast.error(res.error || "Failed to accept");
    else toast.success("Order accepted!");
  };

  const handleDeliver = async () => {
    // filter valid deliverables (must have url)
    const filtered = deliverables
      .map((d) => ({
        type: d.type,
        name: d.name || (d.type === "link" ? "Live link" : "File"),
        url: d.url,
        description: d.description || "",
      }))
      .filter((d) => d.url && d.url.trim().length > 0);

    if (filtered.length === 0) {
      return toast.error(
        "Please provide at least one deliverable URL or file link."
      );
    }

    const res = await deliverWork(id, filtered);
    if (!res.success) toast.error(res.error || "Failed to deliver");
    else {
      toast.success("Work delivered successfully!");
      // clear deliverables (leave a single empty row)
      setDeliverables([{ type: "link", name: "", url: "", description: "" }]);
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionReason.trim())
      return toast.error("Provide a reason for revision.");
    
    const res = await requestRevision(id, revisionReason.trim());
    if (!res.success) toast.error(res.error || "Failed to request revision");
    else {
      toast.success("Revision requested!");
      setRevisionReason("");
    }
  };

  const handleComplete = async () => {
    const res = await completeOrder(id);
    if (!res.success) toast.error(res.error || "Failed to mark completed");
    else toast.success("Order marked as completed!");
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return toast.error("Provide a reason to cancel.");
    
    const res = await cancelOrder(id, cancelReason.trim());
    if (!res.success) toast.error(res.error || "Failed to cancel order");
    else {
      toast.success("Order cancelled");
      setCancelReason("");
    }
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) return toast.error("Provide a dispute reason.");
    
    const res = await raiseDispute(id, disputeReason.trim());
    if (!res.success) toast.error(res.error || "Failed to raise dispute");
    else {
      toast.success("Dispute raised. Admins will review.");
      setDisputeReason("");
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedFile) return toast.error("Message cannot be empty.");
    
    let attachmentUrl = null;
    let attachmentType = null;

    if (selectedFile) {
      setIsUploading(true);
      try {
        attachmentUrl = await uploadImage(selectedFile);
        attachmentType = selectedFile.type.startsWith("image/") ? "image" 
          : selectedFile.type.startsWith("video/") ? "video" 
          : selectedFile.type.startsWith("audio/") ? "audio" : "file";
      } catch (err) {
        setIsUploading(false);
        return toast.error("Failed to upload file");
      }
      setIsUploading(false);
    }
    
    const attachments = attachmentUrl ? [{ url: attachmentUrl, type: attachmentType }] : [];

    if (isAdmin) {
      try {
        const res = await adminSendOrderMessage(id, messageText.trim(), attachments);
        if (res.data?.success) {
          // Refresh order to get updated messages
          fetchOrderById(id);
          setMessageText("");
        } else {
          toast.error(res.data?.error || "Failed to send message");
        }
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to send message");
      }
    } else {
      const res = await addOrderMessage(id, messageText.trim(), attachments);
      if (!res.success) toast.error(res.error || "Failed to send message");
      else {
        setMessageText("");
        setSelectedFile(null);
        setShowEmojiPicker(false);
      }
    }
  };

  const handleRate = async () => {
    if (rating < 1 || rating > 5)
      return toast.error("Rating must be between 1 and 5");
      
    const res = await rateOrder(id, { rating, review: reviewText.trim() });
    if (!res.success) toast.error(res.error || "Failed to submit rating");
    else {
      toast.success("Rating submitted!");
      setReviewText("");
    }
  };

  // Deliverables UI helpers
  const updateDeliverable = (index, key, value) => {
    setDeliverables((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const addDeliverableRow = () =>
    setDeliverables((prev) => [
      ...prev,
      { type: "link", name: "", url: "", description: "" },
    ]);

  const removeDeliverableRow = (index) =>
    setDeliverables((prev) => prev.filter((_, i) => i !== index));

  if (isLoading || !currentOrder) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-300 text-sm">Loading order...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">
              Order #{currentOrder.orderNumber || currentOrder._id}
            </p>
            <h1 className="text-xl sm:text-2xl font-semibold mt-1">
              {currentOrder.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Status: {currentOrder?.status?.replace?.("_", " ") || "unknown"}
              {" • "} Category: {currentOrder.category}
            </p>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-1">
            <p>
              Price:{" "}
              <span className="text-slate-100 font-medium">
                {currentOrder.price} {currentOrder.currency || "INR"}
              </span>
            </p>
            <p>
              Delivery time: {currentOrder.deliveryTime} day
              {currentOrder.deliveryTime > 1 ? "s" : ""}
            </p>
            {currentOrder.deadline && (
              <p>
                Deadline: {new Date(currentOrder.deadline).toLocaleDateString()}
              </p>
            )}
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Description */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
              <h2 className="text-sm font-semibold text-slate-200">
                Description
              </h2>
              <p className="text-xs text-slate-300 whitespace-pre-wrap">
                {currentOrder.description}
              </p>
              {currentOrder.requirements && (
                <>
                  <h3 className="text-xs font-semibold text-slate-300 mt-3">
                    Requirements from client
                  </h3>
                  <p className="text-xs text-slate-400 whitespace-pre-wrap">
                  </p>
                </>
              )}
            </section>

            {/* Delivered Work */}
            {currentOrder.deliveredWork?.length > 0 && (
              <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                <h2 className="text-sm font-semibold text-emerald-400">
                  Delivered Work
                </h2>
                <div className="space-y-3">
                  {currentOrder.deliveredWork.map((dw, idx) => (
                    <div
                      key={dw._id || idx}
                      className="p-3 rounded-lg bg-slate-900/50 border border-emerald-500/20"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-100">
                            {dw.name || "Deliverable"}
                          </p>
                          {dw.description && (
                            <p className="text-xs text-slate-400 mt-1">
                              {dw.description}
                            </p>
                          )}
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {dw.type || "link"}
                        </span>
                      </div>
                      {dw.url && (
                        <a
                          href={dw.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-3 text-xs text-blue-400 hover:text-blue-300 underline"
                        >
                          View / Download
                        </a>
                      )}
                      <p className="text-[10px] text-slate-500 mt-2">
                        Delivered on {new Date(dw.deliveredAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Revision History */}
            {currentOrder.revisionRequests?.length > 0 && (
              <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                <h2 className="text-sm font-semibold text-amber-400">
                  Revision History
                </h2>
                <div className="space-y-3">
                  {currentOrder.revisionRequests.map((rev, idx) => (
                    <div
                      key={rev._id || idx}
                      className="p-3 rounded-lg bg-slate-900/50 border border-amber-500/20"
                    >
                      <p className="text-sm text-slate-200">
                        <span className="font-semibold text-amber-500 mr-2">
                          Reason:
                        </span>
                        {rev.reason}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2">
                        Requested on {new Date(rev.requestedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Cancellations & Disputes */}
            {(currentOrder.cancellationReason || currentOrder.disputeReason) && (
              <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 space-y-3">
                {currentOrder.cancellationReason && (
                  <div>
                    <h2 className="text-sm font-semibold text-red-400 mb-1">
                      Cancellation Reason
                    </h2>
                    <p className="text-xs text-slate-300">
                      {currentOrder.cancellationReason}
                    </p>
                  </div>
                )}
                {currentOrder.disputeReason && (
                  <div className={currentOrder.cancellationReason ? "pt-3 border-t border-red-500/20" : ""}>
                    <h2 className="text-sm font-semibold text-red-400 mb-1">
                      Dispute Reason
                    </h2>
                    <p className="text-xs text-slate-300">
                      {currentOrder.disputeReason}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Reviews / Feedback */}
            {(currentOrder.clientRating || currentOrder.freelancerRating) && (
              <section className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-4">
                <h2 className="text-sm font-semibold text-blue-400">
                  Reviews & Feedback
                </h2>
                <div className="space-y-4">
                  {currentOrder.clientRating && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-300">
                        Client Review
                      </p>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {"★".repeat(currentOrder.clientRating.rating)}
                        {"☆".repeat(5 - currentOrder.clientRating.rating)}
                      </div>
                      <p className="text-xs text-slate-300 italic">
                        &quot;{currentOrder.clientRating.review || "No written review provided."}&quot;
                      </p>
                    </div>
                  )}
                  {currentOrder.freelancerRating && (
                    <div className={currentOrder.clientRating ? "pt-4 border-t border-blue-500/20 space-y-1" : "space-y-1"}>
                      <p className="text-xs font-semibold text-slate-300">
                        Freelancer Feedback
                      </p>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {"★".repeat(currentOrder.freelancerRating.rating)}
                        {"☆".repeat(5 - currentOrder.freelancerRating.rating)}
                      </div>
                      <p className="text-xs text-slate-300 italic">
                        &quot;{currentOrder.freelancerRating.review || "No written review provided."}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Parties */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PartyCard
                title="Client"
                user={currentOrder.clientId}
                highlight={isClient}
              />
              <PartyCard
                title="Freelancer"
                user={currentOrder.freelancerId}
                highlight={isFreelancer}
              />
            </section>

            {/* Messages */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
              {/* <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">
                  Messages
                </h2>
                <span className="text-[11px] text-slate-500">
                  Only client & freelancer can see this chat.
                </span>
              </div> */}

              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
                <div className="flex items-center gap-3">
                   <h2 className="text-sm font-semibold text-slate-200">
                    Order Chat
                   </h2>
                   {typingUser && (
                     <span className="text-xs text-blue-400 italic animate-pulse">
                       {typingUser} is typing...
                     </span>
                   )}
                </div>
                <button
                  onClick={handleOpenChat}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Open full chat
                </button>
              </div>

              {/* Chat Avatars Header */}
              <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded-lg border border-slate-800/50 mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                    {currentOrder.clientId?.profilePicture ? 
                      <img src={currentOrder.clientId.profilePicture} alt="Client" className="w-full h-full object-cover" /> 
                      : <span className="text-[10px]">{currentOrder.clientId?.name?.[0]?.toUpperCase()}</span>}
                  </div>
                  <span className="text-xs text-slate-300">Client</span>
                </div>
                <div className="flex flex-col items-center">
                   <span className="text-[10px] text-slate-500">vs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300">Freelancer</span>
                  <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                    {currentOrder.freelancerId?.profilePicture ? (
                      <img src={currentOrder.freelancerId.profilePicture} alt="Freelancer" className="w-full h-full object-cover" /> 
                    ) : (
                      <span className="text-[10px]">{currentOrder.freelancerId?.name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* CALL ACTION BUTTONS */}
              {user?._id === currentOrder.clientId?._id || user?._id === currentOrder.freelancerId?._id ? (
                <div className="flex items-center justify-center gap-4 mt-2 mb-3 pb-3 border-b border-slate-800/50">
                  <button 
                    onClick={() => initiateCall('voice')}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-green-400 transition-colors bg-slate-800/50 border border-slate-700/50 text-xs font-medium"
                  >
                    <Phone size={14} /> Voice Call
                  </button>
                  <button 
                    onClick={() => initiateCall('video')}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-blue-400 transition-colors bg-slate-800/50 border border-slate-700/50 text-xs font-medium"
                  >
                    <Video size={14} /> Video Call
                  </button>
                </div>
              ) : null}

              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 flex flex-col">
                {currentOrder.messages && currentOrder.messages.length > 0 ? (
                  currentOrder.messages.map((msg) => (
                    <MessageBubble
                      key={msg._id || msg.sentAt}
                      msg={msg}
                      currentUserId={user?._id}
                    />
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center my-4">
                    No messages yet. Start the conversation.
                  </p>
                )}
              </div>

              {/* File preview */}
              {selectedFile && (
                <div className="mt-2 flex items-center justify-between bg-slate-800 p-2 rounded-lg text-xs text-slate-300">
                  <span className="truncate max-w-[80%]">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} className="text-rose-400 hover:text-rose-300">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute z-10 bottom-24 right-4 shadow-xl">
                  <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                </div>
              )}

              <div className="relative flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-slate-400 hover:text-yellow-400 transition-colors"
                >
                  <Smile size={18} />
                </button>
                
                <label className="cursor-pointer text-slate-400 hover:text-blue-400 transition-colors">
                  <Paperclip size={18} />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </label>

                <input
                  className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={handleMessageTyping}
                  onKeyDown={(e) => e.key === "Enter" && !isUploading && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isUploading}
                  className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-xs font-medium text-white transition-colors"
                >
                  {isUploading ? "Sending..." : "Send"}
                </button>
              </div>
            </section>

            {/* Rating */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-200">
                Rate this order
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} ★
                    </option>
                  ))}
                </select>
                <input
                  className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Short review (optional)"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <button
                  onClick={handleRate}
                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white"
                >
                  Submit rating
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT: Actions */}
          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-200">
                Order actions
              </h2>

              {/* FREELANCER actions */}
              {isFreelancer && (
                <div className="space-y-2 text-xs">
                  {currentOrder.status === "pending" && (
                    <button
                      onClick={handleAccept}
                      className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-2 text-white text-xs"
                    >
                      Accept order
                    </button>
                  )}

                  {(currentOrder.status === "in_progress" ||
                    currentOrder.status === "revision_requested") && (
                    <div className="space-y-3">
                      <div className="text-xs">
                        <p className="text-slate-400 mb-2">Deliverables</p>

                        {deliverables.map((d, i) => (
                          <div
                            key={i}
                            className="space-y-2 mb-3 p-2 rounded-lg bg-slate-950/50 border border-slate-800"
                          >
                            <div className="flex flex-wrap gap-2">
                              <select
                                value={d.type}
                                onChange={(e) =>
                                  updateDeliverable(i, "type", e.target.value)
                                }
                                className="rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                              >
                                <option value="link">Link</option>
                                <option value="file">File</option>
                                <option value="text">Text</option>
                              </select>

                              <input
                                value={d.name}
                                onChange={(e) =>
                                  updateDeliverable(i, "name", e.target.value)
                                }
                                placeholder="Name"
                                className="flex-1 min-w-[80px] rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                              />

                              <button
                                onClick={() => removeDeliverableRow(i)}
                                className="rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs px-2 py-1"
                                type="button"
                              >
                                Remove
                              </button>
                            </div>

                            <input
                              value={d.url}
                              onChange={(e) =>
                                updateDeliverable(i, "url", e.target.value)
                              }
                              placeholder="URL (or cloud link)"
                              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                            />

                            <input
                              value={d.description}
                              onChange={(e) =>
                                updateDeliverable(
                                  i,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Short description (optional)"
                              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                            />
                          </div>
                        ))}

                        <div className="flex gap-2">
                          <button
                            onClick={addDeliverableRow}
                            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs text-slate-100"
                          >
                            + Add deliverable
                          </button>
                          <button
                            onClick={handleDeliver}
                            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs text-white"
                          >
                            Mark as delivered
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CLIENT actions */}
              {isClient && (
                <div className="space-y-3 text-xs">
                  {currentOrder.status === "delivered" && (
                    <div className="space-y-2">
                      <textarea
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows={2}
                        placeholder="Ask for changes (revision reason)"
                        value={revisionReason}
                        onChange={(e) => setRevisionReason(e.target.value)}
                      />
                      <button
                        onClick={handleRequestRevision}
                        className="w-full rounded-lg bg-purple-600 hover:bg-purple-500 px-3 py-2 text-white text-xs"
                      >
                        Request revision
                      </button>

                      <button
                        onClick={handleComplete}
                        className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-white text-xs"
                      >
                        Mark as completed
                      </button>
                    </div>
                  )}

                  {(currentOrder.status === "pending" ||
                    currentOrder.status === "in_progress") && (
                    <div className="space-y-2">
                      <textarea
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows={2}
                        placeholder="Reason for cancellation"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                      <button
                        onClick={handleCancel}
                        className="w-full rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-2 text-white text-xs"
                      >
                        Cancel order
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Dispute (both sides) */}
              {(isClient || isFreelancer) && (
                <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
                  <textarea
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={2}
                    placeholder="Dispute reason (only if serious issue)"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                  />
                  <button
                    onClick={handleDispute}
                    className="w-full rounded-lg bg-red-600/80 hover:bg-red-600 px-3 py-2 text-white text-xs"
                  >
                    Raise dispute
                  </button>
                </div>
              )}
            </section>

            {/* Meta info */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2 text-xs text-slate-400">
              <p>
                Created at:{" "}
                <span className="text-slate-200">
                  {new Date(currentOrder.createdAt).toLocaleString()}
                </span>
              </p>
              {currentOrder.completedAt && (
                <p>
                  Completed at:{" "}
                  <span className="text-slate-200">
                    {new Date(currentOrder.completedAt).toLocaleString()}
                  </span>
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

const PartyCard = ({ title, user, highlight }) => {
  const avatarLetter = user?.name?.[0]?.toUpperCase() || "?";
  return (
    <div
      className={`rounded-2xl border p-4 flex gap-3 ${
        highlight
          ? "border-blue-500/50 bg-blue-500/5"
          : "border-slate-800 bg-slate-900/70"
      }`}
    >
      <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center text-sm font-semibold text-slate-100">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          avatarLetter
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400">{title}</p>
        <p className="text-sm font-medium text-slate-50 truncate">
          {user?.name || "Unknown user"}
        </p>
        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
      </div>
    </div>
  );
};

const MessageBubble = ({ msg, currentUserId }) => {
  const isMine = msg.senderId?._id === currentUserId;
  const isAdminMsg = msg.senderId?.role === "admin";
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} text-xs`}>
      <div
        className={`max-w-[80%] rounded-xl px-3 py-2 relative flex flex-col ${
          isAdminMsg
            ? "bg-amber-600/20 border border-amber-500/40 text-amber-100 rounded-bl-sm"
            : isMine
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-slate-800 text-slate-100 rounded-bl-sm"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {msg.senderId?.profilePicture && (
            <img 
              src={msg.senderId.profilePicture} 
              alt="Avatar" 
              className="w-4 h-4 rounded-full object-cover"
            />
          )}
          {(!isMine || isAdminMsg) && (
            <p className="text-[10px] text-slate-300 font-semibold flex items-center gap-1">
              {msg.senderId?.name || "User"}
              {isAdminMsg && (
                <span className="bg-amber-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  Admin
                </span>
              )}
            </p>
          )}
        </div>
        
        {msg.attachments && msg.attachments.length > 0 && (
          <div className="mb-2 space-y-2">
            {msg.attachments.map((file, i) => {
              if (file.type === "image") {
                return <img key={i} src={file.url} alt="attachment" className="rounded-lg max-h-32 object-cover border border-slate-700/50" />
              } else if (file.type === "video") {
                return <video key={i} src={file.url} controls className="rounded-lg max-h-32 border border-slate-700/50" />
              } else if (file.type === "audio") {
                return <audio key={i} src={file.url} controls className="max-w-[150px] scale-75 origin-left" />
              }
              return (
                <a key={i} href={file.url} target="_blank" rel="noreferrer" className="text-[10px] underline flex gap-1 items-center bg-black/20 p-1.5 rounded">
                  📎 Attached file
                </a>
              )
            })}
          </div>
        )}

        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
        <p className={`text-[9px] mt-1 ${isMine ? "text-blue-200" : "text-slate-500"} self-end`}>
          {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
        </p>
      </div>
    </div>
  );
};

export default OrderDetailPage;

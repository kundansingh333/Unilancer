import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useOrderStore from "../../store/orderStore";
import useAuthStore from "../../store/authStore";
import { adminSendOrderMessage } from "../../api/adminApi";
import { uploadImage } from "../../api/uploadApi";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { 
  Paperclip, Smile, X, Video, Phone, Package, 
  CalendarDays, User, Briefcase, FileText, CheckCircle2, 
  AlertCircle, ChevronLeft, Clock, Send, ShieldAlert, Star
} from "lucide-react";
import SEO from "../../components/SEO";

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
        useOrderStore.setState((state) => {
          if (!state.currentOrder) return state;
          
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

  const initiateCall = (type) => {
    if (!currentOrder) return;
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
    window.scrollTo(0, 0);
  }, [id, fetchOrderById]);

  useEffect(() => {
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

  const isClient = currentOrder ? currentOrder.clientId?._id === user?._id : false;
  const isFreelancer = currentOrder ? currentOrder.freelancerId?._id === user?._id : false;
  const isAdmin = user?.role === "admin";

  const handleAccept = async () => {
    const res = await acceptOrder(id);
    if (!res.success) toast.error(res.error || "Failed to accept");
    else toast.success("Order accepted!");
  };

  const handleDeliver = async () => {
    const filtered = deliverables
      .map((d) => ({
        type: d.type,
        name: d.name || (d.type === "link" ? "Live link" : "File"),
        url: d.url,
        description: d.description || "",
      }))
      .filter((d) => d.url && d.url.trim().length > 0);

    if (filtered.length === 0) {
      return toast.error("Please provide at least one deliverable URL or file link.");
    }

    const res = await deliverWork(id, filtered);
    if (!res.success) toast.error(res.error || "Failed to deliver");
    else {
      toast.success("Work delivered successfully!");
      setDeliverables([{ type: "link", name: "", url: "", description: "" }]);
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionReason.trim()) return toast.error("Provide a reason for revision.");
    
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
          fetchOrderById(id);
          setMessageText("");
          setSelectedFile(null);
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
    if (rating < 1 || rating > 5) return toast.error("Rating must be between 1 and 5");
      
    const res = await rateOrder(id, { rating, review: reviewText.trim() });
    if (!res.success) toast.error(res.error || "Failed to submit rating");
    else {
      toast.success("Rating submitted!");
      setReviewText("");
    }
  };

  const updateDeliverable = (index, key, value) => {
    setDeliverables((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const addDeliverableRow = () => setDeliverables((prev) => [...prev, { type: "link", name: "", url: "", description: "" }]);
  const removeDeliverableRow = (index) => setDeliverables((prev) => prev.filter((_, i) => i !== index));

  if (isLoading || !currentOrder) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-slate-300 bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  const statusColors = {
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    in_progress: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    delivered: "text-teal-400 bg-teal-400/10 border-teal-400/20",
    revision_requested: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    cancelled: "text-slate-400 bg-slate-800/80 border-slate-700",
    disputed: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  const priceFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: currentOrder.currency || 'INR', maximumFractionDigits: 0 }).format(currentOrder.price || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title={`Order #${currentOrder.orderNumber || id.slice(-8)}`} path={`/orders/${id}`} noIndex />

      {/* HEADER BANNER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4 w-fit">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-medium text-slate-400 px-2.5 py-1 bg-slate-950 rounded-md border border-slate-800">
                  #{currentOrder.orderNumber || id.slice(-8)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[currentOrder.status] || "text-slate-300 bg-slate-800 border-slate-700"}`}>
                  {currentOrder.status.replace("_", " ")}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                {currentOrder.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Briefcase className="w-4 h-4" /> {currentOrder.category}
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-2 shrink-0 bg-slate-950/50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none border md:border-0 border-slate-800">
               <div className="text-left md:text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Order Value</p>
                  <p className="text-2xl font-bold text-emerald-400">{priceFormatted}</p>
               </div>
               <div className="text-right flex flex-col items-end">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Deadline</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    {currentOrder.deadline ? new Date(currentOrder.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}) : `${currentOrder.deliveryTime} Days`}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN CONTENT - LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> Order Requirements
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-sm text-slate-300">
                <p className="whitespace-pre-wrap leading-relaxed">{currentOrder.description}</p>
              </div>
            </section>

            {/* Delivered Work */}
            {currentOrder.deliveredWork?.length > 0 && (
              <section className="bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5" /> Delivered Work
                </h2>
                <div className="space-y-4">
                  {currentOrder.deliveredWork.map((dw, idx) => (
                    <div key={dw._id || idx} className="p-4 rounded-xl bg-slate-950/50 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-base font-bold text-white">{dw.name || "Deliverable"}</p>
                          {dw.description && <p className="text-sm text-slate-400 mt-1">{dw.description}</p>}
                        </div>
                        <span className="self-start px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-slate-900 text-emerald-400 border border-emerald-500/20">
                          {dw.type || "link"}
                        </span>
                      </div>
                      {dw.url && (
                        <a href={dw.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                          View Deliverable &rarr;
                        </a>
                      )}
                      <p className="text-[10px] font-medium text-slate-500 mt-3 pt-3 border-t border-slate-800/50">
                        Delivered on {new Date(dw.deliveredAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Revision History */}
            {currentOrder.revisionRequests?.length > 0 && (
              <section className="bg-amber-900/10 border border-amber-500/20 rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-amber-400 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Revision History
                </h2>
                <div className="space-y-4">
                  {currentOrder.revisionRequests.map((rev, idx) => (
                    <div key={rev._id || idx} className="p-4 rounded-xl bg-slate-950/50 border border-amber-500/20">
                      <p className="text-sm text-slate-200 leading-relaxed">
                        <span className="font-bold text-amber-500 mr-2 uppercase tracking-wider text-xs">Reason:</span>
                        {rev.reason}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 mt-3 pt-3 border-t border-slate-800/50">
                        Requested on {new Date(rev.requestedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Cancellations & Disputes */}
            {(currentOrder.cancellationReason || currentOrder.disputeReason) && (
              <section className="bg-rose-900/10 border border-rose-500/20 rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-rose-400 mb-6 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Issues & Resolutions
                </h2>
                <div className="space-y-4">
                  {currentOrder.cancellationReason && (
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-rose-500/20">
                      <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">Cancellation Reason</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{currentOrder.cancellationReason}</p>
                    </div>
                  )}
                  {currentOrder.disputeReason && (
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-rose-500/20">
                      <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">Dispute Reason</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{currentOrder.disputeReason}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Reviews */}
            {(currentOrder.clientRating || currentOrder.freelancerRating) && (
              <section className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-blue-400 mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5" /> Reviews & Feedback
                </h2>
                <div className="space-y-6">
                  {currentOrder.clientRating && (
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-blue-500/10">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Client Review</p>
                      <div className="flex items-center gap-1 text-amber-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < currentOrder.clientRating.rating ? "fill-amber-400" : "text-slate-700"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-slate-300 italic leading-relaxed">
                        "{currentOrder.clientRating.review || "No written review provided."}"
                      </p>
                    </div>
                  )}
                  {currentOrder.freelancerRating && (
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-blue-500/10">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Freelancer Feedback</p>
                      <div className="flex items-center gap-1 text-amber-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < currentOrder.freelancerRating.rating ? "fill-amber-400" : "text-slate-700"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-slate-300 italic leading-relaxed">
                        "{currentOrder.freelancerRating.review || "No written review provided."}"
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* CHAT INTERFACE */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[500px]">
              
              <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-3">
                   <h2 className="text-base font-bold text-white flex items-center gap-2">
                     Order Chat
                   </h2>
                   {typingUser && (
                     <span className="text-xs font-medium text-indigo-400 animate-pulse bg-indigo-500/10 px-2 py-0.5 rounded-full">
                       {typingUser} is typing...
                     </span>
                   )}
                </div>
                <div className="flex items-center gap-3">
                  {(isClient || isFreelancer) && (
                    <div className="flex gap-2">
                      <button onClick={() => initiateCall('voice')} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Voice Call">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button onClick={() => initiateCall('video')} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Video Call">
                        <Video className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button onClick={handleOpenChat} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider hidden sm:block">
                    Open Full Chat
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50 custom-scrollbar">
                {currentOrder.messages && currentOrder.messages.length > 0 ? (
                  currentOrder.messages.map((msg) => (
                    <MessageBubble key={msg._id || msg.sentAt} msg={msg} currentUserId={user?._id} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                    <Send className="w-8 h-8 opacity-20" />
                    <p className="text-sm font-medium">No messages yet. Start the conversation.</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-900 border-t border-slate-800 relative z-20">
                {selectedFile && (
                  <div className="mb-3 flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-xs font-medium text-slate-200 truncate">{selectedFile.name}</span>
                    </div>
                    <button onClick={() => setSelectedFile(null)} className="p-1 rounded-md text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {showEmojiPicker && (
                  <div className="absolute z-50 bottom-20 left-4 shadow-2xl">
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 shrink-0">
                    <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-700 rounded-lg transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                    <label className="p-2 cursor-pointer text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5" />
                      <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    </label>
                  </div>

                  <textarea
                    rows={1}
                    className="flex-1 max-h-32 min-h-[44px] rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all placeholder:text-slate-500 custom-scrollbar"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={handleMessageTyping}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!isUploading) handleSendMessage();
                      }
                    }}
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={isUploading}
                    className="h-[44px] px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold transition-colors flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20"
                  >
                    {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </section>

          </div>

          {/* SIDEBAR - RIGHT COLUMN */}
          <aside className="space-y-6">
            
            {/* Parties */}
            <div className="space-y-4">
              <PartyCard title="Client" user={currentOrder.clientId} highlight={isClient} />
              <PartyCard title="Freelancer" user={currentOrder.freelancerId} highlight={isFreelancer} />
            </div>

            {/* ORDER ACTIONS */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                Order Actions
              </h2>

              {/* FREELANCER actions */}
              {isFreelancer && (
                <div className="space-y-4">
                  {currentOrder.status === "pending" && (
                    <button onClick={handleAccept} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">
                      Accept Order
                    </button>
                  )}

                  {(currentOrder.status === "in_progress" || currentOrder.status === "revision_requested") && (
                    <div className="space-y-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submit Deliverables</p>
                      
                      <div className="space-y-3">
                        {deliverables.map((d, i) => (
                          <div key={i} className="space-y-2 p-3 rounded-xl bg-slate-900 border border-slate-700 relative group">
                            {deliverables.length > 1 && (
                              <button onClick={() => removeDeliverableRow(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs shadow-md">
                                <X className="w-3 h-3" />
                              </button>
                            )}
                            <div className="flex gap-2">
                              <select value={d.type} onChange={(e) => updateDeliverable(i, "type", e.target.value)} className="w-24 rounded-lg bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 appearance-none">
                                <option value="link">Link</option>
                                <option value="file">File</option>
                                <option value="text">Text</option>
                              </select>
                              <input value={d.name} onChange={(e) => updateDeliverable(i, "name", e.target.value)} placeholder="Title" className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500" />
                            </div>
                            <input value={d.url} onChange={(e) => updateDeliverable(i, "url", e.target.value)} placeholder="URL or Cloud link" className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500" />
                            <input value={d.description} onChange={(e) => updateDeliverable(i, "description", e.target.value)} placeholder="Short description (optional)" className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500" />
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        <button onClick={addDeliverableRow} className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-sm font-medium text-white transition-colors border border-slate-700">
                          + Add Another Item
                        </button>
                        <button onClick={handleDeliver} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all">
                          Submit Final Work
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CLIENT actions */}
              {isClient && (
                <div className="space-y-4">
                  {currentOrder.status === "delivered" && (
                    <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Review Delivery</p>
                      <button onClick={handleComplete} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all mb-4">
                        Accept & Complete Order
                      </button>
                      
                      <div className="pt-3 border-t border-slate-800">
                        <textarea className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 mb-2 resize-none" rows={2} placeholder="Explain what needs to be changed..." value={revisionReason} onChange={(e) => setRevisionReason(e.target.value)} />
                        <button onClick={handleRequestRevision} className="w-full rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white px-4 py-2 text-sm font-bold border border-purple-500/30 transition-all">
                          Request Revision
                        </button>
                      </div>
                    </div>
                  )}

                  {(currentOrder.status === "pending" || currentOrder.status === "in_progress") && (
                    <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Danger Zone</p>
                      <textarea className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 mb-2 resize-none" rows={2} placeholder="Reason for cancellation..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
                      <button onClick={handleCancel} className="w-full rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white px-4 py-2 text-sm font-bold border border-rose-500/30 transition-all">
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Dispute (both sides) */}
              {(isClient || isFreelancer) && !['completed', 'cancelled', 'disputed'].includes(currentOrder.status) && (
                <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Need Admin Help?</p>
                  <textarea className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-500 mb-2 resize-none" rows={2} placeholder="Explain the issue for admins..." value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} />
                  <button onClick={handleDispute} className="w-full rounded-xl bg-slate-800 hover:bg-red-600 px-4 py-2 text-slate-300 hover:text-white text-sm font-bold border border-slate-700 transition-all">
                    Raise Dispute
                  </button>
                </div>
              )}

              {['completed', 'cancelled', 'disputed'].includes(currentOrder.status) && (
                <div className="text-center p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                   <p className="text-sm font-medium text-slate-400">No further actions available for this order state.</p>
                </div>
              )}
            </section>

            {/* RATING */}
            {currentOrder.status === 'completed' && ((isClient && !currentOrder.clientRating) || (isFreelancer && !currentOrder.freelancerRating)) && (
              <section className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-indigo-500/20 pb-2">
                  Rate Experience
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Stars</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button key={r} onClick={() => setRating(r)} className="focus:outline-none">
                          <Star className={`w-8 h-8 ${r <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600 hover:text-amber-400/50"} transition-colors`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Review (Optional)</label>
                    <textarea className="w-full rounded-xl bg-slate-950/80 border border-indigo-500/30 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-400 resize-none" rows={3} placeholder="Share your experience working with them..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                  </div>
                  <button onClick={handleRate} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">
                    Submit Review
                  </button>
                </div>
              </section>
            )}

            {/* Meta info */}
            <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 text-xs text-slate-500 space-y-2 font-medium">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                <span>Created At</span>
                <span className="text-slate-300">{new Date(currentOrder.createdAt).toLocaleDateString()}</span>
              </div>
              {currentOrder.completedAt && (
                <div className="flex justify-between items-center pt-1">
                  <span>Completed At</span>
                  <span className="text-emerald-400">{new Date(currentOrder.completedAt).toLocaleDateString()}</span>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

const PartyCard = ({ title, user, highlight }) => {
  return (
    <div className={`rounded-2xl border p-5 flex items-center gap-4 transition-all ${highlight ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "border-slate-800 bg-slate-900/60"}`}>
      <div className={`h-12 w-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-inner ${highlight ? "bg-indigo-500/20 border-indigo-500/30 border" : "bg-slate-800 border-slate-700 border"}`}>
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <span className={`text-xl font-bold ${highlight ? "text-indigo-400" : "text-slate-400"}`}>{user?.name?.[0]?.toUpperCase() || "?"}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 ${highlight ? "text-indigo-400" : "text-slate-500"}`}>{title} {highlight && "(You)"}</p>
        <p className="text-sm font-bold text-white truncate">{user?.name || "Unknown user"}</p>
        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
      </div>
    </div>
  );
};

const MessageBubble = ({ msg, currentUserId }) => {
  const isMine = msg.senderId?._id === currentUserId;
  const isAdminMsg = msg.senderId?.role === "admin";
  
  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      {!isMine && !isAdminMsg && (
        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 overflow-hidden mr-2 shrink-0 mt-auto mb-1">
           {msg.senderId?.profilePicture ? <img src={msg.senderId.profilePicture} alt="Avatar" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">{msg.senderId?.name?.[0]?.toUpperCase()}</span>}
        </div>
      )}
      
      <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] relative group ${isMine ? "items-end" : "items-start"}`}>
        
        {isAdminMsg && (
           <span className="text-[10px] font-bold text-amber-500 mb-1 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 w-fit">
              <ShieldAlert className="w-3 h-3" /> Admin Message
           </span>
        )}

        <div className={`px-4 py-2.5 rounded-2xl ${
          isAdminMsg ? "bg-amber-600/20 border border-amber-500/30 text-amber-50 rounded-tl-sm" : 
          isMine ? "bg-indigo-600 text-white rounded-br-sm shadow-md shadow-indigo-600/20" : 
          "bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700/50"
        }`}>
          
          {msg.attachments && msg.attachments.length > 0 && (
            <div className="mb-2 space-y-2">
              {msg.attachments.map((file, i) => {
                if (file.type === "image") {
                  return <img key={i} src={file.url} alt="attachment" className="rounded-xl max-h-48 object-cover border border-slate-900/50" />
                } else if (file.type === "video") {
                  return <video key={i} src={file.url} controls className="rounded-xl max-h-48 border border-slate-900/50" />
                } else if (file.type === "audio") {
                  return <audio key={i} src={file.url} controls className="max-w-[200px] h-10" />
                }
                return (
                  <a key={i} href={file.url} target="_blank" rel="noreferrer" className="text-xs font-medium underline flex gap-1.5 items-center bg-black/20 p-2 rounded-lg hover:bg-black/30 transition-colors">
                    <FileText className="w-4 h-4" /> Attached Document
                  </a>
                )
              })}
            </div>
          )}

          <p className="whitespace-pre-wrap text-[13px] sm:text-sm leading-relaxed font-medium">{msg.content}</p>
        </div>
        
        <div className={`text-[10px] mt-1 text-slate-500 font-medium px-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMine ? "flex-row-reverse" : "flex-row"}`}>
           {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
           {isMine && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

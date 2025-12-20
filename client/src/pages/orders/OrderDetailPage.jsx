// src/pages/orders/OrderDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useOrderStore from "../../store/orderStore";
import useAuthStore from "../../store/authStore";

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

  // Deliverables list for freelancer
  const [deliverables, setDeliverables] = useState([
    { type: "link", name: "", url: "", description: "" },
  ]);

  const navigate = useNavigate();

  //messages
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

  const handleAccept = async () => {
    const res = await acceptOrder(id);
    if (!res.success) alert(res.error || "Failed to accept");
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
      return setError(
        "Please provide at least one deliverable URL or file link."
      );
    }

    const res = await deliverWork(id, filtered);
    if (!res.success) alert(res.error || "Failed to deliver");
    else {
      // clear deliverables (leave a single empty row)
      setDeliverables([{ type: "link", name: "", url: "", description: "" }]);
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionReason.trim())
      return setError("Provide a reason for revision.");
    const res = await requestRevision(id, revisionReason.trim());
    if (!res.success) alert(res.error || "Failed to request revision");
    else setRevisionReason("");
  };

  const handleComplete = async () => {
    const res = await completeOrder(id);
    if (!res.success) alert(res.error || "Failed to mark completed");
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return setError("Provide a reason to cancel.");
    const res = await cancelOrder(id, cancelReason.trim());
    if (!res.success) alert(res.error || "Failed to cancel order");
    else setCancelReason("");
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) return setError("Provide a dispute reason.");
    const res = await raiseDispute(id, disputeReason.trim());
    if (!res.success) alert(res.error || "Failed to raise dispute");
    else setDisputeReason("");
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return setError("Message cannot be empty.");
    const res = await addOrderMessage(id, messageText.trim(), []);
    if (!res.success) alert(res.error || "Failed to send message");
    else setMessageText("");
  };

  const handleRate = async () => {
    if (rating < 1 || rating > 5)
      return setError("Rating must be between 1 and 5");
    const res = await rateOrder(id, { rating, review: reviewText.trim() });
    if (!res.success) alert(res.error || "Failed to submit rating");
    else setReviewText("");
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
                    {currentOrder.requirements}
                  </p>
                </>
              )}
            </section>

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

              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">
                  Messages
                </h2>

                <button
                  onClick={handleOpenChat}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Open full chat
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {currentOrder.messages && currentOrder.messages.length > 0 ? (
                  currentOrder.messages.map((msg) => (
                    <MessageBubble
                      key={msg._id || msg.sentAt}
                      msg={msg}
                      currentUserId={user?._id}
                    />
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    No messages yet. Start the conversation.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white"
                >
                  Send
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
                            className="grid grid-cols-12 gap-2 items-center mb-2"
                          >
                            <select
                              value={d.type}
                              onChange={(e) =>
                                updateDeliverable(i, "type", e.target.value)
                              }
                              className="col-span-3 rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
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
                              className="col-span-3 rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                            />

                            <input
                              value={d.url}
                              onChange={(e) =>
                                updateDeliverable(i, "url", e.target.value)
                              }
                              placeholder="URL (or cloud link)"
                              className="col-span-4 rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                            />

                            <button
                              onClick={() => removeDeliverableRow(i)}
                              className="col-span-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs px-2 py-1"
                              type="button"
                            >
                              Remove
                            </button>

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
                              className="col-span-12 mt-1 rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
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
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} text-xs`}>
      <div
        className={`max-w-[80%] rounded-xl px-3 py-2 ${
          isMine
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-slate-800 text-slate-100 rounded-bl-sm"
        }`}
      >
        {!isMine && (
          <p className="text-[10px] text-slate-300 mb-0.5">
            {msg.senderId?.name || "User"}
          </p>
        )}
        <p className="whitespace-pre-wrap">{msg.content}</p>
        <p className="text-[9px] opacity-70 mt-1">
          {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : ""}
        </p>
      </div>
    </div>
  );
};

export default OrderDetailPage;

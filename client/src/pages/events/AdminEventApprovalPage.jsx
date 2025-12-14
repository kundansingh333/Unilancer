import { useEffect, useState } from "react";
import useAdminEventStore from "../../store/adminEventStore";

const AdminEventApprovalPage = () => {
  const {
    pendingEvents,
    loadPendingEvents,
    approve,
    reject,
    toggleFeature,
    loading,
    error,
  } = useAdminEventStore();

  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadPendingEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-slate-200">
        Loading pending events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-6">
      <h1 className="text-2xl font-semibold mb-5">Admin Event Approvals</h1>

      {error && <p className="text-red-400 text-sm mb-4">Error: {error}</p>}

      {pendingEvents.length === 0 ? (
        <p className="text-slate-400">No pending events 🎉</p>
      ) : (
        <div className="space-y-4">
          {pendingEvents.map((event) => (
            <div
              key={event._id}
              className="bg-slate-900/70 border border-slate-800 rounded-xl p-4"
            >
              <h2 className="text-lg font-bold">{event.title}</h2>
              <p className="text-slate-400 text-sm">{event.eventType}</p>

              <p className="text-sm mt-2">
                {event.description.slice(0, 150)}...
              </p>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => approve(event._id)}
                  className="px-4 py-2 bg-green-600 rounded-lg text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() => setSelectedId(event._id)}
                  className="px-4 py-2 bg-rose-600 rounded-lg text-sm"
                >
                  Reject
                </button>

                <button
                  onClick={() => toggleFeature(event._id, !event.isFeatured)}
                  className="px-4 py-2 bg-blue-600 rounded-lg text-sm"
                >
                  {event.isFeatured ? "Unfeature" : "Feature"}
                </button>
              </div>

              {/* REJECT POPUP */}
              {selectedId === event._id && (
                <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                  <textarea
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700"
                    placeholder="Reason for rejection…"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setSelectedId(null)}
                      className="px-3 py-1 bg-slate-700 rounded"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        reject(event._id, rejectReason);
                        setRejectReason("");
                        setSelectedId(null);
                      }}
                      className="px-3 py-1 bg-rose-600 rounded"
                    >
                      Submit Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEventApprovalPage;

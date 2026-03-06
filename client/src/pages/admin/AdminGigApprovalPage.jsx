import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useAdminStore from "../../store/adminStore";
import useAuthStore from "../../store/authStore";

const AdminGigApprovalPage = () => {
  const { user } = useAuthStore();
  const { pendingGigs, loading, error, loadPendingGigs, approveGigById, rejectGigById } = useAdminStore();

  // Only admin should access
  useEffect(() => {
    if (user?.role === "admin") {
      loadPendingGigs();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unauthorized
      </div>
    );
  }

  const handleApprove = async (id) => {
    const res = await approveGigById(id);
    if (res.success) {
      toast.success("Gig approved successfully");
    } else {
      toast.error(res.error || "Failed to approve gig");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Why are you rejecting this gig? (Required)");
    if (!reason || !reason.trim()) {
      return toast.error("A reason is required to reject a gig.");
    }
    const res = await rejectGigById(id, reason.trim());
    if (res.success) {
      toast.success("Gig rejected successfully");
    } else {
      toast.error(res.error || "Failed to reject gig");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <h1 className="text-2xl font-semibold">Gig Approvals</h1>
        <p className="text-sm text-slate-400">Review and approve freelance service gigs posted by students and alumni.</p>

        {loading && <p className="text-slate-400">Loading pending gigs...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {pendingGigs.length === 0 && !loading && (
          <p className="text-slate-400">No pending gigs 🎉</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingGigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col"
            >
              {gig.images && gig.images.length > 0 && (
                <img
                  src={gig.images[0]}
                  alt="Gig cover"
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="font-semibold text-lg leading-tight line-clamp-2">{gig.title}</h2>
                    <span className="shrink-0 font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs border border-emerald-400/20">
                      ₹{gig.pricing?.startingPrice || 0}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Category: {gig.category}</p>
                </div>
                
                <p className="text-sm text-slate-300 line-clamp-3">{gig.description}</p>
                
                <div className="text-xs text-slate-500 border-t border-slate-800 mt-2 pt-2">
                  <p>Posted by: {gig.createdBy?.name || "Unknown"} ({gig.createdBy?.role || "user"})</p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800 mt-auto">
                  <button
                    onClick={() => handleApprove(gig._id)}
                    className="flex-1 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(gig._id)}
                    className="flex-1 px-3 py-1.5 text-xs font-semibold rounded bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminGigApprovalPage;

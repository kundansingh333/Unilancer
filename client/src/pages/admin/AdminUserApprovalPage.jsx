import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAdminStore from "../../store/adminStore";
import useAuthStore from "../../store/authStore";

const AdminUserApprovalPage = () => {
  const { user } = useAuthStore();
  const { pendingUsers, loading, error, loadPendingUsers, approveUserById, rejectUserById } = useAdminStore();
  
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);

  // Only admin should access
  useEffect(() => {
    if (user?.role === "admin") {
      loadPendingUsers();
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
    const res = await approveUserById(id);
    if (res.success) {
      toast.success("User approved successfully");
    } else {
      toast.error(res.error || "Failed to approve user");
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    const res = await rejectUserById(id, rejectReason);
    if (res.success) {
      toast.success("User rejected successfully");
      setRejectingId(null);
      setRejectReason("");
    } else {
      toast.error(res.error || "Failed to reject user");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <h1 className="text-2xl font-semibold">User Approvals</h1>
        <p className="text-sm text-slate-400">Approve or reject pending Faculty and Alumni registrations.</p>

        {loading && <p className="text-slate-400">Loading pending users...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {pendingUsers.length === 0 && !loading && (
          <p className="text-slate-400">No pending users 🎉</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingUsers.map((u) => (
            <div
              key={u._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-lg">{u.name}</h2>
                  <span className={`px-2 py-1 text-[10px] font-medium rounded-full uppercase tracking-wider ${
                    u.role === "alumni" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    {u.role}
                  </span>
                </div>
                <p className="text-sm text-slate-400 truncate">{u.email}</p>

                <div className="bg-slate-950 rounded p-3 text-xs space-y-1 mt-2 border border-slate-800">
                  {u.role === "faculty" ? (
                    <>
                      <p><span className="text-slate-500">Department:</span> {u.department}</p>
                      <p><span className="text-slate-500">Designation:</span> {u.designation}</p>
                      <p><span className="text-slate-500">Employee ID:</span> {u.employeeId}</p>
                    </>
                  ) : (
                    <>
                      <p><span className="text-slate-500">Company:</span> {u.company}</p>
                      <p><span className="text-slate-500">Job Title:</span> {u.jobTitle}</p>
                      <p><span className="text-slate-500">Year passed:</span> {u.yearOfPassing}</p>
                      <p><span className="text-slate-500">Domain:</span> {u.domain}</p>
                    </>
                  )}
                </div>
              </div>

              {rejectingId === u._id ? (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Reason for rejection..."
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(u._id)}
                      className="flex-1 px-3 py-1.5 text-xs rounded bg-red-600 hover:bg-red-500 font-medium transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason("");
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleApprove(u._id)}
                    className="flex-1 px-3 py-1.5 text-xs rounded bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => setRejectingId(u._id)}
                    className="flex-1 px-3 py-1.5 text-xs rounded bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUserApprovalPage;

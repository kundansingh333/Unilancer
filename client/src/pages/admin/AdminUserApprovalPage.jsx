import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAdminStore from "../../store/adminStore";
import useAuthStore from "../../store/authStore";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Building2, 
  GraduationCap,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

const AdminUserApprovalPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { pendingUsers, loading, error, loadPendingUsers, approveUserById, rejectUserById } = useAdminStore();
  
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);

  // Only admin should access
  useEffect(() => {
    if (user?.role === "admin") {
      loadPendingUsers();
    }
  }, [user, loadPendingUsers]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-rose-500">
        <ShieldCheck className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold">Unauthorized Access</h2>
        <p className="text-slate-400 mt-2">You do not have permission to view this page.</p>
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="User Approvals" path="/admin/users/approvals" noIndex />

      {/* HEADER BANNER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4 w-fit">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                User Approvals
              </h1>
              <p className="text-sm text-slate-400">
                Review and manage pending Faculty and Alumni registrations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading pending users...
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {pendingUsers.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">All Caught Up!</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              There are no pending user registrations to review at this time.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingUsers.map((u) => (
            <div
              key={u._id}
              className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 rounded-2xl p-5 flex flex-col justify-between space-y-5 transition-all shadow-lg hover:shadow-blue-500/5"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h2 className="font-bold text-lg text-white truncate leading-tight mb-1">{u.name}</h2>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider border ${
                    u.role === "alumni" 
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  }`}>
                    {u.role === "faculty" ? <GraduationCap className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                    {u.role}
                  </span>
                </div>

                <div className="bg-slate-950/80 rounded-xl p-4 text-xs space-y-2 border border-slate-800 shadow-inner">
                  {u.role === "faculty" ? (
                    <>
                      <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Department</span> <span className="font-semibold text-slate-200">{u.department}</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Designation</span> <span className="font-semibold text-slate-200">{u.designation}</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Employee ID</span> <span className="font-mono font-semibold text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">{u.employeeId}</span></div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Company</span> <span className="font-semibold text-slate-200">{u.company}</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Job Title</span> <span className="font-semibold text-slate-200">{u.jobTitle}</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Graduation Year</span> <span className="font-semibold text-slate-200">{u.yearOfPassing}</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Domain</span> <span className="font-semibold text-slate-200">{u.domain}</span></div>
                    </>
                  )}
                </div>
              </div>

              {rejectingId === u._id ? (
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <textarea
                    rows={2}
                    placeholder="Reason for rejection..."
                    className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason("");
                      }}
                      className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors border border-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReject(u._id)}
                      className="flex-1 px-4 py-2 text-xs rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-lg shadow-rose-500/20"
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setRejectingId(u._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-bold"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleApprove(u._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all font-bold"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
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

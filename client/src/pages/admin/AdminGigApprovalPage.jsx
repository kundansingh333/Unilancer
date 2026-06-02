import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useAdminStore from "../../store/adminStore";
import useAuthStore from "../../store/authStore";
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Image as ImageIcon,
  ShieldCheck,
  ChevronLeft,
  User,
  Tag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

const AdminGigApprovalPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { pendingGigs, loading, error, loadPendingGigs, approveGigById, rejectGigById } = useAdminStore();

  useEffect(() => {
    if (user?.role === "admin") {
      loadPendingGigs();
    }
  }, [user, loadPendingGigs]);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="Gig Approvals" path="/admin/gigs/approvals" noIndex />

      {/* HEADER BANNER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4 w-fit">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Gig Approvals
              </h1>
              <p className="text-sm text-slate-400">
                Review and manage pending freelance service gigs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading pending gigs...
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {pendingGigs.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">All Caught Up!</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              There are no pending gig postings to review at this time.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingGigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 rounded-2xl flex flex-col transition-all shadow-lg hover:shadow-purple-500/5 overflow-hidden"
            >
              <div className="h-40 w-full relative bg-slate-800 border-b border-slate-800 shrink-0">
                {gig.images && gig.images.length > 0 ? (
                  <img
                    src={gig.images[0]}
                    alt={gig.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-10 h-10 opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 shadow-sm">
                  <span className="font-bold text-emerald-400 text-sm">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(gig.pricing?.startingPrice || 0)}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col space-y-4">
                <div className="min-w-0">
                  <h2 className="font-bold text-lg text-white leading-tight line-clamp-2 mb-2 group-hover:text-purple-400 transition-colors">
                    {gig.title}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-700">
                    <Tag className="w-3 h-3 text-purple-400" /> {gig.category}
                  </span>
                </div>

                <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed flex-1">
                  {gig.description}
                </p>

                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs text-slate-400 shadow-inner mt-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span className="truncate">Posted by: <span className="font-medium text-slate-300">{gig.createdBy?.name || "Unknown"}</span> ({gig.createdBy?.role || "user"})</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-px bg-slate-800 border-t border-slate-800">
                <button
                  onClick={() => handleReject(gig._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs bg-slate-900/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-all font-bold group"
                >
                  <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> Reject
                </button>
                <button
                  onClick={() => handleApprove(gig._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs bg-slate-900/80 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-bold group"
                >
                  <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminGigApprovalPage;

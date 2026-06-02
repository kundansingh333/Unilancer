import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAdminStore from "../../store/adminStore";
import useAuthStore from "../../store/authStore";
import { 
  AlertOctagon, 
  ShieldAlert, 
  ChevronLeft, 
  AlertCircle,
  CheckCircle,
  Hash,
  User,
  Briefcase
} from "lucide-react";
import SEO from "../../components/SEO";

const AdminDisputedOrdersPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { disputedOrders, loading, error, loadDisputedOrders } = useAdminStore();

  useEffect(() => {
    if (user?.role === "admin") {
      loadDisputedOrders();
    }
  }, [user, loadDisputedOrders]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-rose-500">
        <ShieldAlert className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold">Unauthorized Access</h2>
        <p className="text-slate-400 mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="Disputed Orders" path="/admin/orders/disputed" noIndex />

      {/* HEADER BANNER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4 w-fit">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Disputed Orders
              </h1>
              <p className="text-sm text-slate-400">
                Mediate and resolve conflicts between clients and freelancers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading disputed orders...
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && disputedOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Disputes</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              There are no disputed orders currently requiring your attention. Everything is running smoothly!
            </p>
          </div>
        )}

        <div className="grid gap-5">
          {disputedOrders.map((order) => (
            <div key={order._id} className="bg-slate-900/60 border border-rose-500/30 rounded-2xl p-6 flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center shadow-lg hover:shadow-rose-500/5 transition-all">
              <div className="space-y-4 flex-1 w-full min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-bold text-lg text-white flex items-center gap-2">
                    <Hash className="w-5 h-5 text-rose-400" />
                    {order.orderNumber || order._id.slice(-6).toUpperCase()}
                  </h2>
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                    Disputed
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
                   <div className="space-y-2 flex-1">
                      <p className="text-slate-400 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="truncate"><span className="text-slate-500 font-medium">Gig:</span> {order.gigId?.title || "Unknown Gig"}</span>
                      </p>
                      <p className="text-slate-400 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate"><span className="text-slate-500 font-medium">Client:</span> {order.clientId?.name || "Unknown"}</span>
                      </p>
                      <p className="text-slate-400 flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate"><span className="text-slate-500 font-medium">Freelancer:</span> {order.freelancerId?.name || "Unknown"}</span>
                      </p>
                   </div>
                   
                   <div className="sm:w-1/3 bg-slate-950/80 p-4 rounded-xl border border-rose-500/20 flex flex-col justify-center">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Order Value</p>
                     <p className="text-xl font-bold text-emerald-400">
                       {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency || 'INR', maximumFractionDigits: 0 }).format(order.price || 0)}
                     </p>
                   </div>
                </div>

                {order.disputeReason && (
                  <div className="bg-rose-500/5 border-l-4 border-rose-500 p-3 rounded-r-xl mt-2">
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Reason for Dispute</p>
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      "{order.disputeReason}"
                    </p>
                  </div>
                )}
              </div>
              
              <Link 
                to={`/orders/${order._id}`}
                className="w-full sm:w-auto shrink-0 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all text-center flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" /> Intervene
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDisputedOrdersPage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useOrderStore from "../../store/orderStore";
import useAuthStore from "../../store/authStore";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ListFilter,
  Search,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";
import SEO from "../../components/SEO";

const statusOptions = [
  "all",
  "pending",
  "in_progress",
  "delivered",
  "revision_requested",
  "completed",
  "cancelled",
  "disputed",
];

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "client", label: "As Client" },
  { value: "freelancer", label: "As Freelancer" },
];

const OrdersPage = () => {
  const { user } = useAuthStore();
  const { orders, isLoading, error, fetchOrders, stats, fetchOrderStats } = useOrderStore();

  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    if (user) {
      const query = {};
      if (statusFilter !== "all") query.status = statusFilter;
      if (roleFilter !== "all") query.role = roleFilter;
      fetchOrders(query);
      fetchOrderStats();
      window.scrollTo(0, 0);
    }
  }, [user, statusFilter, roleFilter, fetchOrders, fetchOrderStats]);

  // Defensive defaults
  const safeOrders = orders ?? [];
  const safeStats = stats ?? { active: 0, completed: 0, cancelled: 0 };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="My Orders" path="/orders" noIndex />

      {/* HEADER BANNER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  My Orders
                </h1>
                <p className="text-sm text-slate-400">
                  Track and manage your active freelance projects.
                </p>
              </div>
            </div>

            {/* Quick Stats inside Header */}
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <StatPill label="Active" value={safeStats.active} icon={<Activity className="w-3.5 h-3.5" />} color="blue" />
              <StatPill label="Completed" value={safeStats.completed} icon={<CheckCircle2 className="w-3.5 h-3.5" />} color="emerald" />
              <StatPill label="Cancelled" value={safeStats.cancelled} icon={<XCircle className="w-3.5 h-3.5" />} color="rose" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* FILTERS */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-xl">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar flex-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/50 rounded-lg border border-slate-800 shrink-0">
              <ListFilter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Status</span>
            </div>
            <div className="flex gap-2">
              {statusOptions.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-transparent hover:border-slate-600"
                  }`}
                >
                  {st === "all" ? "All Orders" : st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ORDER LIST */}
        <div className="space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              Loading orders...
            </div>
          )}

          {!isLoading && safeOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No orders found</h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                You don't have any orders matching the current filters. Start a new project to get things moving.
              </p>
              <div className="flex gap-4">
                <Link to="/gigs" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">
                  Hire Freelancer
                </Link>
                <Link to="/gigs" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold border border-slate-700 transition-all">
                  Find Work
                </Link>
              </div>
            </div>
          )}

          {!isLoading && safeOrders.length > 0 && (
            <div className="grid gap-4">
              {safeOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENTS

const StatPill = ({ label, value, icon, color }) => {
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border shrink-0 ${colorMap[color]}`}>
      <div className="opacity-80">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 leading-none mb-1">{label}</p>
        <p className="text-sm font-bold leading-none">{value}</p>
      </div>
    </div>
  );
};

const statusColors = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  delivered: "bg-teal-500/10 text-teal-400 border-teal-500/30",
  revision_requested: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-slate-800/80 text-slate-400 border-slate-700",
  disputed: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

const OrderCard = ({ order }) => {
  const statusClass = `inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${statusColors[order.status] || "bg-slate-800 text-slate-300 border-slate-700"}`;
  
  // Format price
  const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency || 'INR', maximumFractionDigits: 0 }).format(order.price || 0);

  return (
    <Link to={`/orders/${order._id}`} className="block group">
      <div className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 rounded-2xl p-5 sm:p-6 transition-all shadow-lg hover:shadow-indigo-500/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono font-medium text-slate-500 px-2 py-1 bg-slate-950 rounded-md border border-slate-800">
                #{order.orderNumber || (order._id ? order._id.slice(-8) : "—")}
              </span>
              <span className={statusClass}>
                {order.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {order.status === 'in_progress' && <Activity className="w-3.5 h-3.5" />}
                {order.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                {order.status === 'disputed' && <AlertCircle className="w-3.5 h-3.5" />}
                {order.status.replace("_", " ")}
              </span>
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
                {order.title}
              </h2>
              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                {order.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-md">
                <TrendingUp className="w-3.5 h-3.5" /> {order.category}
              </span>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800 md:pl-6 shrink-0 min-w-[140px]">
            <div className="text-left md:text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">Order Value</p>
              <p className="text-xl font-bold text-white">{price}</p>
            </div>
            
            {order.deadline && (
              <div className="text-right flex flex-col items-end">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">Deadline</p>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  {new Date(order.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                </div>
              </div>
            )}
            
            <div className="hidden md:flex items-center gap-1 text-sm font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all mt-2">
              View Order <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
        </div>
      </div>
    </Link>
  );
};

export default OrdersPage;

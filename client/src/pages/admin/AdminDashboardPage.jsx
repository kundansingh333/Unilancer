import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAdminStore from "../../store/adminStore";
import useAuthStore from "../../store/authStore";
import { 
  LogOut, 
  ShieldCheck, 
  Users, 
  Banknote, 
  ShoppingCart, 
  Briefcase, 
  CalendarDays,
  Activity,
  AlertTriangle,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import SEO from "../../components/SEO";

const AdminDashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { stats, loading, error, loadDashboardStats } = useAdminStore();

  useEffect(() => {
    if (user?.role === "admin") {
      loadDashboardStats();
    }
  }, [user, loadDashboardStats]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-rose-500">
        <ShieldCheck className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold">Unauthorized Access</h2>
        <p className="text-slate-400 mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="Admin Dashboard" path="/admin/dashboard" noIndex />

      {/* HEADER BANNER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-slate-400">
                  Platform overview, analytics, and moderation queues.
                </p>
              </div>
            </div>
            <button 
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl transition-all text-sm font-bold shadow-lg hover:shadow-rose-500/20"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading analytics...
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {stats && !loading && (
          <div className="space-y-8">
            {/* OVERVIEW STATS */}
            <section>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" /> Platform Overview
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard title="Total Users" value={stats.overview.totalUsers} icon={<Users className="w-6 h-6 sm:w-8 sm:h-8" />} color="blue" />
                <StatCard title="Total Revenue" value={`₹${stats.revenue.total}`} icon={<Banknote className="w-6 h-6 sm:w-8 sm:h-8" />} color="emerald" />
                <StatCard title="Total Orders" value={stats.overview.totalOrders} icon={<ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />} color="purple" />
                <StatCard title="Total Gigs" value={stats.overview.totalGigs} icon={<Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />} color="amber" />
              </div>
            </section>

            {/* MODERATION QUEUES */}
            <section>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-400" /> Moderation & Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <ActionCard 
                  title="Pending Users" 
                  count={stats.pendingApprovals.users} 
                  link="/admin/users/approvals" 
                  desc="Faculty & Alumni waiting for verification"
                  icon={<Users className="w-5 h-5 text-blue-400" />}
                />
                <ActionCard 
                  title="Pending Jobs" 
                  count={stats.pendingApprovals.jobs} 
                  link="/admin/jobs/approvals" 
                  desc="Jobs waiting to be listed"
                  icon={<Briefcase className="w-5 h-5 text-indigo-400" />}
                />
                <ActionCard 
                  title="Pending Events" 
                  count={stats.pendingApprovals.events} 
                  link="/admin/events/approvals" 
                  desc="Events waiting to be published"
                  icon={<CalendarDays className="w-5 h-5 text-purple-400" />}
                />
                <ActionCard 
                  title="Pending Gigs" 
                  count={stats.pendingApprovals.gigs} 
                  link="/admin/gigs/approvals" 
                  desc="Freelance gigs waiting for approval"
                  icon={<Briefcase className="w-5 h-5 text-emerald-400" />}
                />
                <ActionCard 
                  title="Disputed Orders" 
                  count={stats.pendingApprovals.disputedOrders || 0} 
                  link="/admin/orders/disputed" 
                  desc="Resolve order conflicts between clients and freelancers"
                  customActionText="Intervene"
                  icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
                  isUrgent={true}
                />
                <ActionCard 
                  title="Deleted Users" 
                  count={stats.pendingApprovals.deletedUsers || 0} 
                  link="/admin/deleted-users" 
                  desc="Archive of purged accounts"
                  customActionText="View Archive"
                  icon={<Users className="w-5 h-5 text-slate-400" />}
                />
              </div>
            </section>

            {/* DEMOGRAPHICS & RECENT ACTIVITY */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* Demographics */}
              <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" /> User Demographics
                </h3>
                <div className="space-y-4">
                  {Object.entries(stats.usersByRole || {}).map(([role, count]) => (
                    <div key={role} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                      <span className="capitalize text-slate-300 font-medium">{role}s</span>
                      <span className="font-bold bg-slate-800 text-slate-200 px-3 py-1 rounded-lg border border-slate-700">{count}</span>
                    </div>
                  ))}
                  {Object.keys(stats.usersByRole || {}).length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">No data available.</p>
                  )}
                </div>
              </section>

              {/* Growth */}
              <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" /> 7-Day Growth
                </h3>
                <div className="space-y-4">
                  <GrowthRow label="New Users Joined" value={stats.recentActivity.newUsers} />
                  <GrowthRow label="New Gigs Posted" value={stats.recentActivity.newGigs} />
                  <GrowthRow label="New Jobs Posted" value={stats.recentActivity.newJobs} />
                  <GrowthRow label="New Events Created" value={stats.recentActivity.newEvents} />
                  <GrowthRow label="New Orders Placed" value={stats.recentActivity.newOrders} />
                </div>
              </section>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: "from-blue-500/20 to-indigo-500/10 border-blue-500/20 text-blue-400",
    emerald: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-400",
    purple: "from-purple-500/20 to-fuchsia-500/10 border-purple-500/20 text-purple-400",
    amber: "from-amber-500/20 to-orange-500/10 border-amber-500/20 text-amber-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5 sm:p-6 flex items-center justify-between group hover:brightness-110 transition-all`}>
      <div>
        <p className="text-slate-400 text-[10px] sm:text-xs mb-1 uppercase tracking-wider font-bold truncate group-hover:text-slate-300 transition-colors">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold truncate text-white">{value}</p>
      </div>
      <div className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
    </div>
  );
};

const ActionCard = ({ title, count, link, desc, icon, customActionText = "Manage Queue", isUrgent = false }) => (
  <Link to={link} className="block group h-full">
    <div className={`bg-slate-900/60 border ${isUrgent && count > 0 ? 'border-rose-500/30' : 'border-slate-800'} hover:border-blue-500/50 hover:bg-slate-900 rounded-2xl p-5 transition-all h-full flex flex-col justify-between`}>
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
              {icon}
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-200 group-hover:text-blue-400 transition-colors truncate">{title}</h3>
          </div>
          {count > 0 ? (
            <span className={`${isUrgent ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-blue-500 text-white'} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
              {count} NEW
            </span>
          ) : (
            <span className="bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {title === "Deleted Users" ? "ARCHIVE" : "0"}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">{desc}</p>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-blue-400 transition-colors">
        <span>{customActionText}</span>
        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);

const GrowthRow = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950/50 border border-slate-800">
    <span className="text-sm text-slate-300 font-medium">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-bold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{value}</span>
      {value > 0 ? (
        <TrendingUp className="w-4 h-4 text-emerald-500" />
      ) : (
        <span className="text-slate-600 text-xs w-4 text-center">-</span>
      )}
    </div>
  </div>
);

export default AdminDashboardPage;

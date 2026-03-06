import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAdminStore from "../../store/adminStore";
import useAuthStore from "../../store/authStore";

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const { stats, loading, error, loadDashboardStats } = useAdminStore();

  useEffect(() => {
    if (user?.role === "admin") {
      loadDashboardStats();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unauthorized
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Platform overview, analytics, and moderation queues.
          </p>
        </div>

        {loading && <p className="text-slate-400">Loading dashboard analytics...</p>}
        {error && <p className="text-red-400 border border-red-500/20 bg-red-500/10 p-4 rounded">{error}</p>}

        {stats && (
          <div className="space-y-8">
            {/* Overview Stats */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Platform Overview</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats.overview.totalUsers} icon="👥" color="blue" />
                <StatCard title="Total Revenue" value={`₹${stats.revenue.total}`} icon="💰" color="emerald" />
                <StatCard title="Total Orders" value={stats.overview.totalOrders} icon="🛒" color="purple" />
                <StatCard title="Total Gigs" value={stats.overview.totalGigs} icon="💼" color="orange" />
              </div>
            </section>

            {/* Moderation Queues */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Admin Actions</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <ActionCard 
                  title="Pending Users" 
                  count={stats.pendingApprovals.users} 
                  link="/admin/users/approvals" 
                  desc="Faculty & Alumni waiting for verification"
                />
                <ActionCard 
                  title="Pending Jobs" 
                  count={stats.pendingApprovals.jobs} 
                  link="/admin/jobs/approvals" 
                  desc="Jobs waiting to be listed"
                />
                <ActionCard 
                  title="Pending Events" 
                  count={stats.pendingApprovals.events} 
                  link="/admin/events/approvals" 
                  desc="Events waiting to be published"
                />
                <ActionCard 
                  title="Pending Gigs" 
                  count={stats.pendingApprovals.gigs} 
                  link="/admin/gigs/approvals" 
                  desc="Freelance gigs waiting for approval"
                />
                <ActionCard 
                  title="Disputed Orders" 
                  count={stats.pendingApprovals.disputedOrders || 0} 
                  link="/admin/orders/disputed" 
                  desc="Resolve order conflicts between clients and freelancers"
                  customActionText="Intervene"
                />
                <ActionCard 
                  title="Deleted Users" 
                  count={stats.pendingApprovals.deletedUsers || 0} 
                  link="/admin/deleted-users" 
                  desc="Archive of purged accounts"
                  customActionText="View Archive"
                />
              </div>
            </section>

            {/* Recent Activity */}
            <section className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold mb-4 text-slate-300">New User Roles</h3>
                <div className="space-y-3 print:space-y-0">
                  {Object.entries(stats.usersByRole || {}).map(([role, count]) => (
                    <div key={role} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                      <span className="capitalize text-slate-400">{role}s</span>
                      <span className="font-mono bg-slate-800 px-2 py-0.5 rounded">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold mb-4 text-slate-300">Past 7 Days Growth</h3>
                <div className="space-y-3">
                  <GrowthRow label="New Users Joined" value={stats.recentActivity.newUsers} />
                  <GrowthRow label="New Gigs Posted" value={stats.recentActivity.newGigs} />
                  <GrowthRow label="New Jobs Posted" value={stats.recentActivity.newJobs} />
                  <GrowthRow label="New Events Created" value={stats.recentActivity.newEvents} />
                  <GrowthRow label="New Orders Placed" value={stats.recentActivity.newOrders} />
                </div>
              </div>
            </section>
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
    orange: "from-orange-500/20 to-rose-500/10 border-orange-500/20 text-orange-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-5 flex items-center justify-between`}>
      <div>
        <p className="text-slate-400 text-[10px] sm:text-xs mb-1 uppercase tracking-wider font-semibold truncate">{title}</p>
        <p className="text-xl sm:text-2xl font-bold truncate">{value}</p>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  );
};

const ActionCard = ({ title, count, link, desc, customActionText = "Manage Approvals →" }) => (
  <Link to={link} className="block group">
    <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 rounded-xl p-5 transition-all h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm sm:text-base text-slate-200 group-hover:text-blue-400 transition-colors truncate">{title}</h3>
          {count > 0 ? (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {count} NEW
            </span>
          ) : (
            <span className="bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {title === "Deleted Users" ? "ARCHIVE" : "0"}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 line-clamp-2">{desc}</p>
      </div>
      <div className="text-blue-500 text-xs mt-4 flex items-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        {customActionText}
      </div>
    </div>
  </Link>
);

const GrowthRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 last:border-0 last:pb-0">
    <span className="text-slate-400">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-bold">{value}</span>
      {value > 0 ? (
        <span className="text-emerald-500 text-xs">↑</span>
      ) : (
        <span className="text-slate-600 text-xs">-</span>
      )}
    </div>
  </div>
);

export default AdminDashboardPage;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import OrderStatsBox from "../orders/OrderStatsBox.jsx";
import useOrderStore from "../../store/orderStore";
import { 
  Briefcase, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  MailCheck, 
  AlertCircle, 
  CalendarDays,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import SEO from "../../components/SEO";

const roleColors = {
  student: "from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30",
  alumni: "from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30",
  faculty: "from-blue-500/20 to-sky-500/10 text-blue-300 border-blue-500/30",
  admin: "from-rose-500/20 to-pink-500/10 text-rose-300 border-rose-500/30",
};

const DashboardPage = () => {
  const { user, loadUserFromToken, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { stats, fetchOrderStats, isStatsLoading } = useOrderStore();

  useEffect(() => {
    if (!user) loadUserFromToken();
  }, [user, loadUserFromToken]);

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [user, isLoading, navigate]);

  useEffect(() => {
    fetchOrderStats();
  }, [fetchOrderStats]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Loading dashboard...
      </div>
    );
  }

  const roleBadgeClass = `inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r border ${roleColors[user.role] || "from-slate-700/60 to-slate-800/60 text-slate-200 border-slate-600"}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20">
      <SEO title="Dashboard" path="/dashboard" noIndex />
      
      {/* HEADER BANNER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-xl shadow-blue-500/20">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl sm:text-4xl font-bold text-white">{user.name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 border-4 border-slate-900 rounded-full" title="Online"></div>
              </div>
              
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white">
                    Hi, {user.name.split(' ')[0]} 👋
                  </h1>
                  <span className={roleBadgeClass}>
                    {user.role === 'student' && <GraduationCap className="w-3.5 h-3.5" />}
                    {user.role === 'alumni' && <Briefcase className="w-3.5 h-3.5" />}
                    {user.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                    {user.role === 'faculty' && <User className="w-3.5 h-3.5" />}
                    {user.role || "USER"}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-400">
                  Welcome to your Unilancer workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors border border-slate-700"
              >
                <User className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN CONTENT - LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <OverviewStats user={user} />
            
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <LayoutDashboard className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                {user.role === "student" && <StudentDashboard user={user} />}
                {user.role === "alumni" && <AlumniDashboard user={user} />}
                {user.role === "faculty" && <FacultyDashboard user={user} />}
                {user.role === "admin" && <AdminDashboard user={user} stats={stats} isStatsLoading={isStatsLoading} />}
              </div>
            </div>
          </div>

          {/* SIDEBAR - RIGHT COLUMN */}
          <aside className="space-y-6">
            <ProfileCard user={user} />
            <QuickActions user={user} navigate={navigate} />
          </aside>

        </div>
      </div>
    </div>
  );
};

/* ---------- REUSABLE STAT CARD ---------- */
const StatCard = ({ label, value, hint, icon, color = "blue" }) => {
  const colorMap = {
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    rose: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  };
  const theme = colorMap[color];

  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 hover:bg-slate-800/80 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${theme}`}>
          {icon}
        </div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="text-sm font-medium text-slate-300 mb-1 group-hover:text-white transition-colors">{label}</p>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
};

/* ---------- OVERVIEW STATS ---------- */
const OverviewStats = ({ user }) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-bold text-white">Account Status</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Email Status"
          value={user.emailVerified ? "Verified" : "Pending"}
          hint={user.emailVerified ? "Your email is confirmed." : "Check inbox to verify."}
          icon={user.emailVerified ? <MailCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          color={user.emailVerified ? "emerald" : "amber"}
        />
        <StatCard
          label="Account Approval"
          value={user.isBlocked ? "Blocked" : user.isApproved ? "Approved" : "Pending"}
          hint={user.role === "student" ? "Auto-approved" : "Admin validation"}
          icon={user.isApproved && !user.isBlocked ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          color={user.isBlocked ? "rose" : user.isApproved ? "blue" : "amber"}
        />
        <StatCard
          label="Member Since"
          value={user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric'}) : "-"}
          hint="Joined Unilancer"
          icon={<CalendarDays className="w-5 h-5" />}
          color="purple"
        />
      </div>
    </section>
  );
};

/* ---------- SIDEBAR PROFILE CARD ---------- */
const ProfileCard = ({ user }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Profile Details</h3>
      
      <div className="space-y-4 text-sm">
        {user.college && (
          <div>
            <p className="text-xs text-slate-500 mb-0.5">College</p>
            <p className="font-medium text-slate-200">{user.college}</p>
          </div>
        )}

        {user.role === "student" && (
          <div className="grid grid-cols-2 gap-4">
            {user.branch && (
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Branch</p>
                <p className="font-medium text-slate-200">{user.branch}</p>
              </div>
            )}
            {user.year && (
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Year</p>
                <p className="font-medium text-slate-200">{user.year}</p>
              </div>
            )}
            {user.rollNumber && (
              <div className="col-span-2">
                <p className="text-xs text-slate-500 mb-0.5">Roll No.</p>
                <p className="font-medium text-slate-200">{user.rollNumber}</p>
              </div>
            )}
          </div>
        )}

        {user.role === "alumni" && (
          <div className="space-y-4">
            {user.company && (
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Company</p>
                <p className="font-medium text-slate-200">{user.company}</p>
              </div>
            )}
            {user.jobTitle && (
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Job Title</p>
                <p className="font-medium text-slate-200">{user.jobTitle}</p>
              </div>
            )}
            {user.yearOfPassing && (
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Year of Passing</p>
                <p className="font-medium text-slate-200">{user.yearOfPassing}</p>
              </div>
            )}
          </div>
        )}

        {user.role === "faculty" && (
          <div className="space-y-4">
            {user.department && (
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Department</p>
                <p className="font-medium text-slate-200">{user.department}</p>
              </div>
            )}
            {user.designation && (
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Designation</p>
                <p className="font-medium text-slate-200">{user.designation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const QuickActions = ({ user, navigate }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">Quick Actions</h3>
      <div className="flex flex-col gap-2.5">
        
        {/* EVENTS SECTION */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-purple-400 px-2">Events</p>
          <button onClick={() => navigate("/events/my/registered")} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-sm font-medium text-slate-300 transition-colors border border-transparent hover:border-slate-700">
            Registered Events <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
          <button onClick={() => navigate("/events/my/organized")} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-sm font-medium text-slate-300 transition-colors border border-transparent hover:border-slate-700">
            Organized Events <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
          {user.role === "faculty" && (
            <button onClick={() => navigate("/events/create")} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white text-sm font-bold transition-colors border border-purple-500/30">
              Create New Event
            </button>
          )}
        </div>

        {/* GIGS & JOBS SECTION */}
        {(user.role === "student" || user.role === "alumni") && (
          <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold text-blue-400 px-2 mt-2">Freelance & Careers</p>
            <button onClick={() => navigate("/gigs/create")} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-colors">
              Create Freelance Gig
            </button>
            <button onClick={() => navigate("/gigs/my")} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-sm font-medium text-slate-300 transition-colors border border-transparent hover:border-slate-700">
              Manage My Gigs <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
            <button onClick={() => navigate("/jobs/my/applications")} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-sm font-medium text-slate-300 transition-colors border border-transparent hover:border-slate-700">
              My Job Applications <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        )}

        {/* POSTING JOBS (Alumni, Faculty, Admin) */}
        {(user.role === "faculty" || user.role === "admin" || user.role === "alumni") && (
          <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold text-emerald-400 px-2 mt-2">Hiring</p>
            <button onClick={() => navigate("/jobs/my/posted")} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-sm font-medium text-slate-300 transition-colors border border-emerald-500/30 hover:border-emerald-500">
              My Posted Jobs <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        )}

        {/* ADMIN */}
        {user.role === "admin" && (
          <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold text-rose-400 px-2 mt-2">Administration</p>
            <button onClick={() => navigate("/admin/dashboard")} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-500/20 transition-colors">
              Open Admin Panel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

/* ---------- ROLE-SPECIFIC SECTIONS ---------- */

const StudentDashboard = () => (
  <section className="space-y-6 relative z-10">
    <div className="flex items-center gap-2 mb-6">
      <GraduationCap className="w-6 h-6 text-emerald-400" />
      <h2 className="text-xl font-bold text-white">Student Workspace</h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Active Orders" value="0" hint="Gigs currently in progress" icon={<Activity className="w-5 h-5" />} color="blue" />
      <StatCard label="Completed Orders" value="0" hint="Successfully delivered gigs" icon={<CheckCircle2 className="w-5 h-5" />} color="emerald" />
      <StatCard label="Pending Apps" value="0" hint="Awaiting client response" icon={<Clock className="w-5 h-5" />} color="amber" />
    </div>

    <div className="grid sm:grid-cols-2 gap-6 mt-8">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400"/> Recommended Gigs</h3>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>Frontend landing page for club</li>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>Design poster for tech fest</li>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>Help in DSA assignment</li>
        </ul>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-purple-400"/> Upcoming Events</h3>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></div>Freelancing 101 workshop</li>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></div>Alumni networking night</li>
        </ul>
      </div>
    </div>
  </section>
);

const AlumniDashboard = () => (
  <section className="space-y-6 relative z-10">
    <div className="flex items-center gap-2 mb-6">
      <Briefcase className="w-6 h-6 text-amber-400" />
      <h2 className="text-xl font-bold text-white">Alumni Workspace</h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Open Jobs" value="0" hint="Active job postings" icon={<Briefcase className="w-5 h-5" />} color="blue" />
      <StatCard label="Applications" value="0" hint="Received from students" icon={<MailCheck className="w-5 h-5" />} color="emerald" />
      <StatCard label="Mentoring" value="0" hint="Active connections" icon={<Users className="w-5 h-5" />} color="purple" />
    </div>

    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 mt-8">
      <h3 className="text-sm font-bold text-white mb-4">Suggested Actions</h3>
      <ul className="space-y-3 text-sm text-slate-300">
        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Create a micro-internship gig for students</li>
        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Share a referral link or job opening</li>
        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Host a 30-minute AMA session</li>
      </ul>
    </div>
  </section>
);

const FacultyDashboard = () => (
  <section className="space-y-6 relative z-10">
    <div className="flex items-center gap-2 mb-6">
      <User className="w-6 h-6 text-blue-400" />
      <h2 className="text-xl font-bold text-white">Faculty Workspace</h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Active Projects" value="0" hint="Student initiatives" icon={<Activity className="w-5 h-5" />} color="blue" />
      <StatCard label="Student Queries" value="0" hint="Messages waiting" icon={<MailCheck className="w-5 h-5" />} color="amber" />
      <StatCard label="Events Hosted" value="0" hint="Your organized events" icon={<CalendarDays className="w-5 h-5" />} color="purple" />
    </div>
  </section>
);

const AdminDashboard = ({ stats, isStatsLoading }) => (
  <section className="space-y-6 relative z-10">
    <div className="flex items-center gap-2 mb-6">
      <ShieldCheck className="w-6 h-6 text-rose-400" />
      <h2 className="text-xl font-bold text-white">Admin Overview</h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <StatCard label="Total Users" value="-" icon={<Users className="w-5 h-5" />} color="blue" />
      <StatCard label="Pending Approval" value="-" icon={<Clock className="w-5 h-5" />} color="amber" />
      <StatCard label="Reports" value="-" icon={<AlertCircle className="w-5 h-5" />} color="rose" />
      <StatCard label="Active Gigs" value="-" icon={<Briefcase className="w-5 h-5" />} color="emerald" />
    </div>

    <div className="mt-8">
      {isStatsLoading ? (
        <div className="flex items-center justify-center p-8 bg-slate-900 rounded-xl border border-slate-800">
           <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
        </div>
      ) : (
        stats && <OrderStatsBox stats={stats} />
      )}
    </div>
  </section>
);

export default DashboardPage;

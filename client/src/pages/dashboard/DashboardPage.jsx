// src/pages/dashboard/DashboardPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import OrderStatsBox from "../orders/OrderStatsBox.jsx";
import useOrderStore from "../../store/orderStore";

const roleColors = {
  student: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  alumni: "bg-amber-500/10 text-amber-300 border-amber-500/40",
  faculty: "bg-sky-500/10 text-sky-300 border-sky-500/40",
  admin: "bg-rose-500/10 text-rose-300 border-rose-500/40",
};

const DashboardPage = () => {
  const { user, loadUserFromToken, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      loadUserFromToken();
    }
  }, [user, loadUserFromToken]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-300 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  const { stats, fetchOrderStats, isStatsLoading } = useOrderStore();

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const roleBadgeClass =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border " +
    (roleColors[user.role] ||
      "bg-slate-700/60 text-slate-200 border-slate-600");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Dashboard
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
              Hi, <span className="text-blue-400">{user.name}</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Here&apos;s what&apos;s happening in your Unilancer space.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={roleBadgeClass}>
              {user.role ? user.role.toUpperCase() : "USER"}
            </span>
            <button
              onClick={() => navigate("/profile")}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 border border-slate-700"
            >
              <span className="hidden sm:inline">View / Edit Profile</span>
              <span className="sm:hidden">Profile</span>
            </button>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: ROLE-SPECIFIC CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            <OverviewStats user={user} />
            {user.role === "student" && <StudentDashboard user={user} />}
            {user.role === "alumni" && <AlumniDashboard user={user} />}
            {user.role === "faculty" && <FacultyDashboard user={user} />}
            {user.role === "admin" && <AdminDashboard user={user} />}
          </div>

          {/* RIGHT: PROFILE SUMMARY */}
          <aside className="space-y-4">
            <ProfileCard user={user} />
            <QuickActions user={user} navigate={navigate} />
          </aside>
        </div>
      </div>
    </div>
  );
};

/* ---------- SMALL REUSABLE CARD ---------- */
const StatCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className="text-2xl font-semibold text-slate-50">{value}</p>
    {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
  </div>
);

/* ---------- TOP STATS (COMMON) ---------- */
const OverviewStats = ({ user }) => {
  return (
    <section>
      <h2 className="text-sm font-medium text-slate-200 mb-3">
        Overview summary
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Role"
          value={
            user.role ? user.role[0].toUpperCase() + user.role.slice(1) : "-"
          }
        />
        <StatCard
          label="Email verified"
          value={user.emailVerified ? "Yes" : "No"}
          hint={
            user.emailVerified
              ? "Great! Your email is verified."
              : "Verify to unlock full features."
          }
        />
        <StatCard
          label="Account status"
          value={user.isBlocked ? "Blocked" : "Active"}
          hint={
            user.role !== "student"
              ? user.isApproved
                ? "Approved by admin"
                : "Pending admin approval"
              : "Student accounts are auto-approved"
          }
        />
        <StatCard
          label="Member since"
          value={
            user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"
          }
        />
      </div>
    </section>
  );
};

/* ---------- RIGHT SIDE: PROFILE SUMMARY ---------- */
const ProfileCard = ({ user }) => {
  const avatarLetter = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center text-lg font-semibold text-slate-100">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            avatarLetter
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-50 truncate">
            {user.name}
          </p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
        </div>
      </div>

      <div className="text-xs space-y-1.5 text-slate-300">
        {user.college && (
          <p>
            <span className="text-slate-500">College: </span>
            {user.college}
          </p>
        )}

        {user.role === "student" && (
          <>
            {user.branch && (
              <p>
                <span className="text-slate-500">Branch: </span>
                {user.branch}
              </p>
            )}
            {(user.year || user.section) && (
              <p>
                <span className="text-slate-500">Year / Section: </span>
                {user.year ? `Y${user.year}` : "-"}
                {user.section ? ` • ${user.section}` : ""}
              </p>
            )}
            {user.rollNumber && (
              <p>
                <span className="text-slate-500">Roll No: </span>
                {user.rollNumber}
              </p>
            )}
          </>
        )}

        {user.role === "alumni" && (
          <>
            {user.company && (
              <p>
                <span className="text-slate-500">Company: </span>
                {user.company}
              </p>
            )}
            {user.jobTitle && (
              <p>
                <span className="text-slate-500">Job title: </span>
                {user.jobTitle}
              </p>
            )}
            {user.yearOfPassing && (
              <p>
                <span className="text-slate-500">Year of passing: </span>
                {user.yearOfPassing}
              </p>
            )}
            {user.linkedIn && (
              <p className="truncate">
                <span className="text-slate-500">LinkedIn: </span>
                <a
                  href={user.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  View profile
                </a>
              </p>
            )}
          </>
        )}

        {user.role === "faculty" && (
          <>
            {user.department && (
              <p>
                <span className="text-slate-500">Department: </span>
                {user.department}
              </p>
            )}
            {user.designation && (
              <p>
                <span className="text-slate-500">Designation: </span>
                {user.designation}
              </p>
            )}
            {user.employeeId && (
              <p>
                <span className="text-slate-500">Employee ID: </span>
                {user.employeeId}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const QuickActions = ({ user, navigate }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
      <h3 className="text-sm font-medium text-slate-200">Quick actions</h3>
      <div className="flex flex-col gap-2 text-xs">
        <button
          onClick={() => navigate("/profile")}
          className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-left"
        >
          Update profile details
        </button>

        {/* ORGANISED AND REGISTERED EVENTS BUTTONS */}
        <button
          onClick={() => navigate("/events/my/organized")}
          className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-left"
        >
          View my organized events
        </button>

        <button
          onClick={() => navigate("/events/my/registered")}
          className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-left"
        >
          View my registered events
        </button>
        {(user.role === "student" || user.role === "alumni") && (
          <>
            {/* CTA: Create gig */}
            <button
              onClick={() => navigate("/gigs/create")}
              className="w-full rounded-lg bg-blue-600/90 hover:bg-blue-500 px-3 py-2 text-left text-white"
            >
              Create freelance gig
            </button>

            {/* Browse gigs */}
            <button
              onClick={() => navigate("/gigs")}
              className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-left"
            >
              Browse gigs
            </button>

            {/* My gigs */}
            <button
              onClick={() => navigate("/gigs/my")}
              className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-left"
            >
              Manage my gigs
            </button>
          </>
        )}

        {user.role === "student" && (
          <button
            onClick={() => navigate("/events")}
            className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-left"
          >
            View upcoming events
          </button>
        )}

        {user.role === "faculty" && (
          <button
            onClick={() => navigate("/events/create")}
            className="w-full rounded-lg bg-blue-600/90 hover:bg-blue-500 px-3 py-2 text-left text-white"
          >
            Create new event
          </button>
        )}

        {user.role === "admin" && (
          <button
            onClick={() => navigate("/admin/users")}
            className="w-full rounded-lg bg-rose-600/90 hover:bg-rose-500 px-3 py-2 text-left text-white"
          >
            Review user approvals
          </button>
        )}
      </div>
    </div>
  );
};

/* ---------- ROLE-SPECIFIC SECTIONS ---------- */

// STUDENT
const StudentDashboard = () => {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-slate-200">Student workspace</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Active orders"
          value="0"
          hint="Start by taking your first gig."
        />
        <StatCard
          label="Completed orders"
          value="0"
          hint="Complete gigs to build your profile."
        />
        <StatCard
          label="Pending applications"
          value="0"
          hint="Apply to gigs you like."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-xs font-semibold text-slate-300 mb-2">
            Recommended gigs
          </h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>• Frontend landing page for college club</li>
            <li>• Design poster for tech fest</li>
            <li>• Help in DSA assignment (1-week task)</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-xs font-semibold text-slate-300 mb-2">
            Upcoming events
          </h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>• Freelancing 101 workshop</li>
            <li>• Alumni networking night</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

// ALUMNI
const AlumniDashboard = () => {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-slate-200">Alumni workspace</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Open job posts"
          value="0"
          hint="Post a gig to hire students."
        />
        <StatCard
          label="Applications received"
          value="0"
          hint="Review applications as they come."
        />
        <StatCard
          label="Mentoring sessions"
          value="0"
          hint="Connect with your juniors."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-xs font-semibold text-slate-300 mb-2">
            Suggested actions
          </h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>• Create a micro-internship gig for students</li>
            <li>• Share a referral link or job opening</li>
            <li>• Host a 30-minute AMA session</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-xs font-semibold text-slate-300 mb-2">
            Recent connections
          </h3>
          <p className="text-xs text-slate-500">
            Once students start reaching out, you&apos;ll see them here.
          </p>
        </div>
      </div>
    </section>
  );
};

// FACULTY
const FacultyDashboard = () => {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-slate-200">Faculty workspace</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Active projects"
          value="0"
          hint="Track student freelance initiatives."
        />
        <StatCard
          label="Student queries"
          value="0"
          hint="Students can reach out for guidance."
        />
        <StatCard
          label="Events hosting"
          value="0"
          hint="Create events to engage students."
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-xs font-semibold text-slate-300 mb-2">
          Suggested actions
        </h3>
        <ul className="space-y-2 text-xs text-slate-400">
          <li>• Create an event to announce a hackathon or contest</li>
          <li>• Review and validate student freelance work as projects</li>
          <li>• Share guidelines on ethical freelancing with students</li>
        </ul>
      </div>
    </section>
  );
};

// ADMIN
const AdminDashboard = ({ user, stats, isStatsLoading }) => {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-slate-200">
        Admin control center
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total users"
          value="-"
          hint="Wire to stats API later."
        />
        <StatCard
          label="Pending approvals"
          value="-"
          hint="Alumni / faculty awaiting approval."
        />
        <StatCard label="Reported issues" value="-" />
        <StatCard label="Active gigs" value="-" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-xs font-semibold text-slate-300 mb-2">
            Quick moderation
          </h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>• Review new alumni & faculty accounts</li>
            <li>• Check flagged gigs or reports</li>
            <li>• Broadcast system announcements</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-xs font-semibold text-slate-300 mb-2">
            System health
          </h3>
          <p className="text-xs text-slate-500">
            Later you can plug in actual analytics like total revenue, monthly
            active users, gig completion rate, etc.
          </p>
        </div>
      </div>
      {isStatsLoading && (
        <p className="text-slate-400">Loading order statistics...</p>
      )}

      {!isStatsLoading && stats && <OrderStatsBox stats={stats} />}
    </section>
  );
};

export default DashboardPage;

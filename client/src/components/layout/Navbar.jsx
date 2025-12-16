// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path ? "text-blue-400" : "text-slate-300";

  const avatarLetter = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <nav className="w-full bg-slate-950/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
            U
          </div>
          <span className="text-white font-semibold text-lg">Unilancer</span>
        </Link>

        {/* CENTER */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/gigs" className={isActive("/gigs")}>
            Gigs
          </Link>
          <Link to="/orders" className={isActive("/orders")}>
            Orders
          </Link>
          <Link to="/events" className={isActive("/events")}>
            Events
          </Link>
          <Link to="/jobs" className={isActive("/jobs")}>
            Jobs
          </Link>

          {/* ✅ Create Event (ONLY for faculty & admin) */}
          {user && (user.role === "faculty" || user.role === "admin") && (
            <Link
              to="/events/create"
              className="text-slate-200 hover:text-blue-400"
            >
              Create Event
            </Link>
          )}
        </div>

        <Link to="/jobs/create" className="text-slate-200 hover:text-blue-400">
          Create Jobs
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link
                to="/login"
                className="text-xs sm:text-sm text-slate-200 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
              >
                Sign up
              </Link>
            </>
          )}

          {user && (
            <>
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:border-blue-500 hover:text-blue-300"
              >
                Dashboard
              </Link>

              {/* PROFILE */}
              <Link
                to="/profile"
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center text-sm font-semibold text-slate-100 group-hover:ring-2 group-hover:ring-blue-500 transition">
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
                <span className="hidden sm:inline text-xs text-slate-300 max-w-[120px] truncate group-hover:text-white">
                  {user.name}
                </span>
              </Link>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

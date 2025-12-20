// src/components/layout/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.webp";
import Button from "../Button";

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
    location.pathname === path ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-blue-400 transition-colors";

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="Unilancer"
            className="h-20 w-max object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* CENTER - Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className={`text-sm font-medium transition-colors ${isActive("/")}`}>
            Home
          </Link>
          <Link to="/gigs" className={`text-sm font-medium transition-colors ${isActive("/gigs")}`}>
            Gigs
          </Link>
          <Link to="/jobs" className={`text-sm font-medium transition-colors ${isActive("/jobs")}`}>
            Jobs
          </Link>
          <Link to="/events" className={`text-sm font-medium transition-colors ${isActive("/events")}`}>
            Events
          </Link>
          <Link to="/orders" className={`text-sm font-medium transition-colors ${isActive("/orders")}`}>
            Orders
          </Link>

          {/* Create Event - Faculty & Admin Only */}
          {user && (user.role === "faculty" || user.role === "admin") && (
            <Link to="/events/create" className={`text-sm font-medium transition-colors ${isActive("/events/create")}`}>
              Create Event
            </Link>
          )}
        </div>

        {/* RIGHT: Auth & Actions */}
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="light" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {user && (
            <>
              {/* Dashboard */}
              <Link to="/dashboard" className="hidden lg:block">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-slate-700 bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
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
                <span className="hidden sm:inline text-sm text-slate-300 max-w-[100px] truncate group-hover:text-blue-400 transition-colors">
                  {user.name}
                </span>
              </Link>

              {/* Logout */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

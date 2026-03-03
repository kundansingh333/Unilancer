// src/components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.webp";
import Button from "../Button";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const avatarLetter = user?.name?.[0]?.toUpperCase() || "U";

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
    setMobileMenuOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-400 font-semibold"
      : "text-slate-400 hover:text-blue-400 transition-colors";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/gigs", label: "Gigs" },
    { to: "/jobs", label: "Jobs" },
    { to: "/events", label: "Events" },
    { to: "/orders", label: "Orders" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={logo}
            alt="Unilancer"
            className="h-16 sm:h-20 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* CENTER - Navigation Links (Desktop / Tablet) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium whitespace-nowrap transition-colors ${isActive(to)}`}
            >
              {label}
            </Link>
          ))}

          {/* Create Event - Faculty & Admin Only */}
          {user && (user.role === "faculty" || user.role === "admin") && (
            <Link
              to="/events/create"
              className={`text-sm font-medium whitespace-nowrap transition-colors ${isActive("/events/create")}`}
            >
              Create Event
            </Link>
          )}
        </div>

        {/* RIGHT: Auth & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!user && (
            <>
              <Link to="/login" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="hidden md:block">
                <Button variant="light" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {user && (
            <>
              {/* Dashboard */}
              <Link to="/dashboard" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-slate-700 bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
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
                <span className="hidden lg:inline text-sm text-slate-300 max-w-[100px] truncate group-hover:text-blue-400 transition-colors">
                  {user.name}
                </span>
              </Link>

              {/* Logout */}
              <div className="hidden md:block shrink-0">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            </>
          )}

          {/* Hamburger Menu Button (Mobile only, hidden on md+) */}
          <button
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-800 transition-colors gap-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (visible below md breakpoint) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 border-t border-slate-800" : "max-h-0"
        }`}
      >
        <div className="bg-slate-950/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? "text-blue-400 bg-slate-800/50"
                    : "text-slate-300 hover:text-blue-400 hover:bg-slate-800/50"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Create Event - Faculty & Admin Only */}
            {user && (user.role === "faculty" || user.role === "admin") && (
              <Link
                to="/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/events/create"
                    ? "text-blue-400 bg-slate-800/50"
                    : "text-slate-300 hover:text-blue-400 hover:bg-slate-800/50"
                }`}
              >
                Create Event
              </Link>
            )}

            {/* Context/Auth Links in mobile menu */}
            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === "/dashboard"
                      ? "text-blue-400 bg-slate-800/50"
                      : "text-slate-300 hover:text-blue-400 hover:bg-slate-800/50"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === "/profile"
                      ? "text-blue-400 bg-slate-800/50"
                      : "text-slate-300 hover:text-blue-400 hover:bg-slate-800/50"
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-slate-800/50 transition-colors mt-1"
                >
                  Logout
                </button>
              </>
            )}

            {/* Login/Register for mobile */}
            {!user && (
              <div className="flex gap-2 px-4 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1"
                >
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1"
                >
                  <Button variant="light" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

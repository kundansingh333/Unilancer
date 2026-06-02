import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.webp";
import { Menu, X, LogOut, User, LayoutDashboard, PlusCircle } from "lucide-react";
import Button from "../Button";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const avatarLetter = user?.name?.[0]?.toUpperCase() || "U";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/gigs", label: "Gigs" },
    { to: "/jobs", label: "Jobs" },
    { to: "/events", label: "Events" },
    { to: "/orders", label: "Orders" },
  ];

  return (
    <nav 
      className={`sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-lg" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={logo}
            alt="Unilancer"
            className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md"
          />
        </Link>

        {/* CENTER - Navigation Links (Desktop / Tablet) */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-900/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-slate-800 shadow-inner">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium whitespace-nowrap transition-all px-4 py-2 rounded-full ${
                isActive(to)
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Create Event - Faculty & Admin Only */}
          {user && (user.role === "faculty" || user.role === "admin") && (
            <Link
              to="/events/create"
              className={`text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-all px-4 py-2 rounded-full ${
                isActive("/events/create")
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Create Event
            </Link>
          )}
        </div>

        {/* RIGHT: Auth & Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {!user && (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <button className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-3 py-2">
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button className="text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 px-5 py-2.5 rounded-full transition-colors shadow-lg">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {user && (
            <div className="hidden md:flex items-center gap-3">
              {/* Dashboard */}
              <Link 
                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="p-2.5 rounded-full text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors bg-slate-900 border border-slate-800"
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>

              {/* Profile Menu Wrapper */}
              <div className="relative group cursor-pointer">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-sm"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-inner">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      avatarLetter
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-200 max-w-[100px] truncate group-hover:text-white transition-colors">
                    {user.name?.split(' ')[0]}
                  </span>
                </Link>
                
                {/* Dropdown on Hover */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                   <div className="w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden py-1">
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                        <User className="w-4 h-4" /> Profile Details
                      </Link>
                      <div className="h-px bg-slate-800 my-1"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Hamburger Menu Button (Mobile only) */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-2">
          
          {user && (
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800 mb-2">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  avatarLetter
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname === to
                  ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent"
              }`}
            >
              {label}
            </Link>
          ))}

          {user && (user.role === "faculty" || user.role === "admin") && (
            <Link
              to="/events/create"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                location.pathname === "/events/create"
                  ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent"
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Create Event
            </Link>
          )}

          {user && (
            <div className="mt-2 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
            </div>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="mt-2 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-white transition-colors">
                  Log in
                </button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full px-5 py-3 rounded-xl bg-indigo-600 text-sm font-bold text-white transition-colors shadow-lg shadow-indigo-500/20">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

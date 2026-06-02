import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.webp";
import { Sparkles, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import SEO from "../../components/SEO";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { resetPassword, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      setLocalError("Invalid or missing reset token. Please request a new link.");
    }
  }, [token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setLocalError("Invalid or missing reset token.");
      return;
    }

    if (form.newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const result = await resetPassword({
      token,
      newPassword: form.newPassword,
    });

    if (result.success) {
      setSuccessMsg(result.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <SEO title="Reset Password" path="/reset-password" noIndex />
      
      {/* LEFT: Branding/Imagery */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-slate-900 to-orange-900/40" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]" />

        <div className="relative z-10 p-12 max-w-xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-8">
            <KeyRound className="w-4 h-4" /> Secure Your Account
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Create New Password
          </h1>
          <p className="text-lg text-slate-300">
            Choose a strong, unique password to keep your Unilancer account safe and secure.
          </p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-rose-500/5 to-orange-500/5 blur-3xl -z-10 lg:hidden" />

        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10 lg:hidden">
            <img src={logo} alt="Unilancer" className="h-16 w-auto object-contain" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Reset Password</h2>
            <p className="text-slate-400">Enter a new password for your account.</p>
          </div>

          {(localError || error) && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-red-400 text-sm font-medium pt-0.5">{localError || error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-emerald-300 text-sm font-medium pt-0.5">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                disabled={!token || !!successMsg}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 block px-4 py-3.5 placeholder-slate-500 transition-all outline-none disabled:opacity-50 disabled:bg-slate-800"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={!token || !!successMsg}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 block px-4 py-3.5 placeholder-slate-500 transition-all outline-none disabled:opacity-50 disabled:bg-slate-800"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !token || !!successMsg}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Resetting...</>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              <Link
                to="/login"
                className="text-rose-400 font-semibold hover:text-rose-300 transition-colors inline-flex items-center gap-1"
              >
                ← Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

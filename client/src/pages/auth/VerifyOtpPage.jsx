import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.webp";
import { Sparkles, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import SEO from "../../components/SEO";

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(
    initialEmail
      ? `We've sent a 6-digit code to ${initialEmail}.`
      : "Enter your registered email and the 6-digit code."
  );

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email || !otp || otp.length !== 6) {
      toast.error("Please enter your email and a 6-digit code.");
      setError("Please enter your email and a 6-digit code.");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await api.post("/auth/verify-email-otp", {
        email,
        otp,
      });
      toast.success("Email verified successfully!");
      setInfo(res.data?.message || "Email verified successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Invalid or expired code. Please try again.";
      setError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("Please enter your registered email first.");
      return;
    }

    try {
      setIsResending(true);
      const res = await api.post("/auth/resend-verification-otp", { email });
      setInfo(
        res.data?.message || "A new verification code has been sent to your email."
      );
      toast.success("OTP sent to your email!");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to resend code. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <SEO title="Verify Email" description="Verify your Unilancer account" path="/verify-otp" noIndex />
      
      {/* LEFT: Branding/Imagery (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-slate-900 to-teal-900/40" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px]" />

        <div className="relative z-10 p-12 max-w-xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" /> Almost there
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Verify Your Email
          </h1>
          <p className="text-lg text-slate-300">
            Confirm your identity to unlock all Unilancer features and start connecting with opportunities.
          </p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 blur-3xl -z-10 lg:hidden" />

        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10 lg:hidden">
            <img src={logo} alt="Unilancer" className="h-16 w-auto object-contain" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Check Your Inbox</h2>
            <p className="text-slate-400">Enter the 6-digit code we sent to your email.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-red-400 text-sm font-medium pt-0.5">{error}</p>
            </div>
          )}

          {info && !error && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-emerald-300 text-sm font-medium">{info}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!initialEmail}
                required
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 block px-4 py-3.5 placeholder-slate-500 transition-all outline-none disabled:opacity-50 disabled:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                6-digit Code
              </label>
              <input
                type="text"
                placeholder="000000"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
                required
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 block px-4 py-3.5 placeholder-slate-500 transition-all outline-none text-center text-xl tracking-[0.5em] font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isVerifying ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
              ) : (
                <><ShieldCheck className="w-5 h-5" /> Verify Email</>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {isResending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Resending...</> : "Resend Code"}
            </button>
            <Link
              to="/login"
              className="text-slate-400 hover:text-white font-medium transition-colors inline-flex items-center gap-1"
            >
              Back to Login <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

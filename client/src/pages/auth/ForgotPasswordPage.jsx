import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.webp";
import { Sparkles, KeyRound, ArrowRight, Loader2, Mail } from "lucide-react";
import SEO from "../../components/SEO";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { forgotPasswordOtp, resetPasswordOtp, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const result = await forgotPasswordOtp(email);
    if (result.success) {
      toast.success("OTP sent to your email!");
      setStep(2);
    } else {
      toast.error(result.error || "Failed to send OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = await resetPasswordOtp({ email, otp, newPassword });
    if (result.success) {
      toast.success("Password reset successful! You can now login.");
      navigate("/login");
    } else {
      toast.error(result.error || "Reset failed");
    }
  };

  const handleResendOtp = async () => {
    const result = await forgotPasswordOtp(email);
    if (result.success) {
      toast.success("New OTP sent to your email!");
    } else {
      toast.error(result.error || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <SEO title="Forgot Password" path="/forgot-password" noIndex />
      
      {/* LEFT: Branding/Imagery */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-slate-900 to-rose-900/40" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px]" />

        <div className="relative z-10 p-12 max-w-xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8">
            <KeyRound className="w-4 h-4" /> Account Recovery
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Reset Your Password
          </h1>
          <p className="text-lg text-slate-300">
            Don't worry, it happens to the best of us. Let's get you back into your account securely.
          </p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-amber-500/5 to-rose-500/5 blur-3xl -z-10 lg:hidden" />

        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10 lg:hidden">
            <img src={logo} alt="Unilancer" className="h-16 w-auto object-contain" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              {step === 1 ? "Forgot Password" : "Create New Password"}
            </h2>
            <p className="text-slate-400">
              {step === 1 
                ? "Enter your email and we'll send you an OTP to reset your password."
                : `Enter the OTP sent to ${email} and set your new password.`}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 1 ? "bg-amber-500 text-slate-900" : "bg-slate-800 text-slate-400"}`}>1</div>
            <div className={`flex-1 h-0.5 transition-colors ${step >= 2 ? "bg-amber-500" : "bg-slate-800"}`} />
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? "bg-amber-500 text-slate-900" : "bg-slate-800 text-slate-400"}`}>2</div>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-red-400 text-sm font-medium pt-0.5">{error}</p>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 block pl-12 pr-4 py-3.5 placeholder-slate-500 transition-all outline-none"
                    placeholder="you@college.edu"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 block px-4 py-3.5 placeholder-slate-500 transition-all outline-none text-center text-xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 block px-4 py-3.5 placeholder-slate-500 transition-all outline-none"
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 block px-4 py-3.5 placeholder-slate-500 transition-all outline-none"
                  placeholder="Retype password"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Resetting...</> : "Reset Password"}
              </button>

              <div className="flex items-center justify-between text-sm pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          <div className="mt-10 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="text-amber-400 font-semibold hover:text-amber-300 transition-colors inline-flex items-center gap-1"
              >
                Back to login <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

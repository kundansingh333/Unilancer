// src/pages/auth/VerifyOtpPage.jsx
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.webp";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Alert from "../../components/Alert";


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
      ? `We’ve sent a 6-digit code to ${initialEmail}.`
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
      // After success, go to login
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
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to resend code. Please try again.";
      setError(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 selection:bg-blue-500/30 px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-tr from-blue-500/10 to-purple-500/10 blur-3xl -z-10" />
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Unilancer"
            className="h-20 w-max object-contain group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Card */}
        <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50 mb-2">
            Verify Your Email
          </h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Enter the 6-digit code we sent to activate your account.
          </p>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-red-400 text-sm font-semibold">{error}</p>
            </div>
          )}

          {info && (
            <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-300 text-sm font-semibold">{info}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!initialEmail}
                required
                className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {initialEmail && (
                <p className="text-xs text-slate-500 mt-2">
                  Using email from registration
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
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
                className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

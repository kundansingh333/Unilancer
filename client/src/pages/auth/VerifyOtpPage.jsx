// src/pages/auth/VerifyOtpPage.jsx
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../api/client";

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
      setError("Please enter your email and a 6-digit code.");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await api.post("/auth/verify-email-otp", {
        email,
        otp,
      });

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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-50 mb-1">
          Verify your email
        </h1>
        <p className="text-sm text-slate-400 mb-4">
          Enter the 6-digit code we sent to your email to activate your account.
        </p>

        {error && (
          <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-3 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
            {info}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Email
            </label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!!initialEmail}
              placeholder="you@college.edu"
            />
            {initialEmail && (
              <p className="mt-1 text-xs text-slate-500">
                Using email from registration. Go back and register again if this
                is not yours.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              6-digit code
            </label>
            <input
              className="input tracking-[0.4em] text-center"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-blue-400 hover:text-blue-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isResending ? "Resending..." : "Resend code"}
          </button>

          <Link to="/login" className="hover:text-slate-200">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

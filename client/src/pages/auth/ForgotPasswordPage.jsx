// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { forgotPasswordOtp, resetPasswordOtp, isLoading, error } =
    useAuthStore();
  const navigate = useNavigate();

  // Step 1: Request OTP
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

  // Step 2: Verify OTP + Reset Password
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

  // Resend OTP
  const handleResendOtp = async () => {
    const result = await forgotPasswordOtp(email);
    if (result.success) {
      toast.success("New OTP sent to your email!");
    } else {
      toast.error(result.error || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-400"
            }`}
          >
            1
          </div>
          <div
            className={`flex-1 h-0.5 ${
              step >= 2 ? "bg-blue-600" : "bg-slate-700"
            }`}
          />
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-400"
            }`}
          >
            2
          </div>
        </div>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-semibold text-slate-50 mb-1">
              Forgot Password
            </h1>
            <p className="text-sm text-slate-400 mb-6">
              Enter your email and we'll send you an OTP to reset your password.
            </p>

            {error && (
              <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@college.edu"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 text-sm font-medium text-white transition"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {/* Step 2: Enter OTP + New Password */}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-semibold text-slate-50 mb-1">
              Reset Password
            </h1>
            <p className="text-sm text-slate-400 mb-6">
              Enter the OTP sent to{" "}
              <span className="text-blue-400 font-medium">{email}</span> and set
              your new password.
            </p>

            {error && (
              <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* OTP Input */}
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 tracking-[0.3em] text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Retype password"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 text-sm font-medium text-white transition"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            {/* Resend OTP + Go back */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
              >
                ← Change email
              </button>
              <button
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

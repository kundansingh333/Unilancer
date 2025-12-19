// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.webp";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Alert from "../../components/Alert";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { forgotPassword, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    const result = await forgotPassword(email);
    if (result.success) {
      toast.success("Password reset link sent to your email.");
      setSuccessMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-50 mb-1">
          Forgot Password
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Enter your email address and we’ll send you a reset link.
        </p>

        {error && (
          <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@college.edu"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 text-sm font-medium text-white transition"
          >
            {isLoading ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
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

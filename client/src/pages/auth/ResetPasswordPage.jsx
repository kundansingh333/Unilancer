// src/pages/auth/ResetPasswordPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";

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
      setLocalError("Invalid or missing reset token.");
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
      setSuccessMsg(result.message);
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-50 mb-1">
          Reset Password
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Enter a new password for your Unilancer account.
        </p>

        {(localError || error) && (
          <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {localError || error}
          </div>
        )}

        {successMsg && (
          <div className="mb-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 text-sm font-medium text-white transition"
          >
            {isLoading ? "Resetting password..." : "Reset password"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Back to{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

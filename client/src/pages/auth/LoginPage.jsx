// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 Default to home ("/") instead of "/dashboard"
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      toast.success("Logged in successfully");
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-50 mb-1">
          Welcome back to <span className="text-blue-500">Unilancer</span>
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Login to access gigs, events, and your freelance dashboard.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@college.edu"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span></span>
            <Link
              to="/forgot-password"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 text-sm font-medium text-white transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

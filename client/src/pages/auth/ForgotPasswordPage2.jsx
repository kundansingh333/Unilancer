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
    <div className="min-h-screen flex items-center justify-center bg-light px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Unilancer"
            className="h-16 w-16 rounded-xl shadow-lg"
          />
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-display font-bold text-dark mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {error && (
            <div className="mb-6">
              <Alert variant="danger" title="Error">
                {error}
              </Alert>
            </div>
          )}

          {successMsg && (
            <div className="mb-6">
              <Alert variant="success" title="Success">
                {successMsg}
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-accent hover:text-blue-600 font-semibold transition-colors"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

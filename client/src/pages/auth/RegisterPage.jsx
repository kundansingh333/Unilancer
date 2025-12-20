// src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.webp";

const ROLES = ["student", "alumni", "faculty"];

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    college: "",
    branch: "",
    year: "",
    section: "",
    rollNumber: "",
    company: "",
    jobTitle: "",
    yearOfPassing: "",
    domain: "",
    linkedIn: "",
    department: "",
    designation: "",
    employeeId: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({ ...prev, role }));
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      college: form.college,
    };

    if (form.role === "student") {
      payload.branch = form.branch;
      payload.year = Number(form.year);
      payload.section = form.section.toUpperCase();
      payload.rollNumber = form.rollNumber.toUpperCase();
    }

    if (form.role === "alumni") {
      payload.company = form.company;
      payload.jobTitle = form.jobTitle;
      payload.yearOfPassing = Number(form.yearOfPassing);
      payload.domain = form.domain;
      if (form.linkedIn) payload.linkedIn = form.linkedIn;
    }

    if (form.role === "faculty") {
      payload.department = form.department;
      payload.designation = form.designation;
      payload.employeeId = form.employeeId.toUpperCase();
    }

    const result = await register(payload);

    if (result?.success) {
      toast.success("Account created successfully. Verify your email.");
      navigate("/verify-otp", { state: { email: form.email } });
    }
  };

  const isStudent = form.role === "student";
  const isAlumni = form.role === "alumni";
  const isFaculty = form.role === "faculty";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 selection:bg-blue-500/30 px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-tr from-blue-500/10 to-purple-500/10 blur-3xl -z-10" />
      
      <div className="w-full max-w-2xl">
        {/* Card with Glassmorphism */}
        <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="Unilancer"
              className="h-20 w-max object-contain group-hover:scale-105 transition-transform"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50 text-center mb-2">
            Create Account
          </h1>
          <p className="text-sm text-slate-400 text-center mb-8 leading-relaxed">
            Join as a student, alumni, or faculty member
          </p>

          {/* Role Selector */}
          <div className="flex gap-3 mb-8">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm capitalize transition-all border ${
                  form.role === role
                    ? "bg-slate-800 text-blue-400 border-blue-500 shadow-lg shadow-blue-500/10"
                    : "bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-blue-400 hover:border-slate-600"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-red-400 text-sm font-semibold">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-emerald-400 text-sm font-semibold">{successMsg}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {/* COMMON */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@college.edu"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                College/University
              </label>
              <input
                type="text"
                name="college"
                placeholder="Your college name"
                value={form.college}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
              />
            </div>

            {/* STUDENT */}
            {isStudent && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    placeholder="CSE, ECE, etc."
                    value={form.branch}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    placeholder="1-5"
                    min="1"
                    max="5"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Section
                  </label>
                  <input
                    type="text"
                    name="section"
                    placeholder="A, B, C, etc."
                    value={form.section}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    placeholder="Your roll number"
                    value={form.rollNumber}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
              </>
            )}

            {/* ALUMNI */}
            {isAlumni && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Your company name"
                    value={form.company}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Your position"
                    value={form.jobTitle}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Year of Passing
                  </label>
                  <input
                    type="number"
                    name="yearOfPassing"
                    placeholder="2020"
                    value={form.yearOfPassing}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Domain
                  </label>
                  <input
                    type="text"
                    name="domain"
                    placeholder="Software, Design, etc."
                    value={form.domain}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    LinkedIn (Optional)
                  </label>
                  <input
                    type="text"
                    name="linkedIn"
                    placeholder="linkedin.com/in/yourprofile"
                    value={form.linkedIn}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
              </>
            )}

            {/* FACULTY */}
            {isFaculty && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Computer Science, etc."
                    value={form.department}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Professor, Lecturer, etc."
                    value={form.designation}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    placeholder="Your employee ID"
                    value={form.employeeId}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block p-2.5 placeholder-slate-600 transition-all outline-none"
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

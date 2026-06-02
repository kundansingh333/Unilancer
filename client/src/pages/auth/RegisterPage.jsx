import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.webp";
import SEO from "../../components/SEO";
import { Sparkles, ArrowRight, UserPlus, GraduationCap, Briefcase, BookOpen } from "lucide-react";

const ROLES = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "alumni", label: "Alumni", icon: Briefcase },
  { id: "faculty", label: "Faculty", icon: BookOpen }
];

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

  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({ ...prev, role }));
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
    } else {
      toast.error(result?.error || error || "Registration failed. Please try again.");
    }
  };

  const isStudent = form.role === "student";
  const isAlumni = form.role === "alumni";
  const isFaculty = form.role === "faculty";

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <SEO
        title="Sign Up"
        description="Create your free Unilancer account. Join as a student, alumni, or faculty member and start freelancing on campus."
        path="/register"
      />
      
      {/* LEFT: Branding/Imagery (Hidden on mobile) */}
      <div className="hidden lg:flex w-[45%] relative bg-slate-900 overflow-hidden items-center justify-center sticky top-0 h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-purple-900/40" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />

        <div className="relative z-10 p-12 max-w-xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" /> Join the Community
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Start Your Journey with Unilancer
          </h1>
          <p className="text-lg text-slate-300">
            Create an account to discover gigs, apply for jobs, and connect with your campus network.
          </p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="w-full lg:w-[55%] flex justify-center p-6 sm:p-12 relative min-h-screen overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 blur-3xl -z-10 lg:hidden" />

        <div className="w-full max-w-xl py-8">
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={logo} alt="Unilancer" className="h-16 w-auto object-contain" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-400">Join as a student, alumni, or faculty member.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {ROLES.map((roleObj) => {
              const Icon = roleObj.icon;
              const isSelected = form.role === roleObj.id;
              return (
                <button
                  key={roleObj.id}
                  type="button"
                  onClick={() => handleRoleChange(roleObj.id)}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/10 scale-[1.02]"
                      : "bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-sm font-medium">{roleObj.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  placeholder="your@college.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">College/University *</label>
                <input
                  type="text"
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Your college name"
                />
              </div>

              {/* STUDENT FIELDS */}
              {isStudent && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Branch *</label>
                    <input
                      type="text"
                      name="branch"
                      value={form.branch}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="CSE, ECE, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Year *</label>
                    <input
                      type="number"
                      name="year"
                      min="1" max="5"
                      value={form.year}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="1-5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Section *</label>
                    <input
                      type="text"
                      name="section"
                      value={form.section}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="A, B, C"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Roll Number *</label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={form.rollNumber}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Your roll number"
                    />
                  </div>
                </>
              )}

              {/* ALUMNI FIELDS */}
              {isAlumni && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Company *</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Current company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Job Title *</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={form.jobTitle}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Your position"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Year of Passing *</label>
                    <input
                      type="number"
                      name="yearOfPassing"
                      value={form.yearOfPassing}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g. 2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Domain *</label>
                    <input
                      type="text"
                      name="domain"
                      value={form.domain}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Software, Design, etc."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedIn"
                      value={form.linkedIn}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </>
              )}

              {/* FACULTY FIELDS */}
              {isFaculty && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Department *</label>
                    <input
                      type="text"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Computer Science, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Designation *</label>
                    <input
                      type="text"
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Professor, Lecturer, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Employee ID *</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={form.employeeId}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Your employee ID"
                    />
                  </div>
                </>
              )}

            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <UserPlus className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
              >
                Sign in <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

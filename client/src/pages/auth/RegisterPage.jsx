// src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ROLES = ["student", "alumni", "faculty"];

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    college: "",

    // student
    branch: "",
    year: "",
    section: "",
    rollNumber: "",

    // alumni
    company: "",
    jobTitle: "",
    yearOfPassing: "",
    domain: "",
    linkedIn: "",

    // faculty
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
      // ⬇️ as you said: go to OTP screen instead of login
      navigate("/verify-otp", { state: { email: form.email } });
    }
  };

  const isStudent = form.role === "student";
  const isAlumni = form.role === "alumni";
  const isFaculty = form.role === "faculty";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-2xl bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-50 mb-1">
          Join <span className="text-blue-500">Unilancer</span>
        </h1>
        <p className="text-sm text-slate-400 mb-4">
          Create your account as a student, alumni, or faculty.
        </p>

        {/* Role selector */}
        <div className="flex gap-2 mb-6">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleChange(role)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition ${
                form.role === role
                  ? "border-blue-500 bg-blue-500/10 text-blue-300"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

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

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* COMMON */}
          <div className="sm:col-span-2">
            <label className="block text-sm text-slate-300 mb-1">
              Full Name
            </label>
            <input
              name="name"
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-slate-300 mb-1">College</label>
            <input
              name="college"
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          {/* STUDENT */}
          {isStudent && (
            <>
              <input
                name="branch"
                placeholder="Branch"
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="year"
                type="number"
                min="1"
                max="5"
                placeholder="Year"
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="section"
                placeholder="Section"
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="rollNumber"
                placeholder="Roll Number"
                onChange={handleChange}
                required
                className="input sm:col-span-2"
              />
            </>
          )}

          {/* ALUMNI */}
          {isAlumni && (
            <>
              <input
                name="company"
                placeholder="Company"
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="jobTitle"
                placeholder="Job Title"
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="yearOfPassing"
                type="number"
                placeholder="Year of Passing"
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="domain"
                placeholder="Domain"
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="linkedIn"
                placeholder="LinkedIn (optional)"
                onChange={handleChange}
                className="input sm:col-span-2"
              />
            </>
          )}

          {/* FACULTY */}
          {isFaculty && (
            <>
              <input
                name="department"
                placeholder="Department"
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="designation"
                placeholder="Designation"
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="employeeId"
                placeholder="Employee ID"
                onChange={handleChange}
                required
                className="input sm:col-span-2"
              />
            </>
          )}

          <div className="sm:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

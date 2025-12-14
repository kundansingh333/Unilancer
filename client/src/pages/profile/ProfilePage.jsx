import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import useProfileStore from "../../store/profileStore";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  // Auth Store
  const { user, loadUserFromToken } = useAuthStore();

  // Profile Store
  const { updateProfile, isSaving } = useProfileStore();

  // Local State
  const [form, setForm] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  // 1. Load user if not already in store
  useEffect(() => {
    const init = async () => {
      try {
        if (!user) {
          await loadUserFromToken();
        }
      } catch (e) {
        console.error("Failed to load user", e);
      }
    };
    init();
  }, [user, loadUserFromToken]);

  // 2. Initialize form from user data once available
  useEffect(() => {
    if (!user) return;

    setForm({
      // BASIC
      name: user.name || "",
      email: user.email || "",
      role: user.role || "student",
      profilePicture: user.profilePicture || "",
      college: user.college || "",

      // STUDENT
      branch: user.branch || "",
      year: user.year || "",
      section: user.section || "",
      rollNumber: user.rollNumber || "",

      // ALUMNI
      company: user.company || "",
      jobTitle: user.jobTitle || "",
      yearOfPassing: user.yearOfPassing || "",
      domain: user.domain || "",
      linkedIn: user.linkedIn || "",

      // FACULTY
      department: user.department || "",
      designation: user.designation || "",
      employeeId: user.employeeId || "",

      // EXTRA
      bio: user.bio || "",
      // Handle skills array safely
      skills: Array.isArray(user.skills)
        ? user.skills.join(", ")
        : user.skills || "",
      resume: user.resume || "",

      // FREELANCE
      openForFreelance: user.openForFreelance || false,
      upiId: user.upiId || "",
      qrCodeImage: user.qrCodeImage || "",
      freelanceRating: user.freelanceRating || 0,

      // NOTIFICATION PREFERENCES (Safe Access with Defaults)
      notificationPreferences: {
        jobApplication: {
          inApp: user.notificationPreferences?.jobApplication?.inApp ?? true,
          email: user.notificationPreferences?.jobApplication?.email ?? true,
          push: user.notificationPreferences?.jobApplication?.push ?? false,
        },
        eventRegistration: {
          inApp: user.notificationPreferences?.eventRegistration?.inApp ?? true,
          email: user.notificationPreferences?.eventRegistration?.email ?? true,
          push: user.notificationPreferences?.eventRegistration?.push ?? false,
        },
        newOrder: {
          inApp: user.notificationPreferences?.newOrder?.inApp ?? true,
          email: user.notificationPreferences?.newOrder?.email ?? true,
          push: user.notificationPreferences?.newOrder?.push ?? true,
        },
        newMessage: {
          inApp: user.notificationPreferences?.newMessage?.inApp ?? true,
          email: user.notificationPreferences?.newMessage?.email ?? false,
          push: user.notificationPreferences?.newMessage?.push ?? true,
        },
        orderDelivered: {
          inApp: user.notificationPreferences?.orderDelivered?.inApp ?? true,
          email: user.notificationPreferences?.orderDelivered?.email ?? true,
          push: user.notificationPreferences?.orderDelivered?.push ?? true,
        },
        systemAnnouncement: {
          inApp:
            user.notificationPreferences?.systemAnnouncement?.inApp ?? true,
          email:
            user.notificationPreferences?.systemAnnouncement?.email ?? true,
          push: user.notificationPreferences?.systemAnnouncement?.push ?? false,
        },
      },
    });
  }, [user]);

  // Handle Text Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Checkboxes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle Nested Notifications
  const handleNotificationChange = (section, key) => (e) => {
    const { checked } = e.target;
    setForm((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [section]: {
          ...prev.notificationPreferences[section],
          [key]: checked,
        },
      },
    }));
  };

  // 3. Submit Logic - Updated to clean data before sending to Store
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!form) return;

  //   setSaveError("");
  //   setSaveSuccess("");

  //   // Prepare Base Payload
  //   // using || undefined ensures empty strings are not sent to DB if not needed
  //   const payload = {
  //     name: form.name,
  //     college: form.college,
  //     profilePicture: form.profilePicture || undefined,
  //     bio: form.bio,
  //     resume: form.resume || undefined,
  //     openForFreelance: form.openForFreelance,
  //     upiId: form.upiId || undefined,
  //     qrCodeImage: form.qrCodeImage || undefined,
  //     notificationPreferences: form.notificationPreferences,

  //     // Convert comma-separated string back to Array
  //     skills: form.skills
  //       .split(",")
  //       .map((s) => s.trim())
  //       .filter(Boolean),
  //   };

  //   // Add Role-Specific Fields
  //   if (form.role === "student") {
  //     Object.assign(payload, {
  //       branch: form.branch || undefined,
  //       year: form.year ? Number(form.year) : undefined,
  //       section: form.section || undefined,
  //       rollNumber: form.rollNumber || undefined,
  //     });
  //   } else if (form.role === "alumni") {
  //     Object.assign(payload, {
  //       company: form.company || undefined,
  //       jobTitle: form.jobTitle || undefined,
  //       yearOfPassing: form.yearOfPassing
  //         ? Number(form.yearOfPassing)
  //         : undefined,
  //       domain: form.domain || undefined,
  //       linkedIn: form.linkedIn || undefined,
  //     });
  //   } else if (form.role === "faculty") {
  //     Object.assign(payload, {
  //       department: form.department || undefined,
  //       designation: form.designation || undefined,
  //       employeeId: form.employeeId || undefined,
  //     });
  //   }

  //   // Call Zustand Store Action
  //   const result = await updateProfile(payload);

  //   if (result.success) {
  //     setSaveSuccess("Profile updated successfully");
  //     window.scrollTo(0, 0); // Scroll to top to see success message
  //     // Refresh Auth User to reflect changes globally
  //     await loadUserFromToken();
  //   } else {
  //     setSaveError(result.error || "Failed to update profile");
  //     window.scrollTo(0, 0);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    setSaveError("");
    setSaveSuccess("");

    // BASE PAYLOAD (always sent)
    const payload = {
      name: form.name,
      college: form.college,
      profilePicture: form.profilePicture || "",
      bio: form.bio || "",
      resume: form.resume || "",
      openForFreelance: Boolean(form.openForFreelance),
      upiId: form.upiId || "",
      qrCodeImage: form.qrCodeImage || "",
      notificationPreferences: form.notificationPreferences || {},
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    // 🔥 STUDENT — ALWAYS INCLUDE
    if (form.role === "student") {
      payload.branch = form.branch ?? "";
      payload.year =
        form.year !== "" && form.year !== null ? Number(form.year) : null;
      payload.section = form.section ?? "";
      payload.rollNumber = form.rollNumber ?? "";
    }

    // ALUMNI
    if (form.role === "alumni") {
      payload.company = form.company ?? "";
      payload.jobTitle = form.jobTitle ?? "";
      payload.yearOfPassing =
        form.yearOfPassing !== "" ? Number(form.yearOfPassing) : null;
      payload.domain = form.domain ?? "";
      payload.linkedIn = form.linkedIn ?? "";
    }

    // FACULTY
    if (form.role === "faculty") {
      payload.department = form.department ?? "";
      payload.designation = form.designation ?? "";
      payload.employeeId = form.employeeId ?? "";
    }

    console.log("FINAL PAYLOAD 🔥", payload); // 👈 KEEP THIS

    const result = await updateProfile(payload);

    if (result.success) {
      setSaveSuccess("Profile updated successfully");
      await loadUserFromToken(); // refresh auth store
      window.scrollTo(0, 0);
    } else {
      setSaveError(result.error || "Failed to update profile");
      window.scrollTo(0, 0);
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Loading profile...
      </div>
    );
  }

  const isStudent = form.role === "student";
  const isAlumni = form.role === "alumni";
  const isFaculty = form.role === "faculty";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              Profile & Settings{" "}
              <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                {form.role}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Manage your personal info, freelance details and notifications.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-900"
          >
            Back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {saveError && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {saveSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO CARD */}
          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex items-center gap-4">
                <img
                  src={
                    form.profilePicture ||
                    "https://via.placeholder.com/80?text=User"
                  }
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover border border-slate-700"
                />
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    name="profilePicture"
                    value={form.profilePicture}
                    onChange={handleChange}
                    className="w-full input"
                    placeholder="https://..."
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Use a public image URL (Cloudinary, Imgur, etc.).
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full input"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Email (read-only)
                </label>
                <input
                  value={form.email}
                  disabled
                  className="w-full input opacity-70 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Role
                </label>
                <input
                  value={form.role}
                  disabled
                  className="w-full input opacity-70 cursor-not-allowed capitalize"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">
                  College
                </label>
                <input
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  required
                  className="w-full input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  maxLength={500}
                  rows={3}
                  className="w-full input resize-none"
                  placeholder="Tell others about your skills, experience, and interests..."
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Max 500 characters.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className="w-full input"
                  placeholder="React, Node.js, UI/UX, Content Writing"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">
                  Resume URL
                </label>
                <input
                  name="resume"
                  value={form.resume}
                  onChange={handleChange}
                  className="w-full input"
                  placeholder="Link to your resume (Google Drive, etc.)"
                />
              </div>
            </div>
          </section>

          {/* ROLE-SPECIFIC CARD */}
          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-4">
              {isStudent && "Student Details"}
              {isAlumni && "Alumni Details"}
              {isFaculty && "Faculty Details"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isStudent && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Branch
                    </label>
                    <input
                      name="branch"
                      value={form.branch}
                      onChange={handleChange}
                      className="w-full input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Year
                    </label>
                    <input
                      name="year"
                      type="number"
                      min="1"
                      max="5"
                      value={form.year}
                      onChange={handleChange}
                      className="w-full input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Section
                    </label>
                    <input
                      name="section"
                      value={form.section}
                      onChange={handleChange}
                      className="w-full input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Roll Number
                    </label>
                    <input
                      name="rollNumber"
                      value={form.rollNumber}
                      onChange={handleChange}
                      className="w-full input"
                    />
                  </div>
                </>
              )}

              {isAlumni && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Company
                    </label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Job Title
                    </label>
                    <input
                      name="jobTitle"
                      value={form.jobTitle}
                      onChange={handleChange}
                      className="w-full input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Year of Passing
                    </label>
                    <input
                      name="yearOfPassing"
                      type="number"
                      value={form.yearOfPassing}
                      onChange={handleChange}
                      className="w-full input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Domain
                    </label>
                    <input
                      name="domain"
                      value={form.domain}
                      onChange={handleChange}
                      className="w-full input"
                      placeholder="Web Development, Data Science, etc."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">
                      LinkedIn
                    </label>
                    <input
                      name="linkedIn"
                      value={form.linkedIn}
                      onChange={handleChange}
                      className="w-full input"
                      placeholder="https://www.linkedin.com/in/..."
                    />
                  </div>
                </>
              )}

              {isFaculty && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Department
                    </label>
                    <input
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="w-full input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Designation
                    </label>
                    <input
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      className="w-full input"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">
                      Employee ID
                    </label>
                    <input
                      name="employeeId"
                      value={form.employeeId}
                      onChange={handleChange}
                      className="w-full input"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* FREELANCE CARD */}
          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-4">
              Freelance & Payments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  name="openForFreelance"
                  checked={form.openForFreelance}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                />
                Open for freelance work
              </label>

              <div className="text-xs text-slate-400 sm:text-right">
                Rating (read-only):{" "}
                <span className="text-yellow-400">
                  {form.freelanceRating?.toFixed
                    ? form.freelanceRating.toFixed(1)
                    : form.freelanceRating}
                  /5
                </span>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  UPI ID
                </label>
                <input
                  name="upiId"
                  value={form.upiId}
                  onChange={handleChange}
                  className="w-full input"
                  placeholder="yourname@upi"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  QR Code Image URL
                </label>
                <input
                  name="qrCodeImage"
                  value={form.qrCodeImage}
                  onChange={handleChange}
                  className="w-full input"
                  placeholder="https://..."
                />
              </div>
            </div>
          </section>

          {/* NOTIFICATIONS CARD */}
          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-4">
              Notification Preferences
            </h2>

            <div className="grid grid-cols-1 gap-4 text-xs">
              {[
                "jobApplication",
                "eventRegistration",
                "newOrder",
                "newMessage",
                "orderDelivered",
                "systemAnnouncement",
              ].map((sectionKey) => {
                const prettyLabel = {
                  jobApplication: "Job applications",
                  eventRegistration: "Event registrations",
                  newOrder: "New freelance orders",
                  newMessage: "New messages",
                  orderDelivered: "Order delivered",
                  systemAnnouncement: "System announcements",
                }[sectionKey];

                const sectionPrefs =
                  form.notificationPreferences[sectionKey] || {};

                return (
                  <div
                    key={sectionKey}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-800 rounded-xl px-3 py-2.5 bg-slate-950/40"
                  >
                    <div className="font-medium text-slate-200">
                      {prettyLabel}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={sectionPrefs.inApp}
                          onChange={handleNotificationChange(
                            sectionKey,
                            "inApp"
                          )}
                          className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                        />
                        <span>In-app</span>
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={sectionPrefs.email}
                          onChange={handleNotificationChange(
                            sectionKey,
                            "email"
                          )}
                          className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                        />
                        <span>Email</span>
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={sectionPrefs.push}
                          onChange={handleNotificationChange(
                            sectionKey,
                            "push"
                          )}
                          className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                        />
                        <span>Push</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SAVE BUTTON */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isSaving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

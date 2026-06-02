import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import useProfileStore from "../../store/profileStore";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Briefcase, 
  ShieldAlert, 
  BellRing,
  Camera,
  ExternalLink,
  ChevronLeft,
  Loader2,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";

const TABS = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "role", label: "Role Details", icon: Briefcase },
  { id: "freelance", label: "Freelance Settings", icon: ExternalLink },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "danger", label: "Danger Zone", icon: ShieldAlert },
];

const ProfilePage = () => {
  const navigate = useNavigate();

  const { user, loadUserFromToken, deleteMyAccount, logout } = useAuthStore();
  const { updateProfile, isSaving } = useProfileStore();

  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Delete Account State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!user) await loadUserFromToken();
    };
    init();
  }, [user, loadUserFromToken]);

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "student",
      profilePicture: user.profilePicture || "",
      college: user.college || "",
      branch: user.branch || "",
      year: user.year || "",
      section: user.section || "",
      rollNumber: user.rollNumber || "",
      company: user.company || "",
      jobTitle: user.jobTitle || "",
      yearOfPassing: user.yearOfPassing || "",
      domain: user.domain || "",
      linkedIn: user.linkedIn || "",
      department: user.department || "",
      designation: user.designation || "",
      employeeId: user.employeeId || "",
      bio: user.bio || "",
      skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "",
      resume: user.resume || "",
      openForFreelance: user.openForFreelance || false,
      upiId: user.upiId || "",
      qrCodeImage: user.qrCodeImage || "",
      freelanceRating: user.freelanceRating || 0,
      notificationPreferences: {
        jobApplication: { ...user.notificationPreferences?.jobApplication },
        eventRegistration: { ...user.notificationPreferences?.eventRegistration },
        newOrder: { ...user.notificationPreferences?.newOrder },
        newMessage: { ...user.notificationPreferences?.newMessage },
        orderDelivered: { ...user.notificationPreferences?.orderDelivered },
        systemAnnouncement: { ...user.notificationPreferences?.systemAnnouncement },
      },
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

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
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };

    if (form.role === "student") {
      payload.branch = form.branch ?? "";
      payload.year = form.year !== "" && form.year !== null ? Number(form.year) : null;
      payload.section = form.section ?? "";
      payload.rollNumber = form.rollNumber ?? "";
    } else if (form.role === "alumni") {
      payload.company = form.company ?? "";
      payload.jobTitle = form.jobTitle ?? "";
      payload.yearOfPassing = form.yearOfPassing !== "" ? Number(form.yearOfPassing) : null;
      payload.domain = form.domain ?? "";
      payload.linkedIn = form.linkedIn ?? "";
    } else if (form.role === "faculty") {
      payload.department = form.department ?? "";
      payload.designation = form.designation ?? "";
      payload.employeeId = form.employeeId ?? "";
    }

    const result = await updateProfile(payload);
    if (result.success) {
      toast.success("Profile updated successfully");
      await loadUserFromToken();
    } else {
      toast.error(result.error || "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const result = await deleteMyAccount(deletePassword);
    setIsDeleting(false);
    if (result.success) {
      toast.success("Account deleted permanently.");
      navigate("/");
    } else {
      toast.error(result.error || "Failed to delete account");
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-300">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p>Loading profile...</p>
      </div>
    );
  }

  const isStudent = form.role === "student";
  const isAlumni = form.role === "alumni";
  const isFaculty = form.role === "faculty";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Cover Image & Profile Header */}
      <div className="relative">
        {/* Cover */}
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur-md rounded-full text-sm font-medium transition-all text-white border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-slate-800">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-slate-950 bg-slate-800 overflow-hidden shadow-xl">
                <img
                  src={form.profilePicture || `https://ui-avatars.com/api/?name=${form.name}&background=random`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-full text-white shadow-lg cursor-pointer hover:bg-blue-500 transition-colors">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left mb-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">{form.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2 text-sm text-slate-400">
                <span className="capitalize px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  {form.role}
                </span>
                <span>{form.email}</span>
                <span className="hidden sm:inline">•</span>
                <span>{form.college}</span>
              </div>
            </div>

            <div className="mb-2">
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Navigation Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-slate-800 text-white shadow-sm" 
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
                  } ${tab.id === 'danger' && !isActive && 'hover:text-red-400'}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? (tab.id === 'danger' ? 'text-red-400' : 'text-blue-400') : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              
              {/* TAB: BASIC INFO */}
              {activeTab === "basic" && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
                  
                  <div className="grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Profile Picture URL</label>
                        <input
                          name="profilePicture"
                          value={form.profilePicture}
                          onChange={handleChange}
                          placeholder="https://..."
                          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">College/University</label>
                      <input
                        name="college"
                        value={form.college}
                        onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Skills (comma separated)</label>
                      <input
                        name="skills"
                        value={form.skills}
                        onChange={handleChange}
                        placeholder="React, Node.js, Design..."
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Resume URL</label>
                      <input
                        name="resume"
                        value={form.resume}
                        onChange={handleChange}
                        placeholder="Google Drive link, etc."
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ROLE DETAILS */}
              {activeTab === "role" && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-xl font-semibold text-white mb-2 capitalize">{form.role} Details</h2>
                  <p className="text-sm text-slate-400 mb-6">Specific information related to your role type.</p>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {isStudent && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Branch</label>
                          <input name="branch" value={form.branch} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
                          <input name="year" type="number" min="1" max="5" value={form.year} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Section</label>
                          <input name="section" value={form.section} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Roll Number</label>
                          <input name="rollNumber" value={form.rollNumber} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                      </>
                    )}

                    {isAlumni && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Company</label>
                          <input name="company" value={form.company} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
                          <input name="jobTitle" value={form.jobTitle} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Year of Passing</label>
                          <input name="yearOfPassing" type="number" value={form.yearOfPassing} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Domain</label>
                          <input name="domain" value={form.domain} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn URL</label>
                          <input name="linkedIn" value={form.linkedIn} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                      </>
                    )}

                    {isFaculty && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                          <input name="department" value={form.department} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Designation</label>
                          <input name="designation" value={form.designation} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-slate-300 mb-2">Employee ID</label>
                          <input name="employeeId" value={form.employeeId} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: FREELANCE */}
              {activeTab === "freelance" && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Freelance Settings</h2>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <span className="text-sm text-yellow-400 font-medium">Rating:</span>
                      <span className="text-sm text-yellow-300 font-bold">{form.freelanceRating?.toFixed ? form.freelanceRating.toFixed(1) : 0} ★</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <input type="checkbox" name="openForFreelance" checked={form.openForFreelance} onChange={handleCheckboxChange} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                        <span className="text-sm font-medium text-slate-200">Open for Freelance Gigs</span>
                      </label>
                      <p className="text-xs text-slate-400 mt-2 ml-14">Enable this to allow users to place orders on your active gigs.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">UPI ID</label>
                        <input name="upiId" value={form.upiId} onChange={handleChange} placeholder="yourname@upi" className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        <p className="text-xs text-slate-500 mt-2">Where you'll receive payments.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">QR Code Image URL</label>
                        <input name="qrCodeImage" value={form.qrCodeImage} onChange={handleChange} placeholder="https://..." className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-xl font-semibold text-white mb-2">Notification Preferences</h2>
                  <p className="text-sm text-slate-400 mb-6">Choose how you want to be notified about activity.</p>
                  
                  <div className="space-y-3">
                    {[
                      { key: "jobApplication", label: "Job Applications", desc: "Updates on jobs you've posted or applied to." },
                      { key: "eventRegistration", label: "Event Registrations", desc: "Reminders and updates for events." },
                      { key: "newOrder", label: "New Freelance Orders", desc: "When someone buys your gig." },
                      { key: "newMessage", label: "New Messages", desc: "When you receive a chat message." },
                      { key: "orderDelivered", label: "Order Delivery", desc: "Updates on orders you've placed or delivered." },
                      { key: "systemAnnouncement", label: "System Announcements", desc: "Important platform updates." },
                    ].map((item) => {
                      const prefs = form.notificationPreferences[item.key] || {};
                      return (
                        <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                          <div>
                            <div className="font-medium text-slate-200">{item.label}</div>
                            <div className="text-xs text-slate-500">{item.desc}</div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={prefs.inApp} onChange={handleNotificationChange(item.key, "inApp")} className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950" />
                              <span className="text-sm text-slate-300">In-app</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={prefs.email} onChange={handleNotificationChange(item.key, "email")} className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950" />
                              <span className="text-sm text-slate-300">Email</span>
                            </label>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB: DANGER ZONE */}
              {activeTab === "danger" && (
                <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                    <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
                  </div>
                  <p className="text-sm text-red-300/80 mb-6 max-w-2xl">
                    Permanently delete your account and all of your content (gigs, properties, active jobs, etc). This action is irreversible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-red-500 mb-2">Delete Account</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              This action is permanent and will delete all your settings, gigs, orders, and events immediately. Please confirm your password to proceed.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || !deletePassword}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-all"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Deletion"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

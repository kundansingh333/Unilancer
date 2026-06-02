import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";
import useAuthStore from "../../store/authStore";
import BookmarkButton from "./BookmarkButton";
import SEO from "../../components/SEO";
import {
  MapPin,
  Briefcase,
  Clock,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Building2,
  GraduationCap,
  ExternalLink,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [job, setJob] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.job);
      setUserStatus(res.data.userStatus);
    } catch {
      setError("Failed to load job details. It might have been removed.");
    } finally {
      setLoading(false);
    }
  };

  const applyJob = () => {
    navigate(`/jobs/${id}/apply`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  // Formatting helpers
  const formatMoney = (amount, currency = "INR") => {
    if (!amount) return null;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isInternship = job?.jobType === "Internship";
  const isUrgent = job ? new Date(job.deadline).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000 : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="p-4 bg-red-500/10 rounded-2xl mb-4 border border-red-500/20">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-xl font-semibold text-slate-200 mb-2">Job not found</h2>
        <p className="text-slate-400 text-center max-w-md mb-6">{error}</p>
        <button
          onClick={() => navigate("/jobs")}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 pb-20">
      <SEO
        title={`${job.title} at ${job.company}`}
        description={job.description?.slice(0, 160) || `Apply for ${job.title} at ${job.company} on Unilancer`}
        path={`/jobs/${id}`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Jobs", path: "/jobs" },
          { name: job.title, path: `/jobs/${id}` },
        ]}
      />

      {/* ==================== HERO / HEADER ==================== */}
      <div className="border-b border-slate-800 bg-slate-900/50 pt-6 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-800 border-2 border-slate-700/50 flex-shrink-0 flex items-center justify-center overflow-hidden bg-white">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-slate-400" />
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 text-lg text-slate-400 mb-4">
                  {job.companyUrl ? (
                    <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:underline flex items-center gap-1 transition-colors">
                      {job.company}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span>{job.company}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-sm text-blue-300 border border-blue-500/20">
                    <Briefcase className="w-4 h-4" />
                    {job.jobType}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-sm text-emerald-300 border border-emerald-500/20">
                    <MapPin className="w-4 h-4" />
                    {job.locationType === "Remote" ? "Remote" : job.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={copyLink}
                className="p-3 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors border border-slate-700"
                title="Share Job"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              <div className="p-1 bg-slate-800/80 rounded-xl border border-slate-700">
                <BookmarkButton
                  jobId={job._id}
                  isBookmarked={userStatus?.isBookmarked}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== CONTENT LAYOUT ==================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* About the Role */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                About the Role
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed text-[15px]">
                {/* Simple text formatting since it might just be string */}
                {job.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Requirements */}
            {job.requirements && job.requirements.skills?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Requirements
                </h2>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                  <ul className="space-y-3">
                    {job.requirements.skills.map((skill, index) => (
                      <li key={index} className="flex items-start gap-3 text-[15px]">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Tags/Keywords */}
            {job.tags && job.tags.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-sm text-slate-300 border border-slate-700/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN - Sticky Summary Card */}
          <div className="lg:sticky lg:top-24 space-y-6">
            
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-6">Quick Facts</h3>
              
              <div className="space-y-5">
                {/* Compensation */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-800 rounded-lg text-blue-400">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Compensation</p>
                    <p className="font-medium text-slate-200">
                      {isInternship && job.stipend
                        ? `${formatMoney(job.stipend)} / month`
                        : !isInternship && job.ctc
                        ? `${job.ctc} LPA`
                        : "Competitive Market Rate"}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg ${isUrgent ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-emerald-400'}`}>
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Application Deadline</p>
                    <p className={`font-medium ${isUrgent ? 'text-amber-400' : 'text-slate-200'}`}>
                      {new Date(job.deadline).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                      {isUrgent && " (Closing Soon)"}
                    </p>
                  </div>
                </div>

                {/* Experience Level / Eligible Branch */}
                {job.branch && (
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-lg text-violet-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Eligible Branch</p>
                      <p className="font-medium text-slate-200">{job.branch}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Apply Button Section */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                {["student", "alumni"].includes(user?.role) ? (
                  userStatus?.hasApplied ? (
                    <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-emerald-300">
                        Application Submitted
                      </p>
                      {userStatus.applicationStatus && (
                        <p className="text-xs text-emerald-400/80 mt-1 capitalize">
                          Status: {userStatus.applicationStatus}
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={applyJob}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      Apply Now
                    </button>
                  )
                ) : (
                  <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p className="text-sm text-slate-400">
                      {user ? "Your account type cannot apply for jobs." : "Sign in as a student or alumni to apply."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Actions (Visible only on small screens) */}
            <div className="md:hidden flex gap-3">
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-300 transition-colors border border-slate-700"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <div className="w-12 h-12 flex-shrink-0 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                 <BookmarkButton
                  jobId={job._id}
                  isBookmarked={userStatus?.isBookmarked}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;

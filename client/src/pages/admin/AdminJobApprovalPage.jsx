import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { fetchPendingJobs, approveJob, rejectJob } from "../../api/adminApi";
import { 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Building2, 
  MapPin,
  Clock,
  ShieldCheck,
  ChevronLeft,
  User,
  CalendarDays
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

const AdminJobApprovalPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPendingJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchPendingJobs();
      setJobs(res.data?.jobs || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load pending jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadPendingJobs();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-rose-500">
        <ShieldCheck className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold">Unauthorized Access</h2>
        <p className="text-slate-400 mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  const handleApprove = async (id) => {
    try {
      const res = await approveJob(id);
      if (res.data?.success) {
        toast.success("Job approved successfully");
        setJobs((prev) => prev.filter((j) => j._id !== id));
      } else {
        toast.error(res.data?.error || "Failed to approve job");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to approve job");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Why are you rejecting this job? (Required)");
    if (!reason || !reason.trim()) {
      return toast.error("A reason is required to reject a job.");
    }
    try {
      const res = await rejectJob(id, reason.trim());
      if (res.data?.success) {
        toast.success("Job rejected successfully");
        setJobs((prev) => prev.filter((j) => j._id !== id));
      } else {
        toast.error(res.data?.error || "Failed to reject job");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reject job");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="Job Approvals" path="/admin/jobs/approvals" noIndex />

      {/* HEADER BANNER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4 w-fit">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Job Approvals
              </h1>
              <p className="text-sm text-slate-400">
                Review and approve or reject new job postings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading pending jobs...
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {jobs.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">All Caught Up!</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              There are no pending job postings to review at this time.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 rounded-2xl flex flex-col transition-all shadow-lg hover:shadow-indigo-500/5 overflow-hidden"
            >
              <div className="p-5 flex-1 flex flex-col space-y-4">
                {/* Header: Company & Role */}
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-lg text-white leading-tight line-clamp-2 mb-1 group-hover:text-indigo-400 transition-colors">
                      {job.title}
                    </h2>
                    <p className="text-sm font-medium text-slate-400 truncate flex items-center gap-1.5">
                      {job.company}
                    </p>
                  </div>
                </div>

                {/* Job Meta Tags */}
                <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md border border-indigo-500/20">
                    <Briefcase className="w-3 h-3" /> {job.jobType}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                  {job.experienceLevel && (
                    <span className="flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
                      <Clock className="w-3 h-3" /> {job.experienceLevel}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed flex-1">
                  {job.description}
                </p>

                {/* Footer Info */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs text-slate-400 space-y-1.5 shadow-inner mt-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span className="truncate">Posted by: <span className="font-medium text-slate-300">{job.postedBy?.name || "Unknown"}</span> ({job.postedByRole || "user"})</span>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center gap-2 text-amber-400/80">
                      <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-px bg-slate-800 border-t border-slate-800">
                <button
                  onClick={() => handleReject(job._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs bg-slate-900/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-all font-bold group"
                >
                  <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> Reject
                </button>
                <button
                  onClick={() => handleApprove(job._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs bg-slate-900/80 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-bold group"
                >
                  <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminJobApprovalPage;

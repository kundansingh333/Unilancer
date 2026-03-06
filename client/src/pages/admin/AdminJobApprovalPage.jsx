import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { fetchPendingJobs, approveJob, rejectJob } from "../../api/adminApi";

const AdminJobApprovalPage = () => {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      loadPendingJobs();
    }
  }, [user]);

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

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Unauthorized
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
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <h1 className="text-2xl font-semibold">Job Approvals</h1>
        <p className="text-sm text-slate-400">Review and approve or reject job postings.</p>

        {loading && <p className="text-slate-400">Loading pending jobs...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {jobs.length === 0 && !loading && (
          <p className="text-slate-400">No pending jobs 🎉</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col"
            >
              {job.companyLogo && (
                <div className="p-4 pb-0 flex items-center gap-3">
                  <img
                    src={job.companyLogo}
                    alt="Company"
                    className="h-10 w-10 rounded object-cover border border-slate-700"
                  />
                  <span className="text-xs text-slate-400">{job.company}</span>
                </div>
              )}
              <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
                <div className="space-y-1">
                  <h2 className="font-semibold text-lg leading-tight line-clamp-2">{job.title}</h2>
                  {!job.companyLogo && (
                    <p className="text-sm text-slate-400">{job.company}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    {job.jobType} • {job.location}
                  </p>
                </div>

                <p className="text-sm text-slate-300 line-clamp-3">{job.description}</p>

                <div className="text-xs text-slate-500 border-t border-slate-800 mt-2 pt-2">
                  <p>Posted by: {job.postedBy?.name || "Unknown"} ({job.postedByRole || "user"})</p>
                  {job.deadline && (
                    <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800 mt-auto">
                  <button
                    onClick={() => handleApprove(job._id)}
                    className="flex-1 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(job._id)}
                    className="flex-1 px-3 py-1.5 text-xs font-semibold rounded bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminJobApprovalPage;

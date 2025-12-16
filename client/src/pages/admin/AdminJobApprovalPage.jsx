import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useJobStore from "../../store/jobsStore";
import useAuthStore from "../../store/authStore";

const AdminJobApprovalPage = () => {
  const { user } = useAuthStore();

  const { jobs, isLoading, error, fetchJobs, updateJob } = useJobStore();

  // Only admin should access
  useEffect(() => {
    if (user?.role === "admin") {
      fetchJobs({}); // fetch all jobs
    }
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Unauthorized
      </div>
    );
  }

  const pendingJobs = jobs.filter((job) => !job.isApproved);

  const approveJob = async (jobId) => {
    const res = await updateJob(jobId, { isApproved: true });
    if (res.success) {
      toast.success("Job approved");
      fetchJobs({});
    } else {
      toast.error(res.error || "Failed to approve job");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Job Approvals</h1>

        {isLoading && <p className="text-slate-400">Loading jobs...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {pendingJobs.length === 0 && !isLoading && (
          <p className="text-slate-400">No pending jobs 🎉</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingJobs.map((job) => (
            <div
              key={job._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2"
            >
              <h2 className="font-semibold">{job.title}</h2>
              <p className="text-sm text-slate-400">{job.company}</p>
              <p className="text-xs text-slate-500">
                {job.jobType} • {job.location}
              </p>

              <p className="text-xs text-slate-400">
                Posted by: {job.postedBy?.name} ({job.postedByRole})
              </p>

              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => approveJob(job._id)}
                  className="px-3 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500"
                >
                  Approve
                </button>

                {/* Optional reject (delete) */}
                {/* 
                <button
                  onClick={() => deleteJob(job._id)}
                  className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-500"
                >
                  Reject
                </button>
                */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminJobApprovalPage;

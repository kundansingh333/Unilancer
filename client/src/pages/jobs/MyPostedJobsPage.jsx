import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useJobStore from "../../store/jobsStore";

const MyPostedJobsPage = () => {
  const navigate = useNavigate();
  const { myPostedJobs, fetchMyPostedJobs, isLoading, error, deleteJob } =
    useJobStore();

  useEffect(() => {
    fetchMyPostedJobs();
  }, []);

  if (isLoading) {
    return <div className="p-6 text-slate-300">Loading your jobs...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-semibold mb-4">My Posted Jobs</h1>

      {myPostedJobs.length === 0 ? (
        <p className="text-slate-400">You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myPostedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2"
            >
              <h2 className="font-semibold">{job.title}</h2>
              <p className="text-xs text-slate-400">{job.company}</p>

              <div className="flex gap-2 pt-2">
                <Link
                  to={`/jobs/${job._id}/applicants`}
                  className="px-3 py-1 text-xs bg-emerald-600 rounded"
                >
                  Applicants
                </Link>

                <button
                  onClick={() => navigate(`/jobs/${job._id}/edit`)}
                  className="px-3 py-1 text-xs bg-blue-600 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteJob(job._id)}
                  className="px-3 py-1 text-xs bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostedJobsPage;

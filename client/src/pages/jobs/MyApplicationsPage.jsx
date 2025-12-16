import { useEffect } from "react";
import useJobStore from "../../store/jobsStore";
import { useNavigate } from "react-router-dom";

const MyApplicationsPage = () => {
  const { myApplications, fetchMyApplications, isLoading, error } =
    useJobStore();

  useEffect(() => {
    fetchMyApplications();
  }, []);
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="p-6 text-slate-300">Loading applications...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-semibold mb-4">My Applications</h1>

      {myApplications.length === 0 ? (
        <p className="text-slate-400">You haven’t applied to any jobs.</p>
      ) : (
        <div className="space-y-3">
          {myApplications.map((app, i) => (
            <div
              key={i}
              onClick={() => navigate(`/jobs/${app.job._id}`)}
              className="bg-slate-900 border border-slate-800 rounded p-4 cursor-pointer
                 hover:bg-slate-800 transition"
            >
              <h2 className="font-semibold">{app.job.title}</h2>
              <p className="text-xs text-slate-400">{app.job.company}</p>
              <p className="text-sm mt-1">
                Status:{" "}
                <span className="capitalize text-blue-400">
                  {app.application.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;

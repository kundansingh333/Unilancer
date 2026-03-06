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
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 cursor-pointer
                 hover:bg-slate-800 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{app.job.title}</h2>
                  <p className="text-xs text-slate-400">{app.job.company}</p>
                </div>
                <span className={`capitalize text-xs px-2.5 py-1 rounded-full font-medium ${
                  app.application.status === "accepted" ? "bg-emerald-600/20 text-emerald-400"
                  : app.application.status === "rejected" ? "bg-red-600/20 text-red-400"
                  : app.application.status === "shortlisted" ? "bg-blue-600/20 text-blue-400"
                  : "bg-slate-700 text-slate-300"
                }`}>
                  {app.application.status}
                </span>
              </div>
              {app.application.note && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 mt-2">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Recruiter Note</p>
                  <p className="text-sm text-slate-200 italic">"{app.application.note}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;

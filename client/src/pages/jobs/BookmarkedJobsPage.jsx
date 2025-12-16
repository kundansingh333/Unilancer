import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as jobsApi from "../../api/jobsApi";
// import * as eventsApi from "../api/eventsApi";

const BookmarkedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await jobsApi.getBookmarkedJobs();
        setJobs(res.data.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading bookmarks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Bookmarked Jobs</h1>

        {jobs.length === 0 ? (
          <p className="text-slate-400">No bookmarked jobs</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition"
              >
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-slate-400">{job.company}</p>
                <p className="text-xs text-slate-500">
                  {job.location} • {job.jobType}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkedJobsPage;

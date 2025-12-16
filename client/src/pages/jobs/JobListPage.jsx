import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import api from "../../api/client";
import { useDebounce } from "../../hooks/useDebounce";

const JobListPage = () => {
  const { user } = useAuthStore();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [branch, setBranch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, jobType, branch, page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/jobs", {
        params: {
          search: debouncedSearch,
          jobType,
          branch,
          page,
          limit: 9,
        },
      });

      setJobs(res.data.jobs);
      setPagination(res.data.pagination);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-slate-400 text-sm">
            Explore internships & full-time opportunities
          </p>
        </header>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
          <input
            className="input"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">Job Type</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            className="input"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">Branch</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="All">All</option>
          </select>
        </div>

        {/* CONTENT */}
        {loading && <p className="text-slate-400">Loading jobs...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && jobs.length === 0 && (
          <p className="text-slate-400">No jobs found</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:bg-slate-800 transition"
            >
              <div className="flex gap-3 items-center">
                <img
                  src={job.companyLogo}
                  alt="logo"
                  className="h-10 w-10 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm">{job.title}</h3>
                  <p className="text-xs text-slate-400">{job.company}</p>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-400 space-y-1">
                <p>{job.jobType}</p>
                <p>{job.location}</p>
                <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* PAGINATION */}
        {pagination && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-slate-400">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListPage;

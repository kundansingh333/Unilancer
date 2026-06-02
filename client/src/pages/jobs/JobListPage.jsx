import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import api from "../../api/client";
import SEO from "../../components/SEO";
import { useDebounce } from "../../hooks/useDebounce";
import JobCard from "../../components/jobs/JobCard";
import {
  Search,
  SlidersHorizontal,
  Briefcase,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

const JobListPage = () => {
  const { user } = useAuthStore();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [branch, setBranch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const fetchJobs = useCallback(async () => {
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

      setJobs(res.data.jobs || []);
      setPagination(res.data.pagination);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, jobType, branch, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSearch("");
    setJobType("");
    setBranch("");
    setPage(1);
    setShowFilters(false);
  };

  const handlePageChange = (newPage) => {
    if (!pagination) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = search || jobType || branch;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEO
        title="Browse Jobs & Internships"
        description="Discover internship and full-time job opportunities for university students and alumni. Find student developer jobs, design roles, and more on Unilancer."
        path="/jobs"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Jobs", path: "/jobs" },
        ]}
      />

      {/* ==================== HERO SECTION ==================== */}
      <div className="relative overflow-hidden border-b border-slate-800/60">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-slate-900/5 to-transparent" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Opportunity</span>
                  </h1>
                </div>
              </div>
              <p className="text-base text-slate-400 max-w-xl">
                Explore exclusive internships, full-time roles, and freelance projects posted by alumni and partners.
              </p>
            </div>

            {user && ["alumni", "faculty", "admin"].includes(user.role) && (
              <Link
                to="/jobs/create"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 whitespace-nowrap"
              >
                + Post a Job
              </Link>
            )}
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex items-center gap-2 max-w-3xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs by title, company, or keywords..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hidden sm:block"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3.5 rounded-xl border transition-all duration-200 shrink-0 ${
                showFilters || jobType || branch
                  ? "bg-blue-500/15 border-blue-500/40 text-blue-400"
                  : "bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
              title="Toggle filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* ==================== FILTERS PANEL ==================== */}
      {showFilters && (
        <div className="border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Filter className="w-4 h-4 text-blue-400" />
                Filters
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1.5 uppercase tracking-wider">
                  Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => {
                    setJobType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 transition-all"
                >
                  <option value="">Any Type</option>
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1.5 uppercase tracking-wider">
                  Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => {
                    setBranch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 transition-all"
                >
                  <option value="">Any Branch</option>
                  <option value="CSE">CSE (Computer Science)</option>
                  <option value="IT">IT (Information Tech)</option>
                  <option value="ECE">ECE (Electronics)</option>
                  <option value="ME">ME (Mechanical)</option>
                  <option value="All">Open to All</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        <div className="mb-6 text-sm text-slate-400">
          {!loading && (
            pagination ? (
              <span>
                Found <span className="text-white font-medium">{pagination.totalJobs || jobs.length}</span> jobs
              </span>
            ) : (
              <span><span className="text-white font-medium">{jobs.length}</span> jobs found</span>
            )
          )}
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <span className="text-red-400 text-sm">⚠️</span>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-sm text-slate-400">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-slate-800/50 rounded-2xl bg-slate-900/20 border-dashed">
            <div className="p-4 bg-slate-800/50 rounded-2xl mb-4">
              <Briefcase className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-1">
              No jobs found
            </h3>
            <p className="text-sm text-slate-500 mb-4 text-center max-w-md">
              Try adjusting your search filters or check back later for new opportunities.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm text-slate-300 transition-all duration-200"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 mb-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-sm text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 5) },
                    (_, i) => {
                      let pageNum;
                      const total = pagination.totalPages;
                      if (total <= 5) pageNum = i + 1;
                      else if (page <= 3) pageNum = i + 1;
                      else if (page >= total - 2) pageNum = total - 4 + i;
                      else pageNum = page - 2 + i;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                            pageNum === page
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                              : "text-slate-400 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pagination.totalPages}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-sm text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobListPage;

// src/pages/gigs/GigsListPage.jsx
import { useEffect, useState } from "react";
import { fetchGigs } from "../../api/gigsApi";
import GigCard from "../../components/gigs/GigCard";

const GigsListPage = () => {
  const [gigs, setGigs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    maxDeliveryTime: "",
    minRating: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const loadGigs = async (override = {}) => {
    setLoading(true);
    setError("");
    try {
      const params = { ...filters, ...override };
      const res = await fetchGigs(params);

      if (!res.data?.success) {
        throw new Error(res.data?.error || "Failed to load gigs");
      }

      setGigs(res.data.gigs || []);
      setPagination(res.data.pagination || null);
      setFilters((prev) => ({ ...prev, ...override }));
    } catch (err) {
      console.error("Fetch gigs error:", err);
      setError(
        err?.response?.data?.error || err.message || "Failed to load gigs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    loadGigs({ page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (!pagination) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    loadGigs({ page: newPage });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">
              Browse <span className="text-blue-500">Gigs</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Find student & alumni freelancers for your projects.
            </p>
          </div>

          {/* Filters */}
          <form
            onSubmit={handleApplyFilters}
            className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 text-xs"
          >
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title, skills..."
              className="input sm:w-52"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input sm:w-40"
            >
              <option value="">All categories</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-app">Mobile Apps</option>
              <option value="data-science">Data Science</option>
              <option value="ui-ux-design">UI/UX</option>
              <option value="graphic-design">Graphic Design</option>
              <option value="content-writing">Content Writing</option>
              <option value="video-editing">Video Editing</option>
              <option value="digital-marketing">Digital Marketing</option>
              <option value="tutoring">Tutoring</option>
              <option value="data-entry">Data Entry</option>
              <option value="translation">Translation</option>
              <option value="other">Other</option>
            </select>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="input sm:w-40"
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price</option>
              <option value="averageRating">Rating</option>
              <option value="deliveryTime">Delivery time</option>
            </select>
            <select
              name="order"
              value={filters.order}
              onChange={handleFilterChange}
              className="input sm:w-28"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <button
              type="submit"
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Secondary filters */}
        <div className="grid sm:grid-cols-4 gap-3 mb-4 text-xs">
          <input
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min price"
            className="input"
          />
          <input
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max price"
            className="input"
          />
          <input
            name="maxDeliveryTime"
            value={filters.maxDeliveryTime}
            onChange={handleFilterChange}
            placeholder="Max delivery days"
            className="input"
          />
          <select
            name="minRating"
            value={filters.minRating}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">Any rating</option>
            <option value="4">4★ & above</option>
            <option value="4.5">4.5★ & above</option>
            <option value="5">5★ only</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-slate-400">Loading gigs...</p>
        ) : gigs.length === 0 ? (
          <p className="text-sm text-slate-400">
            No gigs found with current filters.
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6 text-xs text-slate-300">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page <= 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-40"
                >
                  Prev
                </button>
                <span>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= pagination.totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GigsListPage;

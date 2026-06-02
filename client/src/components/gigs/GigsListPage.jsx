// src/components/gigs/GigsListPage.jsx
import { useEffect, useState, useCallback } from "react";
import { fetchGigs } from "../../api/gigsApi";
import SEO from "../SEO";
import GigCard from "../../components/gigs/GigCard";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  PackageOpen,
  ArrowUpDown,
  Filter,
  LayoutGrid,
  LayoutList,
} from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All Categories", emoji: "🔥" },
  { value: "web-development", label: "Web Development", emoji: "🌐" },
  { value: "mobile-app", label: "Mobile Apps", emoji: "📱" },
  { value: "data-science", label: "Data Science", emoji: "📊" },
  { value: "ui-ux-design", label: "UI/UX Design", emoji: "🎨" },
  { value: "graphic-design", label: "Graphic Design", emoji: "✏️" },
  { value: "content-writing", label: "Content Writing", emoji: "✍️" },
  { value: "video-editing", label: "Video Editing", emoji: "🎬" },
  { value: "digital-marketing", label: "Marketing", emoji: "📈" },
  { value: "tutoring", label: "Tutoring", emoji: "📚" },
  { value: "data-entry", label: "Data Entry", emoji: "⌨️" },
  { value: "translation", label: "Translation", emoji: "🌍" },
  { value: "other", label: "Other", emoji: "💡" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest First" },
  { value: "price", label: "Price" },
  { value: "averageRating", label: "Top Rated" },
  { value: "deliveryTime", label: "Fastest Delivery" },
  { value: "completedOrders", label: "Most Popular" },
];

const RATING_OPTIONS = [
  { value: "", label: "Any Rating" },
  { value: "3", label: "3★ & above" },
  { value: "4", label: "4★ & above" },
  { value: "4.5", label: "4.5★ & above" },
];

const GigsListPage = () => {
  const [gigs, setGigs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

  const [searchInput, setSearchInput] = useState("");

  const loadGigs = useCallback(async (override = {}) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    loadGigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadGigs({ search: searchInput, page: 1 });
  };

  const handleCategoryClick = (catValue) => {
    const newFilters = { category: catValue, page: 1 };
    setFilters((prev) => ({ ...prev, ...newFilters }));
    loadGigs(newFilters);
  };

  const handleApplyFilters = () => {
    loadGigs({ page: 1 });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const cleared = {
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
    };
    setFilters(cleared);
    setSearchInput("");
    loadGigs(cleared);
    setShowFilters(false);
  };

  const handlePageChange = (newPage) => {
    if (!pagination) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    loadGigs({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    filters.minPrice ||
    filters.maxPrice ||
    filters.maxDeliveryTime ||
    filters.minRating;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEO
        title="Browse Freelance Gigs"
        description="Explore freelance gigs offered by university students and alumni. Find web development, design, content writing, and more services on Unilancer."
        path="/gigs"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Gigs", path: "/gigs" },
        ]}
      />

      {/* ==================== HERO SECTION ==================== */}
      <div className="relative overflow-hidden border-b border-slate-800/60">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/8 via-violet-600/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          {/* Title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Gigs</span>
              </h1>
              <p className="text-sm text-slate-400">
                Discover talented freelancers from your campus
              </p>
            </div>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="mt-5 flex items-center gap-2 max-w-2xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search gigs by title, skills, or keywords..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl text-sm font-medium text-white transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 shrink-0"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border transition-all duration-200 shrink-0 ${
                showFilters || hasActiveFilters
                  ? "bg-blue-500/15 border-blue-500/40 text-blue-400"
                  : "bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
              title="Toggle filters"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Category pills (horizontal scroll) */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap border transition-all duration-200 shrink-0 ${
                  filters.category === cat.value
                    ? "bg-blue-500/15 border-blue-500/40 text-blue-300 shadow-md shadow-blue-500/10"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== ADVANCED FILTERS PANEL ==================== */}
      {showFilters && (
        <div className="border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Filter className="w-4 h-4 text-blue-400" />
                Advanced Filters
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

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {/* Min Price */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-1.5 uppercase tracking-wider">
                  Min Price
                </label>
                <input
                  type="number"
                  min={0}
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  placeholder="₹100"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-1.5 uppercase tracking-wider">
                  Max Price
                </label>
                <input
                  type="number"
                  min={0}
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  placeholder="₹50,000"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Max Delivery */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-1.5 uppercase tracking-wider">
                  Max Delivery
                </label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={filters.maxDeliveryTime}
                  onChange={(e) =>
                    handleFilterChange("maxDeliveryTime", e.target.value)
                  }
                  placeholder="e.g., 7 days"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-1.5 uppercase tracking-wider">
                  Min Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange("minRating", e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                >
                  {RATING_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Apply button */}
              <div className="flex items-end">
                <button
                  onClick={handleApplyFilters}
                  className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition-all duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Sort + Result count bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-400">
            {!loading && (
              <>
                {pagination ? (
                  <span>
                    Showing{" "}
                    <span className="text-white font-medium">
                      {gigs.length}
                    </span>{" "}
                    of{" "}
                    <span className="text-white font-medium">
                      {pagination.totalGigs || pagination.total || gigs.length}
                    </span>{" "}
                    gigs
                  </span>
                ) : (
                  <span>
                    <span className="text-white font-medium">{gigs.length}</span>{" "}
                    gigs found
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={`${filters.sortBy}-${filters.order}`}
                onChange={(e) => {
                  const [sortBy, order] = e.target.value.split("-");
                  setFilters((prev) => ({ ...prev, sortBy, order }));
                  loadGigs({ sortBy, order, page: 1 });
                }}
                className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:border-blue-500 transition-all"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="averageRating-desc">Top Rated</option>
                <option value="deliveryTime-asc">Fastest Delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <span className="text-red-400 text-sm">⚠️</span>
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-sm text-slate-400">Loading gigs...</p>
          </div>
        ) : gigs.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 mb-4">
              <PackageOpen className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-1">
              No gigs found
            </h3>
            <p className="text-sm text-slate-500 mb-4 text-center max-w-md">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm text-slate-300 transition-all duration-200"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Gig grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 mb-4">
                {/* Previous */}
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page <= 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-sm text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 7) },
                    (_, i) => {
                      let page;
                      const total = pagination.totalPages;
                      const current = pagination.currentPage;

                      if (total <= 7) {
                        page = i + 1;
                      } else if (current <= 4) {
                        page = i + 1;
                      } else if (current >= total - 3) {
                        page = total - 6 + i;
                      } else {
                        page = current - 3 + i;
                      }

                      if (page < 1 || page > total) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                            page === current
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                              : "text-slate-400 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Next */}
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= pagination.totalPages}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-sm text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
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

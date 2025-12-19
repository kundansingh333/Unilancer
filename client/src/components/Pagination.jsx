// src/components/Pagination.jsx
/**
 * Pagination component - consistent navigation between pages
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-100 text-dark hover:bg-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pages.slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 2)).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
              page === currentPage
                ? "bg-accent text-white"
                : "border border-gray-100 text-dark hover:bg-light"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-100 text-dark hover:bg-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;

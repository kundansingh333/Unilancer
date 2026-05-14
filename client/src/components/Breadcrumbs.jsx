// src/components/Breadcrumbs.jsx
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * Visual breadcrumb navigation component.
 * Renders a styled breadcrumb trail for detail pages.
 *
 * @param {Array} items - Array of { label, to } objects.
 *   The last item is the current page (no link).
 *
 * Usage:
 *   <Breadcrumbs items={[
 *     { label: "Home", to: "/" },
 *     { label: "Gigs", to: "/gigs" },
 *     { label: "Landing Page Design" }
 *   ]} />
 */
const Breadcrumbs = ({ items = [] }) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-slate-400 py-4 overflow-x-auto"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="flex items-center gap-1.5 shrink-0">
            {/* Separator */}
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            )}

            {/* First item gets a home icon */}
            {index === 0 && (
              <Home className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            )}

            {isLast ? (
              <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="text-slate-400 hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

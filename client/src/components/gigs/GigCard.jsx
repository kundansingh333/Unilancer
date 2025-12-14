// src/components/gigs/GigCard.jsx
import { Link } from "react-router-dom";

const CATEGORY_LABELS = {
  "web-development": "Web Development",
  "mobile-app": "Mobile Apps",
  "data-science": "Data Science",
  "ui-ux-design": "UI / UX Design",
  "graphic-design": "Graphic Design",
  "content-writing": "Content Writing",
  "video-editing": "Video Editing",
  "digital-marketing": "Digital Marketing",
  tutoring: "Tutoring",
  "data-entry": "Data Entry",
  translation: "Translation",
  other: "Other",
};

const GigCard = ({ gig }) => {
  const {
    _id,
    title,
    description,
    category,
    price,
    currency = "INR",
    deliveryTime,
    averageRating,
    totalReviews,
    createdBy,
    tags = [],
    isFeatured,
  } = gig;

  const shortDesc =
    description?.length > 140 ? description.slice(0, 140) + "..." : description;

  return (
    <Link
      to={`/gigs/${_id}`}
      className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-blue-500/60 hover:bg-slate-900 transition overflow-hidden"
    >
      {/* Top badge bar */}
      <div className="flex items-center justify-between px-4 pt-3 text-[11px] text-slate-400">
        <span className="px-2 py-0.5 rounded-full bg-slate-800/80">
          {CATEGORY_LABELS[category] || category}
        </span>
        {isFeatured && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/40">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-50 group-hover:text-blue-400 line-clamp-2">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-400 line-clamp-3">{shortDesc}</p>

        {/* Creator & rating */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center text-[11px] font-semibold text-slate-100">
              {createdBy?.profilePicture ? (
                <img
                  src={createdBy.profilePicture}
                  alt={createdBy.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                (createdBy?.name?.[0] || "U").toUpperCase()
              )}
            </div>
            <div className="text-[11px]">
              <p className="text-slate-200 truncate max-w-[120px]">
                {createdBy?.name || "Unilancer User"}
              </p>
              <p className="text-slate-500 text-[10px] capitalize">
                {createdBy?.role === "alumni"
                  ? createdBy.company || "Alumni"
                  : createdBy?.role || "Freelancer"}
              </p>
            </div>
          </div>

          {averageRating > 0 && (
            <div className="text-[11px] text-amber-300 flex items-center gap-1">
              <span>★ {Number(averageRating).toFixed(1)}</span>
              <span className="text-slate-500">
                ({totalReviews || 0} review{(totalReviews || 0) !== 1 && "s"})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 pb-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="font-semibold text-slate-50">
          {currency === "INR" ? "₹" : "$"}
          {price?.toLocaleString("en-IN")}
          <span className="text-[10px] text-slate-400 ml-1">starting</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Delivery in{" "}
          <span className="text-slate-100 font-medium">
            {deliveryTime} day{deliveryTime > 1 && "s"}
          </span>
        </div>
      </div>

      {/* Tags */}
      {tags?.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-[2px] rounded-full bg-slate-800/80 text-[10px] text-slate-300"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] text-slate-500">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default GigCard;

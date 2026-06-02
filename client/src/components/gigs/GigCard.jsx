// src/components/gigs/GigCard.jsx
import { Link } from "react-router-dom";
import { Clock, Star, ArrowUpRight } from "lucide-react";

const CATEGORY_CONFIG = {
  "web-development": { label: "Web Dev", emoji: "🌐", color: "blue" },
  "mobile-app": { label: "Mobile", emoji: "📱", color: "cyan" },
  "data-science": { label: "Data Science", emoji: "📊", color: "emerald" },
  "ui-ux-design": { label: "UI/UX", emoji: "🎨", color: "violet" },
  "graphic-design": { label: "Design", emoji: "✏️", color: "pink" },
  "content-writing": { label: "Writing", emoji: "✍️", color: "amber" },
  "video-editing": { label: "Video", emoji: "🎬", color: "red" },
  "digital-marketing": { label: "Marketing", emoji: "📈", color: "teal" },
  tutoring: { label: "Tutoring", emoji: "📚", color: "indigo" },
  "data-entry": { label: "Data Entry", emoji: "⌨️", color: "slate" },
  translation: { label: "Translation", emoji: "🌍", color: "sky" },
  other: { label: "Other", emoji: "💡", color: "gray" },
};

const COLOR_MAP = {
  blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  pink: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  red: "bg-red-500/15 text-red-300 border-red-500/30",
  teal: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  slate: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  sky: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  gray: "bg-gray-500/15 text-gray-300 border-gray-500/30",
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
    gigImages = [],
    techStack = [],
    completedOrders = 0,
  } = gig;

  const cat = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
  const colorClasses = COLOR_MAP[cat.color] || COLOR_MAP.gray;

  const shortDesc =
    description?.length > 100 ? description.slice(0, 100) + "..." : description;

  const hasImage = gigImages.length > 0;

  return (
    <Link
      to={`/gigs/${_id}`}
      className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5"
    >
      {/* ====== IMAGE / GRADIENT HERO ====== */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {hasImage ? (
          <img
            src={gigImages[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30 group-hover:opacity-50 transition-opacity duration-300">
              {cat.emoji}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-medium">
            <Star className="w-3 h-3 fill-amber-400" />
            Featured
          </div>
        )}

        {/* Category badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full border text-[11px] font-medium backdrop-blur-md ${colorClasses}`}>
          {cat.emoji} {cat.label}
        </div>

        {/* Price overlay on bottom-right of image */}
        <div className="absolute bottom-3 right-3 flex items-baseline gap-0.5">
          <span className="text-xl font-bold text-white drop-shadow-lg">
            {currency === "INR" ? "₹" : "$"}
            {price?.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* ====== CONTENT BODY ====== */}
      <div className="flex-1 flex flex-col px-4 pt-3 pb-2">
        {/* Title */}
        <h3 className="text-[15px] font-semibold text-slate-50 group-hover:text-blue-300 line-clamp-2 leading-snug transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-400/90 line-clamp-2 leading-relaxed">
          {shortDesc}
        </p>

        {/* Tech stack chips */}
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {techStack.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-slate-400 border border-slate-700/50"
              >
                {tech}
              </span>
            ))}
            {techStack.length > 3 && (
              <span className="text-[10px] text-slate-500 flex items-center">
                +{techStack.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* ====== CREATOR ROW ====== */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-slate-700/60 bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-100 shrink-0">
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
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">
                {createdBy?.name || "Unilancer User"}
              </p>
              <p className="text-[10px] text-slate-500 capitalize truncate">
                {createdBy?.role === "alumni"
                  ? createdBy.company || "Alumni"
                  : createdBy?.role || "Freelancer"}
              </p>
            </div>
          </div>

          {/* Rating */}
          {averageRating > 0 ? (
            <div className="flex items-center gap-1 text-xs shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-amber-300">
                {Number(averageRating).toFixed(1)}
              </span>
              <span className="text-slate-500">
                ({totalReviews || 0})
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 italic shrink-0">
              New
            </span>
          )}
        </div>
      </div>

      {/* ====== BOTTOM INFO BAR ====== */}
      <div className="px-4 py-2.5 bg-slate-800/30 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {deliveryTime} day{deliveryTime > 1 ? "s" : ""}
          </span>
          {completedOrders > 0 && (
            <span className="text-slate-500">
              {completedOrders} sold
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          View
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Tags strip at very bottom */}
      {tags?.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-slate-800/40">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-slate-800/60 text-[10px] text-slate-400"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] text-slate-600">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default GigCard;

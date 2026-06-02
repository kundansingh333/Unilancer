import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Clock,
  Banknote,
  GraduationCap,
  CalendarDays,
  ChevronRight,
  Bookmark,
} from "lucide-react";

const JobCard = ({ job }) => {
  const {
    _id,
    title,
    company,
    companyLogo,
    location,
    locationType,
    jobType,
    stipend,
    ctc,
    currency = "INR",
    deadline,
    tags = [],
  } = job;

  // Format currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isInternship = jobType === "Internship";
  const deadlineDate = new Date(deadline);
  const isUrgent = deadlineDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000; // Less than 3 days

  return (
    <Link
      to={`/jobs/${_id}`}
      className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5"
    >
      {/* Top Section */}
      <div className="p-5 flex gap-4">
        {/* Company Logo */}
        <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 flex-shrink-0 flex items-center justify-center">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={company}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-slate-400">
              {company?.[0]?.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-base font-semibold text-slate-50 group-hover:text-blue-400 truncate transition-colors">
              {title}
            </h3>
          </div>
          <p className="text-sm text-slate-400 truncate">{company}</p>

          <div className="flex flex-wrap gap-2 mt-2.5">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 text-[10px] sm:text-xs text-slate-300 border border-slate-700/50">
              <Briefcase className="w-3 h-3 text-blue-400" />
              {jobType}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 text-[10px] sm:text-xs text-slate-300 border border-slate-700/50">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {locationType === "Remote" ? "Remote" : location}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Middle Stats */}
      <div className="px-5 py-3 border-t border-slate-800/50 grid grid-cols-2 gap-y-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
            Compensation
          </span>
          <span className="text-sm font-medium text-slate-200 flex items-center gap-1">
            <Banknote className="w-3.5 h-3.5 text-slate-400" />
            {isInternship && stipend
              ? `${formatMoney(stipend)}/mo`
              : !isInternship && ctc
              ? `${ctc} LPA`
              : "Not specified"}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
            Deadline
          </span>
          <span
            className={`text-sm font-medium flex items-center gap-1 ${
              isUrgent ? "text-amber-400" : "text-slate-200"
            }`}
          >
            <CalendarDays
              className={`w-3.5 h-3.5 ${
                isUrgent ? "text-amber-400" : "text-slate-400"
              }`}
            />
            {deadlineDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>

      {/* Tags Strip */}
      {tags.length > 0 && (
        <div className="px-5 py-2.5 bg-slate-800/30 border-t border-slate-800/50 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/30"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] text-slate-500">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Hover action indicator */}
      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-slate-800/80 p-1.5 rounded-full border border-slate-700">
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
      </div>
    </Link>
  );
};

export default JobCard;

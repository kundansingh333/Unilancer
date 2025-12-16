import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import useJobsStore from "../../store/jobsStore"; // Ensure path matches your file
import useAuthStore from "../../store/authStore";

const BookmarkButton = ({ jobId, isBookmarked }) => {
  const { user } = useAuthStore();
  const { toggleBookmark } = useJobsStore();

  // 1. Create local state initialized with the prop
  const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);

  // 2. Sync local state if the prop changes externally (e.g. initial load)
  useEffect(() => {
    setLocalIsBookmarked(isBookmarked);
  }, [isBookmarked]);

  if (!user) return null;

  const handleToggle = async (e) => {
    // Prevent clicking the card if button is inside a link
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    // 3. OPTIMISTIC UPDATE: Switch color immediately before API finishes
    const previousState = localIsBookmarked;
    setLocalIsBookmarked(!localIsBookmarked);
    setLoading(true);

    try {
      const res = await toggleBookmark(jobId);
      toast.success(res.message, { id: "bookmark" });
    } catch (err) {
      // 4. REVERT: If API fails, switch back to previous state
      setLocalIsBookmarked(previousState);
      toast.error(err.response?.data?.error || "Bookmark failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded text-sm font-medium transition duration-200 flex items-center gap-2 ${
        localIsBookmarked
          ? "bg-yellow-500 text-black hover:bg-yellow-400 shadow-md shadow-yellow-500/20"
          : "bg-slate-800 text-slate-200 hover:bg-slate-700"
      }`}
    >
      {/* Visual Logic based on local state */}
      {localIsBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
    </button>
  );
};

export default BookmarkButton;

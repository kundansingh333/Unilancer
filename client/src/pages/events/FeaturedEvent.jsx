// src/components/events/FeaturedEvents.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useEventStore from "../../store/eventStore";

const FeaturedEvents = () => {
  const { featuredEvents, fetchFeaturedEvents, isLoading } = useEventStore();

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  if (isLoading)
    return (
      <div className="text-slate-400 text-center py-6">
        Loading featured events...
      </div>
    );

  if (!featuredEvents.length)
    return (
      <div className="text-slate-500 text-center py-6">
        No featured events available.
      </div>
    );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-slate-100 mb-4">
        🌟 Featured Events
      </h2>

      <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-thin scrollbar-thumb-slate-700">
        {featuredEvents.map((ev) => (
          <Link
            key={ev._id}
            to={`/events/${ev._id}`}
            className="min-w-[260px] rounded-xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-blue-500 transition"
          >
            <img
              src={ev.eventImage}
              className="h-36 w-full object-cover"
              alt={ev.title}
            />

            <div className="p-3 space-y-1">
              <h3 className="font-semibold text-slate-100 text-sm line-clamp-1">
                {ev.title}
              </h3>

              <p className="text-xs text-slate-400">
                {ev.eventType.replace("-", " ")}
              </p>

              <p className="text-xs text-blue-400">
                {new Date(ev.dateTime).toLocaleDateString()}
              </p>

              <p className="text-xs text-slate-400 truncate">
                By {ev.organizedBy?.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedEvents;

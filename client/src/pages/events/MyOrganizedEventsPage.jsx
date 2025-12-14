import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useEventStore from "../../store/eventStore";

const MyOrganizedEventsPage = () => {
  const navigate = useNavigate();

  const { myOrganizedEvents, loadMyOrganizedEvents, isLoading, error } =
    useEventStore();

  useEffect(() => {
    loadMyOrganizedEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Loading your events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Organized Events</h1>

          <button
            onClick={() => navigate("/events/create")}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm"
          >
            + Create Event
          </button>
        </div>

        {myOrganizedEvents.length === 0 ? (
          <p className="text-slate-400">
            You haven't organized any events yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myOrganizedEvents.map((event) => (
              <div
                key={event._id}
                className="rounded-xl bg-slate-900 border border-slate-800 p-4 hover:border-slate-700"
              >
                <img
                  src={event.eventImage}
                  className="h-32 w-full object-cover rounded-lg mb-3"
                />

                <h2 className="font-semibold text-slate-100 mb-1">
                  {event.title}
                </h2>

                <p className="text-xs text-slate-400 mb-2">
                  {new Date(event.dateTime).toLocaleString()}
                </p>

                <div className="flex flex-wrap gap-2 text-xs mt-3">
                  <Link
                    to={`/events/${event._id}`}
                    className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500"
                  >
                    View
                  </Link>

                  <Link
                    to={`/events/${event._id}/edit`}
                    className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/events/${event._id}/registrations`}
                    className="px-2 py-1 rounded bg-green-600 hover:bg-green-500"
                  >
                    Registrations
                  </Link>

                  <Link
                    to={`/events/${event._id}/delete`}
                    className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500"
                  >
                    Delete
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrganizedEventsPage;

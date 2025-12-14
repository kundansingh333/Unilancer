import { useEffect } from "react";
import { Link } from "react-router-dom";
import useEventStore from "../../store/eventStore";

const MyRegisteredEventsPage = () => {
  const { myRegisteredEvents, fetchMyRegisteredEvents, isLoading, error } =
    useEventStore();

  useEffect(() => {
    fetchMyRegisteredEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200">
        Loading your registered events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Registered Events</h1>

      {!myRegisteredEvents.length ? (
        <div className="text-slate-400 text-center mt-20">
          You haven’t registered for any events yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myRegisteredEvents.map((item) => {
            const e = item.event;
            const reg = item.registration;

            return (
              <Link
                key={e._id}
                to={`/events/${e._id}`}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-600 transition"
              >
                <img
                  src={e.eventImage}
                  className="w-full h-40 object-cover"
                  alt="event"
                />

                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{e.title}</h3>

                  <p className="text-sm text-slate-400">
                    {e.eventType} • {new Date(e.dateTime).toLocaleDateString()}
                  </p>

                  <p className="text-sm">
                    <span className="text-slate-400">Venue:</span> {e.venue}
                  </p>

                  <div className="text-xs text-slate-300 mt-2">
                    <p>
                      Registered on:{" "}
                      <span className="text-blue-400">
                        {new Date(reg.registeredAt).toLocaleDateString()}
                      </span>
                    </p>

                    <p>
                      Payment:{" "}
                      <span
                        className={
                          reg.paymentStatus === "paid"
                            ? "text-green-400"
                            : reg.paymentStatus === "pending"
                            ? "text-amber-400"
                            : "text-slate-400"
                        }
                      >
                        {reg.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRegisteredEventsPage;

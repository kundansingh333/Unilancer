// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useEventStore from "../../store/eventStore";
// import useAuthStore from "../../store/authStore";
// import { toast } from "react-hot-toast";
// import { useDebounce } from "../../hooks/useDebounce";

// const EventListPage = () => {
//   const navigate = useNavigate();

//   const {
//     events,
//     isLoading,
//     error,
//     fetchEvents,
//     featuredEvents,
//     fetchFeaturedEvents,
//     deleteEvent,
//   } = useEventStore();

//   const { user } = useAuthStore();

//   const [search, setSearch] = useState("");
//   const [eventType, setEventType] = useState("");
//   const [venueType, setVenueType] = useState("");

//   // useEffect(() => {
//   //   fetchEvents({ search, eventType, venueType, status: "all" });
//   //   // fetchFeaturedEvents();
//   // }, [search, eventType, venueType]);

//   const debouncedSearch = useDebounce(search, 500);
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     fetchEvents({
//       search: debouncedSearch,
//       eventType,
//       venueType,
//       page,
//       status: "all",
//     });
//   }, [debouncedSearch, eventType, venueType, page]);

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
//         {/* PAGE HEADER */}
//         <header>
//           <h1 className="text-2xl font-semibold">Events</h1>
//           <p className="text-sm text-slate-400">
//             Explore hackathons, workshops, competitions & more.
//           </p>
//         </header>

//         {/* SEARCH + FILTERS */}
//         <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <input
//             type="text"
//             placeholder="Search events..."
//             className="input w-full sm:w-60"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <div className="flex gap-3">
//             <select
//               className="input"
//               value={eventType}
//               onChange={(e) => setEventType(e.target.value)}
//             >
//               <option value="">Type</option>
//               <option value="hackathon">Hackathon</option>
//               <option value="workshop">Workshop</option>
//               <option value="tech-talk">Tech Talk</option>
//               <option value="seminar">Seminar</option>
//               <option value="competition">Competition</option>
//             </select>

//             <select
//               className="input"
//               value={venueType}
//               onChange={(e) => setVenueType(e.target.value)}
//             >
//               <option value="">Venue</option>
//               <option value="On-campus">On-campus</option>
//               <option value="Off-campus">Off-campus</option>
//               <option value="Online">Online</option>
//               <option value="Hybrid">Hybrid</option>
//             </select>
//           </div>
//         </section>

//         {/* FEATURED EVENTS */}
//         {featuredEvents.length > 0 && (
//           <section>
//             <h2 className="text-lg font-semibold mb-2">Featured Events</h2>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {featuredEvents.map((e) => (
//                 <FeaturedCard key={e._id} event={e} />
//               ))}
//             </div>
//           </section>
//         )}

//         {/* EVENT LIST */}
//         <section className="space-y-3">
//           {isLoading && (
//             <div className="text-slate-400 text-sm">Loading events...</div>
//           )}

//           {error && (
//             <div className="text-red-400 text-sm border border-red-500/50 p-3 rounded-lg">
//               {error}
//             </div>
//           )}

//           {!isLoading && events.length === 0 && (
//             <p className="text-slate-500 text-sm">
//               No events found. Try other filters.
//             </p>
//           )}

//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {events.map((event) => (
//               <EventCard
//                 key={event._id}
//                 event={event}
//                 user={user}
//                 deleteEvent={deleteEvent}
//                 navigate={navigate}
//               />
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default EventListPage;

// /* ------------------ Event Card Component ------------------ */
// const EventCard = ({ event, user, deleteEvent, navigate }) => {
//   const isOwner =
//     user && (user.role === "admin" || user._id === event.organizedBy?._id);

//   return (
//     <div className="rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 transition p-4 flex flex-col gap-2 relative">
//       {/* CLICK AREA */}
//       <Link to={`/events/${event._id}`}>
//         <img
//           src={event.eventImage}
//           alt={event.title}
//           className="h-36 w-full object-cover rounded-lg"
//         />

//         <h3 className="text-sm font-semibold mt-2">{event.title}</h3>

//         <p className="text-xs text-slate-400">{event.eventType}</p>

//         <p className="text-xs text-slate-500">
//           {new Date(event.dateTime).toLocaleDateString()}
//         </p>

//         <p className="text-[11px] text-slate-500 truncate">
//           {event.venueType} — {event.venue}
//         </p>
//       </Link>

//       {/* ADMIN / OWNER ACTIONS */}
//       {isOwner && (
//         <div className="flex gap-2 mt-3">
//           <button
//             onClick={() => navigate(`/events/${event._id}/edit`)}
//             className="px-3 py-1 text-xs bg-blue-600 rounded hover:bg-blue-500"
//           >
//             Edit
//           </button>

//           <button
//             onClick={async () => {
//               if (confirm("Are you sure you want to delete this event?")) {
//                 const res = await deleteEvent(event._id);
//                 if (res.success) {
//                   navigate("/events");
//                   toast.success("Event deleted successfully");
//                 } else {
//                   toast.error(res.error || "Failed to delete event");
//                 }
//               }
//             }}
//             className="px-3 py-1 text-xs bg-red-600 rounded hover:bg-red-500"
//           >
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ------------------ Featured Card Component ------------------ */
// const FeaturedCard = ({ event }) => {
//   return (
//     <Link
//       to={`/events/${event._id}`}
//       className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4 hover:bg-blue-500/20 transition"
//     >
//       <h3 className="font-semibold">{event.title}</h3>
//       <p className="text-xs text-blue-300">{event.eventType}</p>
//       <p className="text-xs text-slate-400 mt-1">
//         {new Date(event.dateTime).toLocaleString()}
//       </p>
//     </Link>
//   );
// };

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useEventStore from "../../store/eventStore";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import { useDebounce } from "../../hooks/useDebounce";

const EventListPage = () => {
  const navigate = useNavigate();

  const {
    events,
    isLoading,
    error,
    fetchEvents,
    featuredEvents,
    fetchFeaturedEvents,
    deleteEvent,
  } = useEventStore();

  const { user } = useAuthStore();

  // Filters
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [venueType, setVenueType] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 9;

  // Debounced search
  const debouncedSearch = useDebounce(search, 500);

  // Fetch events
  useEffect(() => {
    fetchEvents({
      search: debouncedSearch,
      eventType,
      venueType,
      page,
      limit,
      status: "all",
    });
  }, [debouncedSearch, eventType, venueType, page]);

  // Fetch featured ONCE
  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-sm text-slate-400">
            Explore hackathons, workshops, competitions & more.
          </p>
        </header>

        {/* FILTERS */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search events..."
            className="input w-full sm:w-60"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset page
            }}
          />

          <div className="flex gap-3">
            <select
              className="input"
              value={eventType}
              onChange={(e) => {
                setEventType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Type</option>
              <option value="hackathon">Hackathon</option>
              <option value="workshop">Workshop</option>
              <option value="tech-talk">Tech Talk</option>
              <option value="seminar">Seminar</option>
              <option value="competition">Competition</option>
            </select>

            <select
              className="input"
              value={venueType}
              onChange={(e) => {
                setVenueType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Venue</option>
              <option value="On-campus">On-campus</option>
              <option value="Off-campus">Off-campus</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </section>

        {/* FEATURED */}
        {featuredEvents.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-2">Featured Events</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredEvents.map((e) => (
                <FeaturedCard key={e._id} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* EVENTS */}
        <section className="space-y-3">
          {isLoading && (
            <div className="text-slate-400 text-sm">Loading events...</div>
          )}

          {error && (
            <div className="text-red-400 text-sm border border-red-500/50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {!isLoading && events.length === 0 && (
            <p className="text-slate-500 text-sm">
              No events found. Try other filters.
            </p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                user={user}
                deleteEvent={deleteEvent}
                navigate={navigate}
              />
            ))}
          </div>
        </section>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-slate-800 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-slate-400 flex items-center">
            Page {page}
          </span>

          <button
            disabled={events.length < limit}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-slate-800 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventListPage;

/* ------------------ Event Card ------------------ */
const EventCard = ({ event, user, deleteEvent, navigate }) => {
  const isOwner =
    user && (user.role === "admin" || user._id === event.organizedBy?._id);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <Link to={`/events/${event._id}`}>
        <img
          src={event.eventImage}
          alt={event.title}
          className="h-36 w-full object-cover rounded-lg"
          loading="lazy"
        />
        <h3 className="text-sm font-semibold mt-2">{event.title}</h3>
        <p className="text-xs text-slate-400">{event.eventType}</p>
        <p className="text-xs text-slate-500">
          {new Date(event.dateTime).toLocaleDateString()}
        </p>
      </Link>

      {isOwner && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate(`/events/${event._id}/edit`)}
            className="px-3 py-1 text-xs bg-blue-600 rounded"
          >
            Edit
          </button>

          <button
            onClick={async () => {
              if (confirm("Delete this event?")) {
                const res = await deleteEvent(event._id);
                res.success
                  ? toast.success("Event deleted")
                  : toast.error(res.error);
              }
            }}
            className="px-3 py-1 text-xs bg-red-600 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

/* ------------------ Featured Card ------------------ */
const FeaturedCard = ({ event }) => (
  <Link
    to={`/events/${event._id}`}
    className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4"
  >
    <h3 className="font-semibold">{event.title}</h3>
    <p className="text-xs text-blue-300">{event.eventType}</p>
  </Link>
);

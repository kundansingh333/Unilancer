import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useEventStore from "../../store/eventStore";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import { useDebounce } from "../../hooks/useDebounce";
import SEO from "../../components/SEO";
import {
  CalendarDays,
  Search,
  MapPin,
  Clock,
  Users,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";

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

  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [venueType, setVenueType] = useState("");

  const [page, setPage] = useState(1);
  const limit = 9;

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchEvents({
      search: debouncedSearch,
      eventType,
      venueType,
      page,
      limit,
      status: "all",
    });
  }, [debouncedSearch, eventType, venueType, page, fetchEvents]);

  useEffect(() => {
    fetchFeaturedEvents();
  }, [fetchFeaturedEvents]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents({
      search: debouncedSearch,
      eventType,
      venueType,
      page: 1,
      limit,
      status: "all",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEO
        title="Campus Events & Hackathons"
        description="Discover university events, hackathons, workshops, tech talks, and competitions on Unilancer. Stay updated with campus activities and networking opportunities."
        path="/events"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
        ]}
      />

      {/* HERO SECTION */}
      <div className="relative overflow-hidden border-b border-slate-800/60 bg-slate-900/50">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-slate-900/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Events</span>
                </h1>
              </div>
              <p className="text-base text-slate-400 max-w-xl">
                Explore hackathons, workshops, competitions, and networking events happening on campus and online.
              </p>
            </div>

            {user && ["alumni", "faculty", "admin"].includes(user.role) && (
              <Link
                to="/events/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Host Event
              </Link>
            )}
          </div>

          {/* Search & Filters */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 max-w-4xl">
            <form onSubmit={handleSearch} className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, topics, or organizers..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </form>

            <select
              value={eventType}
              onChange={(e) => { setEventType(e.target.value); setPage(1); }}
              className="md:col-span-3 bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-purple-500 transition-all appearance-none"
            >
              <option value="">All Types</option>
              <option value="hackathon">Hackathon</option>
              <option value="workshop">Workshop</option>
              <option value="tech-talk">Tech Talk</option>
              <option value="seminar">Seminar</option>
              <option value="competition">Competition</option>
            </select>

            <select
              value={venueType}
              onChange={(e) => { setVenueType(e.target.value); setPage(1); }}
              className="md:col-span-3 bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-purple-500 transition-all appearance-none"
            >
              <option value="">All Venues</option>
              <option value="On-campus">On-campus</option>
              <option value="Off-campus">Off-campus</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        
        {/* FEATURED EVENTS */}
        {featuredEvents.length > 0 && page === 1 && !search && !eventType && !venueType && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <h2 className="text-xl font-bold text-white">Featured Events</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((e) => (
                <FeaturedCard key={e._id} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* ALL EVENTS */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {search || eventType || venueType ? "Search Results" : "Upcoming Events"}
            </h2>
            {!isLoading && (
              <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700">
                {events.length} events found
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
              <p className="text-sm text-slate-400">Loading amazing events...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-slate-800/50 rounded-2xl bg-slate-900/20 border-dashed">
              <div className="p-4 bg-slate-800/50 rounded-2xl mb-4">
                <CalendarDays className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-1">No events found</h3>
              <p className="text-sm text-slate-500 mb-4 text-center max-w-md">
                Try adjusting your search filters or check back later for new activities.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}

          {/* PAGINATION */}
          {!isLoading && events.length > 0 && (
             <div className="flex items-center justify-center gap-4 mt-12">
               <button
                 disabled={page === 1}
                 onClick={() => { setPage((p) => p - 1); window.scrollTo(0, 0); }}
                 className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-sm text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition-all"
               >
                 <ChevronLeft className="w-4 h-4" /> Prev
               </button>
               <span className="text-sm font-medium text-slate-400">Page {page}</span>
               <button
                 disabled={events.length < limit}
                 onClick={() => { setPage((p) => p + 1); window.scrollTo(0, 0); }}
                 className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-sm text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition-all"
               >
                 Next <ChevronRight className="w-4 h-4" />
               </button>
             </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default EventListPage;

/* ------------------ Event Card ------------------ */
const EventCard = ({ event, user, deleteEvent, navigate }) => {
  const isOwner = user && (user.role === "admin" || user._id === event.organizedBy?._id);
  const eventDate = new Date(event.dateTime);
  const isPast = eventDate < new Date();

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden hover:border-purple-500/40 hover:bg-slate-900/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5">
      <Link to={`/events/${event._id}`} className="block relative aspect-video overflow-hidden bg-slate-800">
        {event.eventImage ? (
          <img
            src={event.eventImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
            <CalendarDays className="w-10 h-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
        
        {/* Date Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-700/50 rounded-lg text-center px-2 py-1 shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</p>
          <p className="text-lg font-bold text-white leading-none">{eventDate.getDate()}</p>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-md bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-xs font-medium text-purple-300 capitalize shadow-sm">
            {event.eventType}
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link to={`/events/${event._id}`} className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
            {event.title}
          </h3>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4 shrink-0 text-slate-500" />
              <span>{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4 shrink-0 text-slate-500" />
              <span className="truncate">{event.venueType === 'Online' ? 'Online Event' : event.venue}</span>
            </div>
          </div>
        </Link>

        {isOwner && (
          <div className="flex gap-2 mt-5 pt-4 border-t border-slate-800">
            <button
              onClick={() => navigate(`/events/${event._id}/edit`)}
              className="flex-1 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              Edit
            </button>
            <button
              onClick={async () => {
                if (confirm("Delete this event?")) {
                  const res = await deleteEvent(event._id);
                  res.success ? toast.success("Event deleted") : toast.error(res.error);
                }
              }}
              className="flex-1 px-3 py-2 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------ Featured Card ------------------ */
const FeaturedCard = ({ event }) => {
  const eventDate = new Date(event.dateTime);
  
  return (
    <Link
      to={`/events/${event._id}`}
      className="group relative flex flex-col rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5 overflow-hidden transition-all hover:border-yellow-500/60 hover:bg-yellow-500/10 hover:-translate-y-1 shadow-lg shadow-yellow-500/5"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <span className="inline-block px-2.5 py-1 mb-3 rounded-md bg-yellow-500/20 border border-yellow-500/30 text-[10px] font-bold tracking-wider text-yellow-400 uppercase">
          {event.eventType}
        </span>
        
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-yellow-500/70" />
            {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-yellow-500/70" />
            <span className="truncate max-w-[120px]">{event.venueType === 'Online' ? 'Online' : event.venueType}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

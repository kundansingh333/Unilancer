import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useEventStore from "../../store/eventStore";
import useAuthStore from "../../store/authStore";
import SEO from "../../components/SEO";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  User, 
  Trophy, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  Share2,
  Calendar,
  Globe,
  MessageCircle,
  Hash
} from "lucide-react";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const {
    event: currentEvent,
    fetchEventById,
    registerForEvent,
    unregisterFromEvent,
    isLoading,
    error,
  } = useEventStore();

  useEffect(() => {
    fetchEventById(id);
    window.scrollTo(0, 0);
  }, [id, fetchEventById]);

  if (isLoading || !currentEvent) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-slate-300 bg-slate-950">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-red-400 bg-slate-950 px-4 text-center">
        <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
        <h2 className="text-xl font-bold mb-2">Oops! Something went wrong.</h2>
        <p className="text-slate-400">{error}</p>
        <button onClick={() => navigate('/events')} className="mt-6 px-4 py-2 bg-slate-800 rounded-lg text-white">Back to Events</button>
      </div>
    );
  }

  const event = currentEvent;
  const { registrationOpen, isRegistered } = useEventStore.getState();

  const handleRegister = async () => {
    const res = await registerForEvent(id);
    if (res.success) fetchEventById(id);
    // Error handling is managed by toast in the store
  };

  const handleUnregister = async () => {
    const res = await unregisterFromEvent(id);
    if (res.success) fetchEventById(id);
  };

  const eventDate = new Date(event.dateTime);
  const eventEndDate = event.endDateTime ? new Date(event.endDateTime) : null;
  const isPast = eventDate < new Date();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO
        title={event.title}
        description={event.description?.slice(0, 160) || `${event.title} — ${event.eventType} on Unilancer`}
        path={`/events/${id}`}
        image={event.eventImage || undefined}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
          { name: event.title, path: `/events/${id}` },
        ]}
      />
      
      {/* EVENT HERO */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] min-h-[300px] max-h-[500px]">
        {event.eventImage ? (
          <div className="absolute inset-0">
            <img
              src={event.eventImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20 backdrop-blur-[2px]" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-slate-950">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-slate-950 to-transparent" />
          </div>
        )}

        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur-md rounded-full text-sm font-medium transition-all text-white border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Events
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-purple-500/10">
                {event.eventType}
              </span>
              {isPast && (
                <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  Past Event
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm sm:text-base text-slate-200">
              <div className="flex items-center gap-2 drop-shadow">
                <CalendarDays className="w-5 h-5 text-purple-400" />
                <span>{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 drop-shadow">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2 drop-shadow">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>{event.venueType === 'Online' ? 'Online Event' : event.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* MAIN CONTENT - LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* ABOUT */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                About The Event
              </h2>
              <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed prose-a:text-purple-400">
                <p className="whitespace-pre-line text-slate-300 text-base">{event.description}</p>
              </div>
              
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {event.tags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-400">
                      <Hash className="w-3.5 h-3.5 text-slate-500" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* AGENDA */}
            {event.agenda && event.agenda.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                  Event Schedule
                </h2>
                <div className="relative border-l border-slate-800 ml-3 space-y-8 pb-4">
                  {event.agenda.map((item, i) => (
                    <div key={i} className="relative pl-8">
                      <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-purple-500 ring-4 ring-slate-950"></div>
                      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-purple-500/30 transition-colors">
                        <div className="text-sm font-bold text-purple-400 mb-1 font-mono">{item.time}</div>
                        <h3 className="text-lg font-medium text-white">{item.activity}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SPEAKERS */}
            {event.speakers && event.speakers.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                  Speakers & Guests
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.speakers.map((sp, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                      <img
                        src={sp.profilePicture || `https://ui-avatars.com/api/?name=${sp.name}&background=random`}
                        alt={sp.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-800 shrink-0"
                      />
                      <div>
                        <h3 className="text-base font-bold text-white">{sp.name}</h3>
                        <p className="text-sm text-purple-400 font-medium mb-2">
                          {sp.designation} {sp.company && <span className="text-slate-500">at {sp.company}</span>}
                        </p>
                        {sp.bio && <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{sp.bio}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* RULES & REQUIREMENTS */}
            {(event.rules?.length > 0 || event.requirements?.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-6">
                {event.requirements?.length > 0 && (
                  <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Requirements
                    </h2>
                    <ul className="space-y-3">
                      {event.requirements.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
                          <span className="leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {event.rules?.length > 0 && (
                  <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" /> Rules & Guidelines
                    </h2>
                    <ul className="space-y-3">
                      {event.rules.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
                          <span className="leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR - RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* REGISTRATION CARD (STICKY) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl lg:sticky lg:top-24">
              {user ? (
                <>
                  {!isRegistered && registrationOpen && !isPast && (
                    <>
                      <h3 className="text-xl font-bold text-white mb-2">Join the Event</h3>
                      <p className="text-sm text-slate-400 mb-6">Secure your spot before registrations close.</p>
                      <button
                        onClick={handleRegister}
                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98]"
                      >
                        Register Now
                      </button>
                    </>
                  )}

                  {isRegistered && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">You're In!</h3>
                      <p className="text-sm text-slate-400 mb-6">You have successfully registered for this event. See you there!</p>
                      
                      {!isPast && (
                        <button
                          onClick={handleUnregister}
                          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all border border-slate-700"
                        >
                          Cancel Registration
                        </button>
                      )}
                    </div>
                  )}

                  {!registrationOpen && !isRegistered && !isPast && (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <p className="text-amber-500 font-medium">Registrations Closed</p>
                      <p className="text-sm text-slate-400 mt-1">This event is no longer accepting new registrations.</p>
                    </div>
                  )}

                  {isPast && !isRegistered && (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <p className="text-slate-400 font-medium">Event Ended</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Join the Event</h3>
                  <p className="text-sm text-slate-400 mb-6">Login or create an account to register for this event.</p>
                  <Link
                    to="/login"
                    state={{ from: `/events/${id}` }}
                    className="block w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all text-center"
                  >
                    Login to Register
                  </Link>
                </div>
              )}
            </div>

            {/* EVENT DETAILS CARD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-0.5">Organized By</p>
                    <p className="text-sm text-slate-200 font-medium">{event.organizer}</p>
                  </div>
                </div>
                
                {event.duration && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">Duration</p>
                      <p className="text-sm text-slate-200 font-medium">{event.duration}</p>
                    </div>
                  </div>
                )}
                
                {eventEndDate && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">Ends On</p>
                      <p className="text-sm text-slate-200 font-medium">{eventEndDate.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PRIZES */}
            {event.prizes && event.prizes.length > 0 && (
              <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/5 border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" /> Prizes & Rewards
                </h3>
                <div className="space-y-3">
                  {event.prizes.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                      <span className="text-sm font-bold text-white">{p.position}</span>
                      <span className="text-sm font-medium text-amber-300">{p.reward}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXTERNAL LINKS */}
            {event.externalLinks && Object.values(event.externalLinks).some(x => x) && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Important Links</h3>
                <div className="space-y-2 text-sm font-medium">
                  {event.externalLinks.website && (
                    <a href={event.externalLinks.website} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                      <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Official Website</span>
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                    </a>
                  )}
                  {event.externalLinks.discord && (
                    <a href={event.externalLinks.discord} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                      <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-indigo-400" /> Discord Server</span>
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                    </a>
                  )}
                  {event.externalLinks.whatsapp && (
                    <a href={event.externalLinks.whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                      <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-400" /> WhatsApp Group</span>
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {/* SHARE */}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                // toast is handled globally or we can assume it works
                alert('Link copied to clipboard!');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors font-medium text-sm"
            >
              <Share2 className="w-4 h-4" /> Share Event
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;

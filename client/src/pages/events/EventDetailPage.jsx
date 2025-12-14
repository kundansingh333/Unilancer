

// export default EventDetailPage;

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEventStore from "../../store/eventStore";
import useAuthStore from "../../store/authStore";

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
  }, [id]);

  if (isLoading || !currentEvent) {
    return (
      <div className="min-h-screen flex justify-center items-center text-slate-300 bg-slate-950">
        Loading event...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-400 bg-slate-950">
        {error}
      </div>
    );
  }

  // const event = currentEvent.event;
  // const userStatus = currentEvent.userStatus;
  // const isRegistered = userStatus?.isRegistered;
  // const registrationOpen = currentEvent.registrationOpen;

  const event = currentEvent;
  const { userStatus, registrationOpen, isRegistered } =
    useEventStore.getState();

  const handleRegister = async () => {
    const res = await registerForEvent(id);
    if (res.success) fetchEventById(id);
    else alert(res.error);
  };

  const handleUnregister = async () => {
    const res = await unregisterFromEvent(id);
    if (res.success) fetchEventById(id);
    else alert(res.error);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* EVENT BANNER */}
      <div className="w-full h-60">
        <img
          src={event.eventImage}
          alt="event banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* TITLE */}
        <h1 className="text-3xl font-semibold">{event.title}</h1>

        {/* BASIC INFO */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300">
          <p>
            <span className="text-slate-500">Type:</span> {event.eventType}
          </p>
          <p>
            <span className="text-slate-500">Venue:</span> {event.venue}
          </p>
          <p>
            <span className="text-slate-500">Starts:</span>{" "}
            {new Date(event.dateTime).toLocaleString()}
          </p>
          {event.endDateTime && (
            <p>
              <span className="text-slate-500">Ends:</span>{" "}
              {new Date(event.endDateTime).toLocaleString()}
            </p>
          )}
          <p>
            <span className="text-slate-500">Duration:</span> {event.duration}
          </p>
          <p>
            <span className="text-slate-500">Organizer:</span> {event.organizer}
          </p>
        </div>

        {/* DESCRIPTION */}
        <section className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-slate-300 text-sm whitespace-pre-line">
            {event.description}
          </p>
        </section>

        {/* TAGS */}
        {event.tags.length > 0 && (
          <section className="flex flex-wrap gap-2">
            {event.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-full bg-slate-800 border border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </section>
        )}

        {/* AGENDA */}
        {event.agenda.length > 0 && (
          <section className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-2">Agenda</h2>
            <div className="space-y-2 text-sm">
              {event.agenda.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-blue-400">{item.time}</span>
                  <span>{item.activity}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SPEAKERS */}
        {event.speakers.length > 0 && (
          <section className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-2">Speakers</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {event.speakers.map((sp, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start bg-slate-800/60 p-3 rounded-lg"
                >
                  <img
                    src={sp.profilePicture}
                    className="h-12 w-12 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <p className="font-medium text-slate-200">{sp.name}</p>
                    <p className="text-xs text-slate-400">
                      {sp.designation} — {sp.company}
                    </p>
                    <p className="text-xs text-slate-300 mt-1">{sp.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PRIZES */}
        {event.prizes.length > 0 && (
          <section className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-2">Prizes</h2>

            <ul className="text-sm text-slate-300 space-y-2">
              {event.prizes.map((p, i) => (
                <li key={i}>
                  <span className="text-blue-400 font-medium">
                    {p.position}:
                  </span>{" "}
                  {p.reward}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* REQUIREMENTS */}
        {event.requirements.length > 0 && (
          <section className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-2">Requirements</h2>
            <ul className="list-disc ml-6 text-sm text-slate-300 space-y-1">
              {event.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {/* RULES */}
        {event.rules.length > 0 && (
          <section className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-2">Rules</h2>
            <ul className="list-disc ml-6 text-sm text-slate-300 space-y-1">
              {event.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {/* LINKS */}
        {event.externalLinks &&
          Object.values(event.externalLinks).some((x) => x) && (
            <section className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold mb-2">Useful Links</h2>
              <div className="flex flex-col gap-2 text-sm">
                {event.externalLinks.website && (
                  <a
                    href={event.externalLinks.website}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    Official Website
                  </a>
                )}
                {event.externalLinks.discord && (
                  <a
                    href={event.externalLinks.discord}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    Discord Server
                  </a>
                )}
                {event.externalLinks.whatsapp && (
                  <a
                    href={event.externalLinks.whatsapp}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    WhatsApp Group
                  </a>
                )}
              </div>
            </section>
          )}

        {/* REGISTRATION BOX */}
        <section className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">Registration</h2>

          {!user && (
            <p className="text-sm text-slate-400">
              Please{" "}
              <span
                className="text-blue-400 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                login
              </span>{" "}
              to register.
            </p>
          )}

          {user && !isRegistered && registrationOpen && (
            <button
              onClick={handleRegister}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm"
            >
              Register Now
            </button>
          )}

          {user && isRegistered && (
            <div className="space-y-2">
              <p className="text-green-400 text-sm">You are registered ✔</p>
              <button
                onClick={handleUnregister}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded text-sm"
              >
                Unregister
              </button>
            </div>
          )}

          {!registrationOpen && !isRegistered && (
            <p className="text-sm text-amber-400">
              Registration is closed for this event.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default EventDetailPage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEventStore from "../../store/eventStore";
import { toast } from "react-hot-toast";
import { uploadImage } from "../../api/uploadApi";
import SEO from "../../components/SEO";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  Tag, 
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Loader2,
  ChevronLeft,
  Trophy,
  ListOrdered,
  Mic,
  Briefcase
} from "lucide-react";

const UpdateEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    event: currentEvent,
    fetchEventById,
    updateEvent,
    isLoading,
    error,
    setError,
  } = useEventStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "",
    dateTime: "",
    endDateTime: "",
    duration: "",
    venue: "",
    venueType: "On-campus",
    venueAddress: "",
    meetingLink: "",
    organizer: "",
    organizerContact: { email: "", phone: "" },
    registrationRequired: true,
    registrationDeadline: "",
    registrationFee: 0,
    capacity: 1,
    eligibility: {
      openTo: ["student"],
      branches: ["CSE"],
      years: [1],
      minTeamSize: 1,
      maxTeamSize: 1,
    },
    eventImage: null,
    tags: [],
    agenda: [],
    prizes: [],
    speakers: [],
    sponsors: [],
    requirements: [],
    rules: [],
    externalLinks: { website: "", registrationForm: "", discord: "", whatsapp: "", linkedin: "" },
  });

  useEffect(() => {
    fetchEventById(id);
  }, [id, fetchEventById]);

  useEffect(() => {
    if (!currentEvent) return;

    const e = currentEvent;
    setForm({
      ...form,
      ...e,
      dateTime: e.dateTime?.slice(0, 16) || "",
      endDateTime: e.endDateTime?.slice(0, 16) || "",
      registrationDeadline: e.registrationDeadline?.slice(0, 16) || "",
      organizerContact: e.organizerContact || { email: "", phone: "" },
      externalLinks: e.externalLinks || {
        website: "",
        registrationForm: "",
        discord: "",
        whatsapp: "",
        linkedin: ""
      },
      eligibility: e.eligibility || form.eligibility,
      tags: e.tags || [],
      agenda: e.agenda || [],
      prizes: e.prizes || [],
      speakers: e.speakers || [],
      sponsors: e.sponsors || [],
      requirements: e.requirements || [],
      rules: e.rules || [],
    });
  }, [currentEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleOrganizerContact = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      organizerContact: { ...p.organizerContact, [name]: value },
    }));
  };

  const handleExternalLinks = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      externalLinks: { ...p.externalLinks, [name]: value },
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        eventImage: imageUrl,
      }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  };

  const addItem = (key, emptyObj) => {
    setForm((p) => ({ ...p, [key]: [...p[key], emptyObj] }));
  };

  const updateItem = (key, index, field, value) => {
    const updated = [...form[key]];
    updated[index][field] = value;
    setForm((p) => ({ ...p, [key]: updated }));
  };

  const removeItem = (key, index) => {
    setForm((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await updateEvent(id, form);
    if (res.success) {
      toast.success("Event updated successfully");
      navigate(`/events/${id}`);
    } else {
      toast.error(res.error || "Failed to update event");
    }
  };

  if (isLoading && !currentEvent) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-slate-300 bg-slate-950">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
        <p>Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="Update Event" path={`/events/${id}/edit`} noIndex />
      
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Update Event</h1>
              <p className="text-xs text-slate-400">Editing: {currentEvent?.title}</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="hidden sm:flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* BASIC INFO */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Basic Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Event Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  minLength={5}
                  maxLength={100}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Event Type *</label>
                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none appearance-none"
                >
                  <option value="">Select Type</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="workshop">Workshop</option>
                  <option value="tech-talk">Tech Talk</option>
                  <option value="fest">Fest</option>
                  <option value="meetup">Meetup</option>
                  <option value="seminar">Seminar</option>
                  <option value="webinar">Webinar</option>
                  <option value="competition">Competition</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  minLength={20}
                  maxLength={3000}
                  rows={6}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none resize-y"
                />
              </div>
            </div>
          </section>

          {/* EVENT BANNER */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Event Banner</h2>
            </div>

            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-xl bg-slate-950/30 hover:bg-slate-950/50 transition-colors relative overflow-hidden group">
              {form.eventImage ? (
                <>
                  <img src={form.eventImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  <div className="relative z-10 flex flex-col items-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                    <p className="text-white font-medium">Image uploaded successfully</p>
                    <label className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white cursor-pointer transition-colors border border-slate-700">
                      Change Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center cursor-pointer w-full h-full">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-300 font-medium">Click to upload banner</p>
                  <p className="text-xs text-slate-500 mt-2">16:9 ratio recommended (Max 5MB)</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </section>

          {/* DATE, TIME & VENUE */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Date & Location</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={form.dateTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={form.endDateTime}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Duration *</label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Venue Type</label>
                <select
                  name="venueType"
                  value={form.venueType}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none appearance-none"
                >
                  <option value="On-campus">On-campus</option>
                  <option value="Off-campus">Off-campus</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Venue Name/Location *</label>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                />
              </div>
              {(form.venueType === 'Online' || form.venueType === 'Hybrid') ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Meeting Link</label>
                  <input
                    name="meetingLink"
                    value={form.meetingLink}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Address</label>
                  <input
                    name="venueAddress"
                    value={form.venueAddress}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
              )}
            </div>
          </section>

          {/* ORGANIZER & REGISTRATION */}
          <div className="grid md:grid-cols-2 gap-8">
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white">Organizer</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Organizer Name *</label>
                  <input name="organizer" value={form.organizer} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email</label>
                  <input type="email" name="email" value={form.organizerContact.email} onChange={handleOrganizerContact} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Contact Phone</label>
                  <input type="tel" name="phone" value={form.organizerContact.phone} onChange={handleOrganizerContact} pattern="[0-9]{10}" className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 transition-all outline-none" />
                </div>
              </div>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white">Registration</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-slate-950/50 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                  <input type="checkbox" checked={form.registrationRequired} onChange={(e) => setForm((p) => ({ ...p, registrationRequired: e.target.checked }))} className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-950" />
                  <span className="text-sm font-medium text-slate-200">Registration Required</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Deadline</label>
                  <input type="datetime-local" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500/50 transition-all outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Fee (₹)</label>
                    <input type="number" name="registrationFee" value={form.registrationFee} onChange={handleChange} min="0" className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500/50 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Capacity *</label>
                    <input type="number" name="capacity" value={form.capacity} onChange={handleChange} min="1" required className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500/50 transition-all outline-none" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* TAGS */}
          <TagInput form={form} setForm={setForm} />

          {/* DYNAMIC LISTS */}
          <DynamicSection
            title="Agenda / Schedule"
            icon={<ListOrdered className="w-5 h-5" />}
            color="indigo"
            items={form.agenda}
            fields={[
              { key: "time", label: "Time (e.g. 10:00 AM)", type: "text" },
              { key: "activity", label: "Activity", type: "text" },
              { key: "speaker", label: "Speaker (Optional)", type: "text" },
            ]}
            addItem={() => addItem("agenda", { time: "", activity: "", speaker: "" })}
            updateItem={(i, k, v) => updateItem("agenda", i, k, v)}
            removeItem={(i) => removeItem("agenda", i)}
          />

          <DynamicSection
            title="Prizes & Rewards"
            icon={<Trophy className="w-5 h-5" />}
            color="yellow"
            items={form.prizes}
            fields={[
              { key: "position", label: "Position (e.g. 1st Place)", type: "text" },
              { key: "reward", label: "Reward (e.g. ₹10,000)", type: "text" },
            ]}
            addItem={() => addItem("prizes", { position: "", reward: "" })}
            updateItem={(i, k, v) => updateItem("prizes", i, k, v)}
            removeItem={(i) => removeItem("prizes", i)}
          />

          <DynamicSection
            title="Speakers & Guests"
            icon={<Mic className="w-5 h-5" />}
            color="pink"
            items={form.speakers}
            fields={[
              { key: "name", label: "Name", type: "text" },
              { key: "designation", label: "Designation", type: "text" },
              { key: "company", label: "Company", type: "text" },
              { key: "profilePicture", label: "Profile Picture URL", type: "text" },
              { key: "bio", label: "Bio (Short)", type: "text" },
            ]}
            addItem={() => addItem("speakers", { name: "", designation: "", company: "", profilePicture: "", bio: "" })}
            updateItem={(i, k, v) => updateItem("speakers", i, k, v)}
            removeItem={(i) => removeItem("speakers", i)}
          />

          {/* RULES & REQUIREMENTS */}
          <div className="grid md:grid-cols-2 gap-8">
            <TextList title="Requirements" keyName="requirements" form={form} setForm={setForm} />
            <TextList title="Rules & Guidelines" keyName="rules" form={form} setForm={setForm} />
          </div>

          {/* EXTERNAL LINKS */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-800 text-slate-400 rounded-lg">
                <LinkIcon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">External Links</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Official Website</label>
                <input name="website" placeholder="https://" value={form.externalLinks.website} onChange={handleExternalLinks} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-slate-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">External Registration Form</label>
                <input name="registrationForm" placeholder="https://" value={form.externalLinks.registrationForm} onChange={handleExternalLinks} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-slate-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Discord Server</label>
                <input name="discord" placeholder="https://" value={form.externalLinks.discord} onChange={handleExternalLinks} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-slate-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp Group</label>
                <input name="whatsapp" placeholder="https://" value={form.externalLinks.whatsapp} onChange={handleExternalLinks} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-slate-500 outline-none" />
              </div>
            </div>
          </section>

          {/* SUBMIT */}
          <div className="pt-6 sm:hidden">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ===================================
// TAG INPUT COMPONENT
// ===================================
const TagInput = ({ form, setForm }) => {
  const [tag, setTag] = useState("");

  const addTag = () => {
    if (!tag.trim()) return;
    if (form.tags.includes(tag.trim())) { setTag(""); return; }
    setForm((p) => ({ ...p, tags: [...p.tags, tag.trim()] }));
    setTag("");
  };

  const removeTag = (index) => {
    setForm((p) => ({
      ...p,
      tags: p.tags.filter((_, i) => i !== index),
    }));
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
          <Tag className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Event Tags</h2>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder="e.g. AI, Hackathon, Networking"
          className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500/50 outline-none transition-all"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {form.tags.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm"
          >
            #{t}
            <button type="button" onClick={() => removeTag(i)} className="text-slate-500 hover:text-red-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
    </section>
  );
};

// ===================================
// DYNAMIC SECTION COMPONENT
// ===================================
const DynamicSection = ({ title, icon, color, items, fields, addItem, updateItem, removeItem }) => {
  const colorMap = {
    indigo: "bg-indigo-500/10 text-indigo-400 focus:ring-indigo-500/50 border-indigo-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 focus:ring-yellow-500/50 border-yellow-500/20",
    pink: "bg-pink-500/10 text-pink-400 focus:ring-pink-500/50 border-pink-500/20",
  };
  const theme = colorMap[color] || colorMap.indigo;

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${theme.split(' ')[0]} ${theme.split(' ')[1]}`}>
          {icon}
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>

      <div className="space-y-4 mb-6">
        {items.map((item, i) => (
          <div key={i} className="relative p-5 bg-slate-950/30 border border-slate-800 rounded-xl space-y-4">
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="absolute top-4 right-4 p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="grid sm:grid-cols-2 gap-4 pr-8">
              {fields.map((f) => (
                <div key={f.key} className={f.key === 'bio' || f.key === 'profilePicture' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={item[f.key] || ""}
                    onChange={(e) => updateItem(i, f.key, e.target.value)}
                    placeholder={`Enter ${f.label.toLowerCase()}`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:border-transparent outline-none transition-all focus:ring-purple-500/50"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add Item
      </button>
    </section>
  );
};

// ===================================
// TEXT LIST COMPONENT
// ===================================
const TextList = ({ title, keyName, form, setForm }) => {
  const [value, setValue] = useState("");

  const addItem = () => {
    if (!value.trim()) return;
    setForm((p) => ({ ...p, [keyName]: [...p[keyName], value.trim()] }));
    setValue("");
  };

  const removeItem = (index) => {
    setForm((p) => ({
      ...p,
      [keyName]: p[keyName].filter((_, i) => i !== index),
    }));
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
      <h2 className="text-lg font-bold text-white mb-6">{title}</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
          placeholder={`Add a new item`}
          className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-slate-500/50 outline-none transition-all"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700 text-sm"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {form[keyName].map((item, i) => (
          <li key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg text-sm border border-slate-800">
            <span className="text-slate-300 flex-1 pr-4 leading-relaxed">{item}</span>
            <button type="button" onClick={() => removeItem(i)} className="text-slate-500 hover:text-red-400 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
        {form[keyName].length === 0 && (
          <li className="text-center p-4 text-sm text-slate-500 border border-dashed border-slate-700 rounded-lg">
            No items added yet.
          </li>
        )}
      </ul>
    </section>
  );
};

export default UpdateEventPage;

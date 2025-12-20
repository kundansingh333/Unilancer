// src/pages/events/UpdateEventPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEventStore from "../../store/eventStore";
import { toast } from "react-hot-toast";
import { uploadImage } from "../../api/uploadApi";

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

  // SAME FORM SHAPE AS CREATE EVENT
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
    externalLinks: { website: "", discord: "", whatsapp: "" },
  });

  // Load existing event
  useEffect(() => {
    fetchEventById(id);
  }, [id]);
  useEffect(() => {
    console.log("Fetched Event:", currentEvent);
  }, [currentEvent]);

  useEffect(() => {
    if (!currentEvent) return;

    const e = currentEvent;

    setForm({
      ...form, // keep structure
      ...e, // fill values
      dateTime: e.dateTime?.slice(0, 16) || "",
      endDateTime: e.endDateTime?.slice(0, 16) || "",
      organizerContact: e.organizerContact || { email: "", phone: "" },
      externalLinks: e.externalLinks || {
        website: "",
        discord: "",
        whatsapp: "",
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

  // -----------------------
  // BASIC INPUT
  // -----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // -----------------------
  // NESTED CONTACT FIELDS
  // -----------------------
  const handleOrganizerContact = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      organizerContact: { ...p.organizerContact, [name]: value },
    }));
  };

  // -----------------------
  // EXTERNAL LINKS
  // -----------------------
  const handleExternalLinks = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      externalLinks: { ...p.externalLinks, [name]: value },
    }));
  };

  // -----------------------
  // UPLOAD IMAGE
  // -----------------------
  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     setForm((prev) => ({ ...prev, eventImage: reader.result }));
  //   };

  //   reader.readAsDataURL(file);
  // };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);

      setForm((prev) => ({
        ...prev,
        eventImage: imageUrl, // ✅ Cloudinary URL
      }));

      toast.success("Image uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  };

  // -----------------------
  // DYNAMIC LIST HANDLERS
  // -----------------------
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

  // -----------------------
  // SUBMIT UPDATE
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await updateEvent(id, form);
    if (res.success) {
      toast.success("Event updated successfully");
      navigate(`/events`);
    } else {
      toast.error(res.error || "Failed to update event");
    }
  };

  // -----------------------
  // LOADING STATE
  // -----------------------
  if (isLoading && !currentEvent)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-200">
        Loading event...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Update Event</h1>

        {error && (
          <div className="p-3 mb-4 bg-red-600/30 border border-red-500 rounded">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* REUSE EXACT CREATE FORM FIELDS */}
          {/* ---------- BASIC ---------- */}
          <div>
            <label>Title *</label>
            <input
              name="title"
              className="input mt-1"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Description *</label>
            <textarea
              name="description"
              className="input mt-1 min-h-[120px]"
              value={form.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* EVENT TYPE */}
          <div>
            <label>Event Type *</label>
            <select
              name="eventType"
              className="input mt-1"
              value={form.eventType}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="hackathon">Hackathon</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="competition">Competition</option>
            </select>
          </div>

          {/* DATES */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label>Start Date</label>
              <input
                type="datetime-local"
                name="dateTime"
                className="input mt-1"
                value={form.dateTime}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>End Date</label>
              <input
                type="datetime-local"
                name="endDateTime"
                className="input mt-1"
                value={form.endDateTime}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* DURATION */}
          <div>
            <label>Duration</label>
            <input
              name="duration"
              className="input mt-1"
              value={form.duration}
              onChange={handleChange}
            />
          </div>

          {/* VENUE */}
          <div>
            <label>Venue *</label>
            <input
              name="venue"
              className="input mt-1"
              value={form.venue}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Venue Address</label>
            <input
              name="venueAddress"
              className="input mt-1"
              value={form.venueAddress}
              onChange={handleChange}
            />
          </div>

          {/* ORGANIZER */}
          <div>
            <label>Organizer *</label>
            <input
              name="organizer"
              className="input mt-1"
              value={form.organizer}
              onChange={handleChange}
            />
          </div>

          {/* CONTACT */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label>Organizer Email</label>
              <input
                name="email"
                className="input mt-1"
                value={form.organizerContact.email}
                onChange={handleOrganizerContact}
              />
            </div>
            <div>
              <label>Organizer Phone</label>
              <input
                name="phone"
                className="input mt-1"
                value={form.organizerContact.phone}
                onChange={handleOrganizerContact}
              />
            </div>
          </div>

          {/* EVENT IMAGE */}
          <div>
            <label>Event Banner</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {form.eventImage && (
              <img
                src={form.eventImage}
                className="h-40 mt-3 rounded border border-slate-700 object-cover"
              />
            )}
          </div>

          {/* TAGS */}
          <TagInput form={form} setForm={setForm} />

          {/* REUSABLE DYNAMIC SECTIONS */}
          <DynamicSection
            title="Agenda"
            items={form.agenda}
            fields={[
              { key: "time", label: "Time" },
              { key: "activity", label: "Activity" },
              { key: "speaker", label: "Speaker" },
            ]}
            addItem={() =>
              addItem("agenda", { time: "", activity: "", speaker: "" })
            }
            updateItem={(i, k, v) => updateItem("agenda", i, k, v)}
            removeItem={(i) => removeItem("agenda", i)}
          />

          <DynamicSection
            title="Prizes"
            items={form.prizes}
            fields={[
              { key: "position", label: "Position" },
              { key: "reward", label: "Reward" },
            ]}
            addItem={() => addItem("prizes", { position: "", reward: "" })}
            updateItem={(i, k, v) => updateItem("prizes", i, k, v)}
            removeItem={(i) => removeItem("prizes", i)}
          />

          <DynamicSection
            title="Speakers"
            items={form.speakers}
            fields={[
              { key: "name", label: "Name" },
              { key: "designation", label: "Designation" },
              { key: "company", label: "Company" },
              { key: "profilePicture", label: "Image URL" },
              { key: "bio", label: "Bio" },
            ]}
            addItem={() =>
              addItem("speakers", {
                name: "",
                designation: "",
                company: "",
                profilePicture: "",
                bio: "",
              })
            }
            updateItem={(i, k, v) => updateItem("speakers", i, k, v)}
            removeItem={(i) => removeItem("speakers", i)}
          />

          <TextList
            title="Requirements"
            keyName="requirements"
            form={form}
            setForm={setForm}
          />

          <TextList
            title="Rules"
            keyName="rules"
            form={form}
            setForm={setForm}
          />

          {/* EXTERNAL LINKS */}
          <div>
            <h2 className="text-lg font-semibold mb-2">External Links</h2>

            <input
              name="website"
              className="input mb-2"
              placeholder="Website URL"
              value={form.externalLinks.website}
              onChange={handleExternalLinks}
            />
            <input
              name="discord"
              className="input mb-2"
              placeholder="Discord Link"
              value={form.externalLinks.discord}
              onChange={handleExternalLinks}
            />
            <input
              name="whatsapp"
              className="input mb-2"
              placeholder="WhatsApp Link"
              value={form.externalLinks.whatsapp}
              onChange={handleExternalLinks}
            />
          </div>

          {/* UPDATE BUTTON */}
          <button
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 rounded-lg"
          >
            {isLoading ? "Updating..." : "Update Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventPage;

/* --------------------------------------------------------------------
   REUSABLE COMPONENTS (same as CreateEventPage)
--------------------------------------------------------------------- */

const TagInput = ({ form, setForm }) => {
  const [tag, setTag] = useState("");

  const addTag = () => {
    if (!tag.trim()) return;
    setForm((p) => ({ ...p, tags: [...p.tags, tag] }));
    setTag("");
  };

  return (
    <div>
      <label>Tags</label>
      <div className="flex gap-2 mt-1">
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="input"
        />
        <button
          type="button"
          onClick={addTag}
          className="bg-slate-700 px-3 rounded"
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 mt-2 flex-wrap">
        {form.tags.map((t, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-slate-800 rounded-full text-xs border"
          >
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
};

const DynamicSection = ({
  title,
  items,
  fields,
  addItem,
  updateItem,
  removeItem,
}) => (
  <div>
    <h2 className="text-lg font-semibold mb-2">{title}</h2>

    {items.map((item, i) => (
      <div key={i} className="bg-slate-900 p-3 rounded border mb-2">
        {fields.map((f) => (
          <input
            key={f.key}
            placeholder={f.label}
            className="input mb-2"
            value={item[f.key]}
            onChange={(e) => updateItem(i, f.key, e.target.value)}
          />
        ))}
        <button className="text-red-400 text-sm" onClick={() => removeItem(i)}>
          Remove
        </button>
      </div>
    ))}

    <button
      type="button"
      className="mt-2 px-3 py-1 bg-slate-700 rounded"
      onClick={addItem}
    >
      + Add {title}
    </button>
  </div>
);

const TextList = ({ title, keyName, form, setForm }) => {
  const [value, setValue] = useState("");

  const addItem = () => {
    if (!value.trim()) return;
    setForm((p) => ({ ...p, [keyName]: [...p[keyName], value] }));
    setValue("");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className="flex gap-2 mt-1">
        <input
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className="bg-slate-700 px-3 rounded"
          type="button"
          onClick={addItem}
        >
          Add
        </button>
      </div>

      <ul className="mt-2 space-y-1 text-sm">
        {form[keyName].map((item, i) => (
          <li key={i} className="text-slate-400">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

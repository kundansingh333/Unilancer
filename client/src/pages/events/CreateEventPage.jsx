// // export default CreateEventPage;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useEventStore from "../../store/eventStore";

// const CreateEventPage = () => {
//   const navigate = useNavigate();
//   const { createEvent, isLoading, error, setError } = useEventStore();

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     eventType: "",
//     dateTime: "",
//     endDateTime: "",
//     duration: "", // REQUIRED
//     venue: "",
//     venueType: "On-campus",
//     venueAddress: "",
//     organizer: "",
//     organizerContact: { email: "", phone: "" },

//     registrationRequired: true,
//     registrationDeadline: "",
//     registrationFee: 0,
//     capacity: 1, // must be >=1

//     eligibility: {
//       openTo: ["student"],
//       branches: ["CSE"],
//       years: [1],
//       minTeamSize: 1,
//       maxTeamSize: 1,
//     },

//     eventImage: "",
//     tags: [],
//     agenda: [],
//     prizes: [],
//     speakers: [],
//     sponsors: [],
//     requirements: [],
//     rules: [],
//     externalLinks: { website: "", discord: "", whatsapp: "" },
//   });

//   // IMAGE UPLOAD
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       setForm((prev) => ({ ...prev, eventImage: reader.result }));
//     };
//     reader.readAsDataURL(file);
//   };

//   // GENERAL INPUT
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   // ORGANIZER CONTACT
//   const handleOrganizerContact = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({
//       ...p,
//       organizerContact: { ...p.organizerContact, [name]: value },
//     }));
//   };

//   // EXTERNAL LINKS
//   const handleExternalLinks = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({
//       ...p,
//       externalLinks: { ...p.externalLinks, [name]: value },
//     }));
//   };

//   // DYNAMIC LIST HANDLERS
//   const addItem = (key, emptyObj) => {
//     setForm((p) => ({ ...p, [key]: [...p[key], emptyObj] }));
//   };

//   const updateItem = (key, index, field, value) => {
//     const updated = [...form[key]];
//     updated[index][field] = value;
//     setForm((p) => ({ ...p, [key]: updated }));
//   };

//   const removeItem = (key, index) => {
//     const updated = form[key].filter((_, i) => i !== index);
//     setForm((p) => ({ ...p, [key]: updated }));
//   };

//   // FINAL SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     const res = await createEvent(form);

//     if (res.success) {
//       navigate(`/events/${res.event._id}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-white py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

//         {error && (
//           <div className="p-3 mb-4 bg-red-600/30 border border-red-500 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* BASIC FIELDS */}
//           <div>
//             <label>Title *</label>
//             <input
//               name="title"
//               className="input mt-1"
//               value={form.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <label>Description *</label>
//             <textarea
//               name="description"
//               className="input mt-1 min-h-[120px]"
//               value={form.description}
//               onChange={handleChange}
//               required
//             ></textarea>
//           </div>

//           <div>
//             <label>Event Type *</label>
//             <select
//               name="eventType"
//               className="input mt-1"
//               value={form.eventType}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select</option>
//               <option value="hackathon">Hackathon</option>
//               <option value="workshop">Workshop</option>
//               <option value="seminar">Seminar</option>
//               <option value="competition">Competition</option>
//             </select>
//           </div>

//           {/* DATE & TIME */}
//           <div className="grid sm:grid-cols-2 gap-4">
//             <div>
//               <label>Start Date *</label>
//               <input
//                 type="datetime-local"
//                 name="dateTime"
//                 className="input mt-1"
//                 value={form.dateTime}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div>
//               <label>End Date</label>
//               <input
//                 type="datetime-local"
//                 name="endDateTime"
//                 className="input mt-1"
//                 value={form.endDateTime}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* DURATION */}
//           <div>
//             <label>Duration (required)</label>
//             <input
//               name="duration"
//               className="input mt-1"
//               value={form.duration}
//               onChange={handleChange}
//               placeholder="e.g. 48 hours"
//               required
//             />
//           </div>

//           {/* VENUE */}
//           <div>
//             <label>Venue *</label>
//             <input
//               name="venue"
//               className="input mt-1"
//               value={form.venue}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <label>Venue Address</label>
//             <input
//               name="venueAddress"
//               className="input mt-1"
//               value={form.venueAddress}
//               onChange={handleChange}
//             />
//           </div>

//           <div>
//             <label>Organizer *</label>
//             <input
//               name="organizer"
//               className="input mt-1"
//               value={form.organizer}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* ORGANIZER CONTACT */}
//           <div className="grid sm:grid-cols-2 gap-4">
//             <div>
//               <label>Organizer Email</label>
//               <input
//                 name="email"
//                 className="input mt-1"
//                 value={form.organizerContact.email}
//                 onChange={handleOrganizerContact}
//               />
//             </div>
//             <div>
//               <label>Organizer Phone *</label>
//               <input
//                 name="phone"
//                 className="input mt-1"
//                 value={form.organizerContact.phone}
//                 onChange={handleOrganizerContact}
//                 required
//                 placeholder="10-digit number"
//               />
//             </div>
//           </div>

//           {/* IMAGE UPLOAD */}
//           <div>
//             <label>Event Banner</label>
//             <input type="file" accept="image/*" onChange={handleImageUpload} />

//             {form.eventImage && (
//               <img
//                 src={form.eventImage}
//                 className="h-40 mt-3 rounded border border-slate-700 object-cover"
//               />
//             )}
//           </div>

//           {/* TAGS */}
//           <TagInput form={form} setForm={setForm} />

//           {/* AGENDA */}
//           <DynamicSection
//             title="Agenda"
//             items={form.agenda}
//             fields={[
//               { key: "time", label: "Time" },
//               { key: "activity", label: "Activity" },
//               { key: "speaker", label: "Speaker" },
//             ]}
//             addItem={() =>
//               addItem("agenda", { time: "", activity: "", speaker: "" })
//             }
//             updateItem={(i, k, v) => updateItem("agenda", i, k, v)}
//             removeItem={(i) => removeItem("agenda", i)}
//           />

//           {/* PRIZES */}
//           <DynamicSection
//             title="Prizes"
//             items={form.prizes}
//             fields={[
//               { key: "position", label: "Position" },
//               { key: "reward", label: "Reward" },
//             ]}
//             addItem={() => addItem("prizes", { position: "", reward: "" })}
//             updateItem={(i, k, v) => updateItem("prizes", i, k, v)}
//             removeItem={(i) => removeItem("prizes", i)}
//           />

//           {/* SPEAKERS */}
//           <DynamicSection
//             title="Speakers"
//             items={form.speakers}
//             fields={[
//               { key: "name", label: "Name" },
//               { key: "designation", label: "Designation" },
//               { key: "company", label: "Company" },
//               { key: "profilePicture", label: "Image URL" },
//               { key: "bio", label: "Bio" },
//             ]}
//             addItem={() =>
//               addItem("speakers", {
//                 name: "",
//                 designation: "",
//                 company: "",
//                 profilePicture: "",
//                 bio: "",
//               })
//             }
//             updateItem={(i, k, v) => updateItem("speakers", i, k, v)}
//             removeItem={(i) => removeItem("speakers", i)}
//           />

//           {/* REQUIREMENTS */}
//           <TextList
//             title="Requirements"
//             keyName="requirements"
//             form={form}
//             setForm={setForm}
//           />

//           {/* RULES */}
//           <TextList
//             title="Rules"
//             keyName="rules"
//             form={form}
//             setForm={setForm}
//           />

//           {/* EXTERNAL LINKS */}
//           <div>
//             <h2 className="text-lg font-semibold mb-2">External Links</h2>

//             <input
//               name="website"
//               placeholder="Website URL"
//               className="input mb-2"
//               value={form.externalLinks.website}
//               onChange={handleExternalLinks}
//             />
//             <input
//               name="discord"
//               placeholder="Discord Link"
//               className="input mb-2"
//               value={form.externalLinks.discord}
//               onChange={handleExternalLinks}
//             />
//             <input
//               name="whatsapp"
//               placeholder="WhatsApp Group"
//               className="input mb-2"
//               value={form.externalLinks.whatsapp}
//               onChange={handleExternalLinks}
//             />
//           </div>

//           {/* SUBMIT */}
//           <button
//             disabled={isLoading}
//             className="px-6 py-2 bg-blue-600 rounded-lg"
//           >
//             {isLoading ? "Creating..." : "Create Event"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// // -----------------------------------
// // TAG INPUT
// // -----------------------------------
// const TagInput = ({ form, setForm }) => {
//   const [tag, setTag] = useState("");

//   const addTag = () => {
//     if (!tag.trim()) return;
//     setForm((p) => ({ ...p, tags: [...p.tags, tag] }));
//     setTag("");
//   };

//   return (
//     <div>
//       <label>Tags</label>
//       <div className="flex gap-2 mt-1">
//         <input
//           value={tag}
//           onChange={(e) => setTag(e.target.value)}
//           className="input"
//         />
//         <button
//           type="button"
//           onClick={addTag}
//           className="bg-slate-700 px-3 rounded"
//         >
//           Add
//         </button>
//       </div>

//       <div className="flex gap-2 mt-2 flex-wrap">
//         {form.tags.map((t, i) => (
//           <span
//             key={i}
//             className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700"
//           >
//             #{t}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// // -----------------------------------
// // REUSABLE SECTION
// // -----------------------------------
// const DynamicSection = ({
//   title,
//   items,
//   fields,
//   addItem,
//   updateItem,
//   removeItem,
// }) => (
//   <div>
//     <h2 className="text-lg font-semibold mb-2">{title}</h2>

//     {items.map((item, i) => (
//       <div
//         key={i}
//         className="bg-slate-900 p-3 rounded border border-slate-700 mb-2"
//       >
//         {fields.map((f) => (
//           <input
//             key={f.key}
//             placeholder={f.label}
//             className="input mb-2"
//             value={item[f.key]}
//             onChange={(e) => updateItem(i, f.key, e.target.value)}
//           />
//         ))}
//         <button
//           type="button"
//           onClick={() => removeItem(i)}
//           className="text-red-400 text-sm"
//         >
//           Remove
//         </button>
//       </div>
//     ))}

//     <button
//       type="button"
//       className="mt-2 px-3 py-1 bg-slate-700 rounded"
//       onClick={addItem}
//     >
//       + Add {title}
//     </button>
//   </div>
// );

// // -----------------------------------
// // TEXT LIST
// // -----------------------------------
// const TextList = ({ title, keyName, form, setForm }) => {
//   const [value, setValue] = useState("");

//   const addItem = () => {
//     if (!value.trim()) return;
//     setForm((p) => ({ ...p, [keyName]: [...p[keyName], value] }));
//     setValue("");
//   };

//   return (
//     <div>
//       <h2 className="text-lg font-semibold">{title}</h2>

//       <div className="flex gap-2 mt-1">
//         <input
//           className="input"
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//         />
//         <button
//           type="button"
//           className="bg-slate-700 px-3 rounded"
//           onClick={addItem}
//         >
//           Add
//         </button>
//       </div>

//       <ul className="mt-2 text-sm space-y-1">
//         {form[keyName].map((item, i) => (
//           <li key={i} className="text-slate-400">
//             • {item}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CreateEventPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useEventStore from "../../store/eventStore";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { createEvent, isLoading, error, setError } = useEventStore();

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
    meetingLink: "", // ✅ ADDED
    organizer: "",
    organizerContact: {
      email: "",
      phone: "",
    },
    registrationRequired: true,
    registrationDeadline: "", // ✅ ADDED TO UI
    registrationFee: 0,
    capacity: 0,
    eligibility: {
      // openTo,
      // branches,
      // years: [1],
      minTeamSize: 1,
      maxTeamSize: 1,
    },
    eventImage: "",
    tags: [],
    agenda: [],
    prizes: [],
    speakers: [],
    sponsors: [], // ✅ ADDED UI
    requirements: [],
    rules: [],
    externalLinks: {
      website: "",
      registrationForm: "", // ✅ ADDED
      discord: "",
      whatsapp: "",
      linkedin: "", // ✅ ADDED
    },
  });

  // IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, eventImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // GENERAL INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // ORGANIZER CONTACT
  const handleOrganizerContact = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      organizerContact: { ...p.organizerContact, [name]: value },
    }));
  };

  // EXTERNAL LINKS
  const handleExternalLinks = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      externalLinks: { ...p.externalLinks, [name]: value },
    }));
  };

  // DYNAMIC LIST HANDLERS
  const addItem = (key, emptyObj) => {
    setForm((p) => ({ ...p, [key]: [...p[key], emptyObj] }));
  };

  const updateItem = (key, index, field, value) => {
    const updated = [...form[key]];
    updated[index][field] = value;
    setForm((p) => ({ ...p, [key]: updated }));
  };

  const removeItem = (key, index) => {
    const updated = form[key].filter((_, i) => i !== index);
    setForm((p) => ({ ...p, [key]: updated }));
  };

  // FINAL SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await createEvent(form);
    if (res.success) {
      navigate(`/events/${res.event._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ========== BASIC INFO ========== */}
          <div className="card bg-gray-900 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={100}
                placeholder="Enter event title"
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                minLength={20}
                maxLength={3000}
                rows={4}
                placeholder="Describe your event"
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Event Type *
              </label>
              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                required
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
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
          </div>

          {/* ========== DATE & TIME ========== */}
          <div className="card bg-gray-900 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold mb-4">Date & Time</h3>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                name="dateTime"
                value={form.dateTime}
                onChange={handleChange}
                required
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                name="endDateTime"
                value={form.endDateTime}
                onChange={handleChange}
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Duration *
              </label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                required
                placeholder="e.g., 2 hours, 1 day, 3 days"
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>
          </div>

          {/* ========== VENUE ========== */}
          <div className="card bg-gray-900 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold mb-4">Venue Details</h3>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Venue *
              </label>
              <input
                name="venue"
                value={form.venue}
                onChange={handleChange}
                required
                placeholder="Enter venue name"
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Venue Type
              </label>
              <select
                name="venueType"
                value={form.venueType}
                onChange={handleChange}
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              >
                <option value="On-campus">On-campus</option>
                <option value="Off-campus">Off-campus</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Venue Address
              </label>
              <input
                name="venueAddress"
                value={form.venueAddress}
                onChange={handleChange}
                placeholder="Full address"
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Meeting Link (for Online/Hybrid)
              </label>
              <input
                name="meetingLink"
                value={form.meetingLink}
                onChange={handleChange}
                placeholder="https://zoom.us/j/..."
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>
          </div>

          {/* ========== ORGANIZER INFO ========== */}
          <div className="card bg-gray-900 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold mb-4">
              Organizer Information
            </h3>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Organizer Name *
              </label>
              <input
                name="organizer"
                value={form.organizer}
                onChange={handleChange}
                required
                placeholder="Organizer/Club name"
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Organizer Email
              </label>
              <input
                type="email"
                name="email"
                value={form.organizerContact.email}
                onChange={handleOrganizerContact}
                placeholder="organizer@example.com"
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Organizer Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.organizerContact.phone}
                onChange={handleOrganizerContact}
                placeholder="10-digit phone number"
                pattern="[0-9]{10}"
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>
          </div>

          {/* ========== REGISTRATION ========== */}
          <div className="card bg-gray-900 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold mb-4">Registration Details</h3>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.registrationRequired}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    registrationRequired: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <label className="label text-sm font-medium">
                Registration Required
              </label>
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Registration Deadline
              </label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={form.registrationDeadline}
                onChange={handleChange}
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Registration Fee (₹)
              </label>
              <input
                type="number"
                name="registrationFee"
                value={form.registrationFee}
                onChange={handleChange}
                min="0"
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                min="1"
                required
                placeholder="Maximum participants (0 for unlimited)"
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>
          </div>

          {/* ========== EVENT IMAGE ========== */}
          <div className="card bg-gray-900 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold mb-4">Event Banner</h3>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Upload Banner
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
              {form.eventImage && (
                <img
                  src={form.eventImage}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded"
                />
              )}
            </div>
          </div>

          {/* ========== TAGS ========== */}
          <TagInput form={form} setForm={setForm} />

          {/* ========== AGENDA ========== */}
          <DynamicSection
            title="Agenda"
            items={form.agenda}
            fields={[
              { key: "time", label: "Time", type: "text" },
              { key: "activity", label: "Activity", type: "text" },
              { key: "speaker", label: "Speaker", type: "text" },
            ]}
            addItem={() =>
              addItem("agenda", { time: "", activity: "", speaker: "" })
            }
            updateItem={(i, k, v) => updateItem("agenda", i, k, v)}
            removeItem={(i) => removeItem("agenda", i)}
          />

          {/* ========== PRIZES ========== */}
          <DynamicSection
            title="Prizes"
            items={form.prizes}
            fields={[
              { key: "position", label: "Position", type: "text" },
              { key: "reward", label: "Reward", type: "text" },
            ]}
            addItem={() => addItem("prizes", { position: "", reward: "" })}
            updateItem={(i, k, v) => updateItem("prizes", i, k, v)}
            removeItem={(i) => removeItem("prizes", i)}
          />

          {/* ========== SPEAKERS ========== */}
          <DynamicSection
            title="Speakers"
            items={form.speakers}
            fields={[
              { key: "name", label: "Name", type: "text" },
              { key: "designation", label: "Designation", type: "text" },
              { key: "company", label: "Company", type: "text" },
              {
                key: "profilePicture",
                label: "Profile Picture URL",
                type: "text",
              },
              { key: "bio", label: "Bio", type: "text" },
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

          {/* ========== SPONSORS ========== */}
          <DynamicSection
            title="Sponsors"
            items={form.sponsors}
            fields={[
              { key: "name", label: "Sponsor Name", type: "text" },
              { key: "logo", label: "Logo URL", type: "text" },
              {
                key: "tier",
                label: "Tier (Title/Platinum/Gold/Silver/Bronze)",
                type: "text",
              },
            ]}
            addItem={() =>
              addItem("sponsors", { name: "", logo: "", tier: "" })
            }
            updateItem={(i, k, v) => updateItem("sponsors", i, k, v)}
            removeItem={(i) => removeItem("sponsors", i)}
          />

          {/* ========== REQUIREMENTS ========== */}
          <TextList
            title="Requirements"
            keyName="requirements"
            form={form}
            setForm={setForm}
          />

          {/* ========== RULES ========== */}
          <TextList
            title="Rules"
            keyName="rules"
            form={form}
            setForm={setForm}
          />

          {/* ========== EXTERNAL LINKS ========== */}
          <div className="card bg-gray-900 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold mb-4">External Links</h3>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Website
              </label>
              <input
                name="website"
                placeholder="https://example.com"
                value={form.externalLinks.website}
                onChange={handleExternalLinks}
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Registration Form URL
              </label>
              <input
                name="registrationForm"
                placeholder="https://forms.google.com/..."
                value={form.externalLinks.registrationForm}
                onChange={handleExternalLinks}
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                Discord
              </label>
              <input
                name="discord"
                placeholder="https://discord.gg/..."
                value={form.externalLinks.discord}
                onChange={handleExternalLinks}
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                WhatsApp
              </label>
              <input
                name="whatsapp"
                placeholder="https://chat.whatsapp.com/..."
                value={form.externalLinks.whatsapp}
                onChange={handleExternalLinks}
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="label block text-sm font-medium mb-2">
                LinkedIn
              </label>
              <input
                name="linkedin"
                placeholder="https://linkedin.com/..."
                value={form.externalLinks.linkedin}
                onChange={handleExternalLinks}
                className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              />
            </div>
          </div>

          {/* ========== SUBMIT BUTTON ========== */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {isLoading ? "Creating..." : "Create Event"}
          </button>
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
    <div className="card bg-gray-900 p-6 rounded-lg space-y-4">
      <h3 className="text-xl font-semibold mb-4">Tags</h3>

      <div className="flex gap-2">
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder="Add tag and press Enter"
          className="input flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2"
        />
        <button
          type="button"
          onClick={addTag}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {form.tags.map((t, i) => (
          <span
            key={i}
            className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            #{t}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="hover:text-red-400"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// ===================================
// DYNAMIC SECTION COMPONENT
// ===================================
const DynamicSection = ({
  title,
  items,
  fields,
  addItem,
  updateItem,
  removeItem,
}) => (
  <div className="card bg-gray-900 p-6 rounded-lg space-y-4">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>

    {items.map((item, i) => (
      <div key={i} className="border border-gray-700 p-4 rounded space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="label block text-sm font-medium mb-2">
              {f.label}
            </label>
            <input
              type={f.type}
              value={item[f.key] || ""}
              onChange={(e) => updateItem(i, f.key, e.target.value)}
              placeholder={f.label}
              className="input w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => removeItem(i)}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Remove
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={addItem}
      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
    >
      + Add {title}
    </button>
  </div>
);

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
    <div className="card bg-gray-900 p-6 rounded-lg space-y-4">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>

      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addItem())
          }
          placeholder={`Add ${title.toLowerCase()}`}
          className="input flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2"
        />
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {form[keyName].map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-gray-800 p-3 rounded"
          >
            <span>• {item}</span>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateEventPage;

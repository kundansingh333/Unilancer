import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useJobsStore from "../../store/jobsStore";

const CreateJobPage = () => {
  const navigate = useNavigate();
  const { createJob, isLoading } = useJobsStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    companyLogo: "",
    location: "",
    locationType: "On-site",
    jobType: "Internship",
    duration: "",
    stipend: "",
    ctc: "",
    currency: "INR",

    requirements: {
      branches: [],
      batches: [],
      minCGPA: 0,
      skills: [],
      backlogAllowed: true,
      maxBacklogs: 0,
    },

    applicationLink: "",
    applyType: "internal",
    deadline: "",
    openings: 1,

    tags: [],
    category: "Other",
    benefits: [],
    responsibilities: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      stipend: form.stipend ? Number(form.stipend) : undefined,
      ctc: form.ctc ? Number(form.ctc) : undefined,
      openings: Number(form.openings),
    };

    const res = await createJob(payload);
    if (res.success) navigate("/jobs");
    else alert(res.error);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6">Create Job</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
        />

        <textarea
          className="input"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />

        <input
          className="input"
          name="company"
          placeholder="Company"
          onChange={handleChange}
          required
        />

        <input
          className="input"
          name="companyLogo"
          placeholder="Company Logo URL"
          onChange={handleChange}
        />

        <input
          className="input"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />

        <select name="locationType" className="input" onChange={handleChange}>
          <option>On-site</option>
          <option>Remote</option>
          <option>Hybrid</option>
        </select>

        <select name="jobType" className="input" onChange={handleChange}>
          <option>Internship</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
        </select>

        {(form.jobType === "Internship" || form.jobType === "Contract") && (
          <input
            className="input"
            name="duration"
            placeholder="Duration (eg: 6 months)"
            onChange={handleChange}
          />
        )}

        {form.jobType === "Internship" && (
          <input
            className="input"
            name="stipend"
            placeholder="Stipend"
            type="number"
            onChange={handleChange}
          />
        )}

        {form.jobType === "Full-time" && (
          <input
            className="input"
            name="ctc"
            placeholder="CTC (LPA)"
            type="number"
            onChange={handleChange}
          />
        )}

        <input
          className="input"
          type="date"
          name="deadline"
          onChange={handleChange}
          required
        />

        <input
          className="input"
          name="openings"
          type="number"
          onChange={handleChange}
        />

        <input
          className="input"
          name="tags"
          placeholder="Tags (comma separated)"
          onChange={(e) =>
            setForm({ ...form, tags: e.target.value.split(",") })
          }
        />

        <textarea
          className="input"
          placeholder="Responsibilities"
          onChange={(e) =>
            setForm({ ...form, responsibilities: e.target.value.split("\n") })
          }
        />

        <textarea
          className="input"
          placeholder="Benefits"
          onChange={(e) =>
            setForm({ ...form, benefits: e.target.value.split("\n") })
          }
        />

        <button disabled={isLoading} className="bg-blue-600 px-6 py-2 rounded">
          {isLoading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
};

export default CreateJobPage;

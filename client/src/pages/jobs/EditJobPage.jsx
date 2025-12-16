import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useJobStore from "../../store/jobsStore";

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchJobById, updateJob, isLoading, error } = useJobStore();

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetchJobById(id);
      if (res?.job) {
        // Format the data properly for the form
        const job = res.job;
        setForm({
          title: job.title || "",
          description: job.description || "",
          company: job.company || "",
          companyLogo: job.companyLogo || "",
          location: job.location || "",
          locationType: job.locationType || "On-site",
          jobType: job.jobType || "Internship",
          duration: job.duration || "",
          stipend: job.stipend || "",
          ctc: job.ctc || "",
          currency: job.currency || "INR",
          requirements: job.requirements || {
            branches: [],
            batches: [],
            minCGPA: 0,
            skills: [],
            backlogAllowed: true,
            maxBacklogs: 0,
          },
          applicationLink: job.applicationLink || "",
          applyType: job.applyType || "internal",
          deadline: job.deadline ? job.deadline.split("T")[0] : "",
          openings: job.openings || 1,
          tags: job.tags || [],
          category: job.category || "Other",
          benefits: job.benefits || [],
          responsibilities: job.responsibilities || [],
        });
      }
      setLoading(false);
    })();
  }, [id]);

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

    const res = await updateJob(id, payload);
    if (res.success) {
      alert("Job updated successfully!");
      navigate("/jobs/my/posted");
    } else {
      alert(res.error || "Failed to update job");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Loading job details...
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
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Edit Job</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* BASIC INFO */}
          <div className="bg-slate-900 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title *
              </label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer Intern"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Job description"
                rows={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Company *
              </label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Company Logo URL
              </label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                name="companyLogo"
                value={form.companyLogo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          {/* LOCATION & TYPE */}
          <div className="bg-slate-900 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold mb-4">Location & Type</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                Location *
              </label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., Bangalore, India"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Location Type
              </label>
              <select
                name="locationType"
                value={form.locationType}
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                onChange={handleChange}
              >
                <option>On-site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <select
                name="jobType"
                value={form.jobType}
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                onChange={handleChange}
              >
                <option>Internship</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </div>

            {(form.jobType === "Internship" || form.jobType === "Contract") && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration
                </label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g., 6 months"
                />
              </div>
            )}

            {form.jobType === "Internship" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Stipend ({form.currency})
                </label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                  name="stipend"
                  value={form.stipend}
                  onChange={handleChange}
                  type="number"
                  placeholder="Monthly stipend"
                />
              </div>
            )}

            {form.jobType === "Full-time" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  CTC (LPA)
                </label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                  name="ctc"
                  value={form.ctc}
                  onChange={handleChange}
                  type="number"
                  placeholder="Annual CTC in lakhs"
                />
              </div>
            )}
          </div>

          {/* APPLICATION DETAILS */}
          <div className="bg-slate-900 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold mb-4">Application Details</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                Application Deadline *
              </label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Openings
              </label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                name="openings"
                value={form.openings}
                onChange={handleChange}
                type="number"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Application Link (Optional)
              </label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                name="applicationLink"
                value={form.applicationLink}
                onChange={handleChange}
                placeholder="External application URL"
              />
            </div>
          </div>

          {/* ADDITIONAL INFO */}
          <div className="bg-slate-900 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              Additional Information
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (comma separated)
              </label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                name="tags"
                value={form.tags.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Responsibilities (one per line)
              </label>
              <textarea
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                value={form.responsibilities.join("\n")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    responsibilities: e.target.value
                      .split("\n")
                      .filter(Boolean),
                  })
                }
                rows={5}
                placeholder="Develop frontend components&#10;Write clean code&#10;Collaborate with team"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Benefits (one per line)
              </label>
              <textarea
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                value={form.benefits.join("\n")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    benefits: e.target.value.split("\n").filter(Boolean),
                  })
                }
                rows={5}
                placeholder="Flexible hours&#10;Work from home&#10;Learning opportunities"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={form.category}
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2"
                onChange={handleChange}
              >
                <option>Development</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>Data Science</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {isLoading ? "Updating..." : "Update Job"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/jobs/my/posted")}
              className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobPage;

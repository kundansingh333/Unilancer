import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useJobStore from "../../store/jobsStore";
import {
  Briefcase,
  MapPin,
  ListChecks,
  Link as LinkIcon,
  ChevronLeft,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const JOB_CATEGORIES = [
  "Development", "Design", "Marketing", "Sales", "Data Science", "Content Writing", "Management", "Other"
];

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchJobById, updateJob, isLoading, error: storeError } = useJobStore();

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
    category: "Development",
    benefits: [],
    responsibilities: [],
  });

  const [loading, setLoading] = useState(true);
  const [tagInput, setTagInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetchJobById(id);
      if (res?.job) {
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
  }, [id, fetchJobById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleArrayAdd = (field, value, setter) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    
    if (field === 'tags') {
      if (!form.tags.includes(trimmed)) {
        setForm(p => ({ ...p, tags: [...p.tags, trimmed] }));
      }
    } else if (field === 'skills') {
      if (!form.requirements.skills.includes(trimmed)) {
        setForm(p => ({
          ...p,
          requirements: { ...p.requirements, skills: [...p.requirements.skills, trimmed] }
        }));
      }
    }
    setter("");
  };

  const handleArrayRemove = (field, index) => {
    if (field === 'tags') {
      setForm(p => ({ ...p, tags: p.tags.filter((_, i) => i !== index) }));
    } else if (field === 'skills') {
      setForm(p => ({
        ...p,
        requirements: {
          ...p.requirements,
          skills: p.requirements.skills.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      stipend: form.stipend ? Number(form.stipend) : undefined,
      ctc: form.ctc ? Number(form.ctc) : undefined,
      openings: Number(form.openings),
    };

    try {
      const res = await updateJob(id, payload);
      if (res.success) {
        toast.success("Job updated successfully!");
        navigate("/jobs/my/posted");
      } else {
        toast.error(res.error || "Failed to update job");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400">Loading job details...</p>
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
        {storeError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 pt-8 pb-6 sticky top-16 z-10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/jobs/my/posted" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4 w-fit">
            <ChevronLeft className="w-4 h-4" /> Back to My Jobs
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Edit Job</h1>
              <p className="text-sm text-slate-400 mt-1">Update the details for your job posting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: Basic Info */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Basic Information</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Job Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Company Name *</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Company Logo URL</label>
                <input
                  name="companyLogo"
                  value={form.companyLogo}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Job Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  {JOB_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Openings</label>
                <input
                  name="openings"
                  type="number"
                  min="1"
                  value={form.openings}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: Location & Compensation */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Location & Compensation</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Job Type *</label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location Type *</label>
                <select
                  name="locationType"
                  value={form.locationType}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {(form.jobType === "Internship" || form.jobType === "Contract") && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              )}

              {form.jobType === "Internship" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Stipend ({form.currency})</label>
                  <input
                    name="stipend"
                    type="number"
                    value={form.stipend}
                    onChange={handleChange}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              )}

              {form.jobType === "Full-time" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">CTC (LPA)</label>
                  <input
                    name="ctc"
                    type="number"
                    step="0.1"
                    value={form.ctc}
                    onChange={handleChange}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              )}
            </div>
          </section>

          {/* SECTION 3: Requirements & Scope */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <ListChecks className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">Requirements & Scope</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Required Skills</label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayAdd('skills', skillInput, setSkillInput);
                      }
                    }}
                    className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayAdd('skills', skillInput, setSkillInput)}
                    className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {form.requirements.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.requirements.skills.map((skill, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-lg text-sm">
                        {skill}
                        <button type="button" onClick={() => handleArrayRemove('skills', i)} className="text-violet-400 hover:text-red-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Responsibilities (one per line)</label>
                  <textarea
                    value={form.responsibilities.join("\n")}
                    onChange={(e) => setForm(p => ({ ...p, responsibilities: e.target.value.split('\n') }))}
                    rows={4}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 transition-all resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Benefits (one per line)</label>
                  <textarea
                    value={form.benefits.join("\n")}
                    onChange={(e) => setForm(p => ({ ...p, benefits: e.target.value.split('\n') }))}
                    rows={4}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 transition-all resize-y"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: Application Details & Tags */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <LinkIcon className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Application Details & Tags</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Application Deadline *</label>
                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">External Application Link (Optional)</label>
                <input
                  name="applicationLink"
                  value={form.applicationLink}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Search Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayAdd('tags', tagInput, setTagInput);
                      }
                    }}
                    className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Type a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayAdd('tags', tagInput, setTagInput)}
                    className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm">
                        #{tag}
                        <button type="button" onClick={() => handleArrayRemove('tags', i)} className="text-slate-400 hover:text-red-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/jobs/my/posted")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-70 transition-all"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</>
              ) : "Update Job"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditJobPage;

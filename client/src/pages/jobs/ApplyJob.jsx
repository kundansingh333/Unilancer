import { useEffect, useState } from "react";
import useJobsStore from "../../store/jobsStore";
import * as jobsApi from "../../api/jobsApi";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// import { use } from "react";

const ApplyJob = () => {
  const { jobId } = useParams();
  const { fetchJobById, job, isLoading } = useJobsStore();
  const navigate = useNavigate();

  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchJobById(jobId);
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await jobsApi.applyForJob(jobId, {
        resume,
        coverLetter,
      });

      setMessage({
        type: "success",
        text: "Application submitted successfully!",
      });
      toast.success("Application submitted successfully!");
      useNavigate("/jobs/my/applications");

      setResume("");
      setCoverLetter("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to apply",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10 text-black">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6">
        {/* Job Info */}
        {job && (
          <div className="mb-6 border-b pb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Apply for {job.title}
            </h1>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Resume URL
            </label>
            <input
              type="url"
              required
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="https://cloudinary.com/my-resume.pdf"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Letter
            </label>
            <textarea
              rows="8"
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Feedback */}
          {message.text && (
            <p
              className={`text-sm p-2 rounded ${
                message.type === "success"
                  ? "text-green-700 bg-green-50"
                  : "text-red-700 bg-red-50"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;

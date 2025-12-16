import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";
import useAuthStore from "../../store/authStore";
import BookmarkButton from "./BookMarkButton";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [job, setJob] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.job);
      setUserStatus(res.data.userStatus);
    } catch {
      setError("Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  const applyJob = () => {
    navigate(`/jobs/${id}/apply`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Loading job...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">{job.title}</h1>
          <p className="text-slate-400">{job.company}</p>
        </header>

        <section className="text-sm text-slate-300 space-y-2">
          <p>
            📍 {job.location} ({job.locationType})
          </p>
          <p>💼 {job.jobType}</p>
          {job.stipend && <p>💰 Stipend: ₹{job.stipend}</p>}
          {job.ctc && <p>💰 CTC: ₹{job.ctc} LPA</p>}
          <p>⏳ Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-slate-300 text-sm">{job.description}</p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Requirements</h2>
          <ul className="list-disc ml-5 text-sm text-slate-300">
            {job.requirements.skills.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        {/* BOOKMARK BUTTON */}

        <BookmarkButton
          jobId={job._id}
          isBookmarked={job.userStatus?.isBookmarked}
        />

        {/* APPLY */}
        {/* {(user?.role === "student" || user?.role === "alumni") && (
          <section className="pt-4">
            {userStatus?.hasApplied ? (
              <p className="text-green-400 text-sm">
                You already applied ✔ ({userStatus.applicationStatus})
              </p>
            ) : (
              <button
                onClick={applyJob}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-sm"
              >
                Apply Now
              </button>
            )}
          </section>
        )} */}

        {/* APPLY */}
        {["student", "alumni"].includes(user?.role) && (
          <section className="pt-4">
            {userStatus?.hasApplied ? (
              <button
                disabled
                className="px-4 py-2 bg-slate-700 text-slate-400 rounded text-sm cursor-not-allowed"
              >
                Already Applied
              </button>
            ) : (
              <button
                onClick={applyJob}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-sm"
              >
                Apply Now
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;

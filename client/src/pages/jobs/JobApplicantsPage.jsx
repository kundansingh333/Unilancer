

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/client";
import { toast } from "react-hot-toast";

const STATUS_OPTIONS = ["applied", "shortlisted", "rejected", "accepted"];

const JobApplicantsPage = () => {
  const { id } = useParams(); // jobId
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/jobs/${id}/applicants`, {
        params: statusFilter ? { status: statusFilter } : {},
      });

      setApplicants(res.data.applicants);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id, statusFilter]);

  const updateStatus = async (applicantId, status) => {
    try {
      await api.put(`/jobs/${id}/applicants/${applicantId}`, { status });
      toast.success(`Applicant ${status}`);
      fetchApplicants(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Job Applicants</h1>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 px-3 py-2 rounded text-sm"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* LOADING */}
        {loading && <div className="text-slate-400">Loading applicants...</div>}

        {/* EMPTY */}
        {!loading && applicants.length === 0 && (
          <div className="text-slate-400">No applicants found</div>
        )}

        {/* TABLE */}
        {!loading && applicants.length > 0 && (
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Branch</th>
                  <th className="px-4 py-3 text-left">Resume</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {applicants.map((app) => (
                  <tr
                    key={app.userId._id}
                    className="border-t border-slate-800"
                  >
                    {/* STUDENT */}
                    <td className="px-4 py-3">
                      <div className="font-medium">{app.userId.name}</div>
                      <div className="text-xs text-slate-400">
                        {app.userId.email}
                      </div>
                    </td>

                    {/* BRANCH */}
                    <td className="px-4 py-3">{app.userId.branch || "-"}</td>

                    {/* RESUME */}
                    <td className="px-4 py-3">
                      {app.resume ? (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3 capitalize">{app.status}</td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 space-x-2">
                      {app.status !== "shortlisted" && (
                        <button
                          onClick={() =>
                            updateStatus(app.userId._id, "shortlisted")
                          }
                          className="px-3 py-1 text-xs bg-blue-600 rounded hover:bg-blue-500"
                        >
                          Shortlist
                        </button>
                      )}

                      {app.status !== "accepted" && (
                        <button
                          onClick={() =>
                            updateStatus(app.userId._id, "accepted")
                          }
                          className="px-3 py-1 text-xs bg-emerald-600 rounded hover:bg-emerald-500"
                        >
                          Accept
                        </button>
                      )}

                      {app.status !== "rejected" && (
                        <button
                          onClick={() =>
                            updateStatus(app.userId._id, "rejected")
                          }
                          className="px-3 py-1 text-xs bg-rose-600 rounded hover:bg-rose-500"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicantsPage;

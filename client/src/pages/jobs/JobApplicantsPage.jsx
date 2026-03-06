import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/client";
import { toast } from "react-hot-toast";

const STATUS_OPTIONS = ["applied", "shortlisted", "rejected", "accepted"];

const statusColors = {
  applied: "bg-slate-700 text-slate-300",
  shortlisted: "bg-blue-600/20 text-blue-400",
  accepted: "bg-emerald-600/20 text-emerald-400",
  rejected: "bg-red-600/20 text-red-400",
};

const JobApplicantsPage = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    applicantId: null,
    applicantName: "",
    newStatus: "",
    note: "",
  });

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

  const openModal = (applicantId, applicantName, newStatus) => {
    setModal({
      open: true,
      applicantId,
      applicantName,
      newStatus,
      note: "",
    });
  };

  const closeModal = () => {
    setModal({ open: false, applicantId: null, applicantName: "", newStatus: "", note: "" });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/jobs/${id}/applicants/${modal.applicantId}`, {
        status: modal.newStatus,
        note: modal.note.trim(),
      });
      toast.success(`Applicant ${modal.newStatus} successfully`);
      closeModal();
      fetchApplicants();
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
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {loading && <div className="text-slate-400">Loading applicants...</div>}
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
                  <th className="px-4 py-3 text-left">Note</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.userId._id} className="border-t border-slate-800">
                    <td className="px-4 py-3">
                      <div className="font-medium">{app.userId.name}</div>
                      <div className="text-xs text-slate-400">{app.userId.email}</div>
                    </td>
                    <td className="px-4 py-3">{app.userId.branch || "-"}</td>
                    <td className="px-4 py-3">
                      {app.resume ? (
                        <a href={app.resume} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                          View Resume
                        </a>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`capitalize text-xs px-2 py-1 rounded-full font-medium ${statusColors[app.status] || ""}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {app.note ? (
                        <p className="text-xs text-slate-300 italic line-clamp-2">"{app.note}"</p>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {app.status !== "shortlisted" && (
                        <button
                          onClick={() => openModal(app.userId._id, app.userId.name, "shortlisted")}
                          className="px-3 py-1 text-xs bg-blue-600 rounded hover:bg-blue-500 transition-colors"
                        >
                          Shortlist
                        </button>
                      )}
                      {app.status !== "accepted" && (
                        <button
                          onClick={() => openModal(app.userId._id, app.userId.name, "accepted")}
                          className="px-3 py-1 text-xs bg-emerald-600 rounded hover:bg-emerald-500 transition-colors"
                        >
                          Accept
                        </button>
                      )}
                      {app.status !== "rejected" && (
                        <button
                          onClick={() => openModal(app.userId._id, app.userId.name, "rejected")}
                          className="px-3 py-1 text-xs bg-rose-600 rounded hover:bg-rose-500 transition-colors"
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

      {/* MODAL POPUP */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                {modal.newStatus === "accepted" && "✅ Accept Applicant"}
                {modal.newStatus === "rejected" && "❌ Reject Applicant"}
                {modal.newStatus === "shortlisted" && "📋 Shortlist Applicant"}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                You are marking <span className="text-white font-medium">{modal.applicantName}</span> as{" "}
                <span className={`font-semibold capitalize ${
                  modal.newStatus === "accepted" ? "text-emerald-400"
                  : modal.newStatus === "rejected" ? "text-red-400"
                  : "text-blue-400"
                }`}>{modal.newStatus}</span>.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Add a note (visible to the applicant)
              </label>
              <textarea
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                placeholder={
                  modal.newStatus === "accepted"
                    ? "e.g. Congratulations! Please join on Monday at 10 AM..."
                    : modal.newStatus === "rejected"
                    ? "e.g. Unfortunately, we've moved forward with other candidates..."
                    : "e.g. You've been shortlisted for the next round. We'll contact you soon..."
                }
                value={modal.note}
                onChange={(e) => setModal((prev) => ({ ...prev, note: e.target.value }))}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors ${
                  modal.newStatus === "accepted"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : modal.newStatus === "rejected"
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                Confirm {modal.newStatus}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicantsPage;

// src/pages/gigs/MyGigsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import useAuthStore from "../../store/authStore";

const MyGigsPage = () => {
  const { user } = useAuthStore();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [editGig, setEditGig] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const navigate = useNavigate();

  // Load my gigs
  useEffect(() => {
    const fetchMyGigs = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/gigs/my/gigs");
        setGigs(res.data.gigs || res.data || []);
      } catch (err) {
        console.error("Failed to load gigs:", err);
        const message =
          err?.response?.data?.error || "Failed to load your gigs.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGigs();
  }, []);

  const handleOpenEdit = (gig) => {
    setEditGig(gig);
    setEditForm({
      title: gig.title || "",
      price: gig.price || "",
      deliveryTime: gig.deliveryTime || "",
      pricingModel: gig.pricingModel || "fixed",
      isActive: gig.isActive ?? true,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editGig || !editForm) return;

    try {
      setActionLoadingId(editGig._id);
      setError("");

      const payload = {
        title: editForm.title,
        price: Number(editForm.price),
        deliveryTime: Number(editForm.deliveryTime),
        pricingModel: editForm.pricingModel,
        isActive: editForm.isActive,
      };

      const res = await api.put(`/gigs/${editGig._id}`, payload);

      // Update UI with updated gig from backend
      setGigs((prev) =>
        prev.map((g) => (g._id === editGig._id ? res.data.gig || res.data : g))
      );

      setEditGig(null);
      setEditForm(null);
    } catch (err) {
      console.error("Update gig failed:", err);
      const message =
        err?.response?.data?.error ||
        "Failed to update gig. Please check your fields.";
      setError(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditGig(null);
    setEditForm(null);
  };

  const handleToggleStatus = async (gig) => {
    const nextPaused = !gig.isPaused;

    let pausedReason = "";
    if (nextPaused) {
      pausedReason =
        window.prompt("Reason for pausing this gig? (optional)") || "";
    }

    try {
      setActionLoadingId(gig._id);
      setError("");

      const payload = {
        isPaused: nextPaused,
        pausedReason,
      };

      const res = await api.put(`/gigs/${gig._id}/status`, payload);

      setGigs((prev) =>
        prev.map((g) =>
          g._id === gig._id ? res.data.gig || { ...g, ...res.data } : g
        )
      );
    } catch (err) {
      console.error("Toggle status failed:", err);
      const message =
        err?.response?.data?.error ||
        "Failed to update gig status. Please try again.";
      setError(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteGig = async (gig) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${gig.title}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      setActionLoadingId(gig._id);
      setError("");
      await api.delete(`/gigs/${gig._id}`);

      setGigs((prev) => prev.filter((g) => g._id !== gig._id));
    } catch (err) {
      console.error("Delete gig failed:", err);
      const message =
        err?.response?.data?.error || "Failed to delete gig. Please try again.";
      setError(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!user) {
    // Safety fallback: should be behind ProtectedRoute
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-300 text-sm">
          Please login to manage your gigs.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">My gigs</h1>
            <p className="text-sm text-slate-400">
              Create, edit, pause, or delete your Unilancer gigs.
            </p>
          </div>
          <button
            onClick={() => navigate("/gigs/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-medium text-white"
          >
            + Create new gig
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-slate-400 text-sm">Loading your gigs...</div>
        ) : gigs.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">
            You don&apos;t have any gigs yet.
            <button
              onClick={() => navigate("/gigs/create")}
              className="ml-2 text-blue-400 hover:text-blue-300 underline"
            >
              Create your first gig.
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {gigs.map((gig) => {
              const isBusy = actionLoadingId === gig._id;
              return (
                <div
                  key={gig._id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <h2 className="text-sm font-medium text-slate-50 truncate">
                      {gig.title}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {gig.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                        ₹{gig.price} / {gig.deliveryTime} days
                      </span>
                      {gig.category && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                          {gig.category}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full border ${
                          gig.isPaused
                            ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                            : gig.isActive
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                            : "bg-slate-700/40 border-slate-600 text-slate-200"
                        }`}
                      >
                        {gig.isPaused
                          ? "Paused"
                          : gig.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                      {gig.isApproved ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                          Pending approval
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    <button
                      disabled={isBusy}
                      onClick={() => handleOpenEdit(gig)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-60"
                    >
                      Edit
                    </button>

                    <button
                      disabled={isBusy}
                      onClick={() => handleToggleStatus(gig)}
                      className={`text-xs px-3 py-1.5 rounded-lg border disabled:opacity-60 ${
                        gig.isPaused
                          ? "bg-emerald-600/90 hover:bg-emerald-500 border-emerald-500 text-white"
                          : "bg-amber-600/90 hover:bg-amber-500 border-amber-500 text-white"
                      }`}
                    >
                      {gig.isPaused ? "Resume" : "Pause"}
                    </button>

                    <button
                      disabled={isBusy}
                      onClick={() => handleDeleteGig(gig)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* EDIT MODAL */}
        {editGig && editForm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-50 mb-4">
                Edit gig
              </h2>

              <form onSubmit={handleSaveEdit} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Price (₹)
                    </label>
                    <input
                      name="price"
                      type="number"
                      min="100"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Delivery time (days)
                    </label>
                    <input
                      name="deliveryTime"
                      type="number"
                      min="1"
                      max="90"
                      value={editForm.deliveryTime}
                      onChange={handleEditChange}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Pricing model
                    </label>
                    <select
                      name="pricingModel"
                      value={editForm.pricingModel}
                      onChange={handleEditChange}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="hourly">Hourly</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-300 mt-5 sm:mt-6">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={!!editForm.isActive}
                      onChange={handleEditChange}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-950"
                    />
                    Active (visible to clients)
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoadingId === editGig._id}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs text-white disabled:opacity-60"
                  >
                    {actionLoadingId === editGig._id
                      ? "Saving..."
                      : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigsPage;

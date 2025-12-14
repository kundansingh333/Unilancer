// src/pages/orders/CreateOrderPage.jsx
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import api from "../../api/client";
import useAuthStore from "../../store/authStore";

const packageTypes = ["Basic", "Standard", "Premium", "Custom"];
const paymentMethods = ["UPI", "Bank Transfer", "PayPal", "Cash"];

const CreateOrderPage = () => {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [loadingGig, setLoadingGig] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    packageType: "Custom",
    description: "",
    requirements: "",
    paymentMethod: "UPI",
    transactionId: "",
  });

  // Get gigId from URL or router state
  const gigIdFromQuery = searchParams.get("gigId");
  const gigIdFromState = location.state?.gigId;
  const gigId = gigIdFromQuery || gigIdFromState;

  useEffect(() => {
    if (!gigId) {
      setError("No gig selected. Please open a gig and click 'Create order'.");
      setLoadingGig(false);
      return;
    }

    const fetchGig = async () => {
      try {
        setLoadingGig(true);
        setError("");
        const res = await api.get(`/gigs/${gigId}`);
        setGig(res.data.gig || res.data);
      } catch (err) {
        console.error("Failed to load gig:", err);
        const message =
          err?.response?.data?.error || "Failed to load gig details.";
        setError(message);
      } finally {
        setLoadingGig(false);
      }
    };

    fetchGig();
  }, [gigId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-300 text-sm">
          Please{" "}
          <Link to="/login" className="text-blue-400 underline">
            login
          </Link>{" "}
          to create an order.
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gigId) return;

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        gigId,
        packageType: form.packageType,
        description: form.description,
        requirements: form.requirements,
        paymentMethod: form.paymentMethod,
        transactionId: form.transactionId || undefined,
      };

      const res = await api.post("/orders", payload);

      const createdOrder = res.data.order || res.data;
      if (!createdOrder?._id) {
        throw new Error("Order created but ID not returned.");
      }

      navigate(`/orders/${createdOrder._id}`);
    } catch (err) {
      console.error("Create order failed:", err);
      const message =
        err?.response?.data?.error ||
        err.message ||
        "Failed to create order. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Create order</h1>
            <p className="text-sm text-slate-400">
              Confirm details before placing your order with the freelancer.
            </p>
          </div>
          {gig && (
            <Link
              to={`/gigs/${gig._id}`}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              ← Back to gig
            </Link>
          )}
        </header>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {loadingGig ? (
          <div className="text-slate-400 text-sm">Loading gig details...</div>
        ) : !gig ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">
            Unable to load gig. Please go back and try again.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: FORM */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <div>
                <p className="text-xs text-slate-400 mb-1">Gig</p>
                <p className="text-sm font-medium text-slate-50">{gig.title}</p>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {gig.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Package type
                  </label>
                  <select
                    name="packageType"
                    value={form.packageType}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {packageTypes.map((pkg) => (
                      <option key={pkg} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Payment method
                  </label>
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentMethods.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-sm">
                <label className="block text-xs text-slate-400 mb-1">
                  Work description for this order
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain what exactly you want the freelancer to deliver for this order."
                  required
                />
              </div>

              <div className="text-sm">
                <label className="block text-xs text-slate-400 mb-1">
                  Requirements / notes for freelancer
                </label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share access links, references, assets, or any special instructions."
                />
              </div>

              <div className="text-sm">
                <label className="block text-xs text-slate-400 mb-1">
                  Transaction / payment reference (optional)
                </label>
                <input
                  name="transactionId"
                  value={form.transactionId}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="UPI ref no / bank txn id / PayPal id"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 text-sm">
                <button
                  type="button"
                  onClick={() =>
                    gig ? navigate(`/gigs/${gig._id}`) : navigate(-1)
                  }
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60"
                >
                  {submitting ? "Placing order..." : "Place order"}
                </button>
              </div>
            </form>

            {/* RIGHT: GIG SUMMARY CARD */}
            <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs space-y-3">
              <h2 className="text-sm font-medium text-slate-200 mb-1">
                Gig summary
              </h2>
              <p className="text-slate-300">{gig.title}</p>
              <p className="text-slate-400">
                Category: <span className="text-slate-200">{gig.category}</span>
              </p>
              <p className="text-slate-400">
                Price:{" "}
                <span className="text-slate-200">
                  ₹{gig.price} • {gig.deliveryTime} days
                </span>
              </p>
              <p className="text-slate-400">
                Rating:{" "}
                <span className="text-slate-200">
                  {gig.averageRating ?? "—"} ({gig.totalReviews || 0} reviews)
                </span>
              </p>
              <p className="text-slate-500">
                The exact payment and delivery timeline will be visible in the
                order once created.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOrderPage;

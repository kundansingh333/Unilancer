import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import api from "../../api/client";
import useAuthStore from "../../store/authStore";
import { 
  Package, 
  CreditCard, 
  AlignLeft, 
  FileText, 
  Hash, 
  ChevronLeft, 
  Star, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import SEO from "../../components/SEO";

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
        const message = err?.response?.data?.error || "Failed to load gig details.";
        setError(message);
      } finally {
        setLoadingGig(false);
      }
    };

    fetchGig();
    window.scrollTo(0, 0);
  }, [gigId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Package className="w-16 h-16 text-indigo-500/50 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
        <div className="text-slate-400 text-sm">
          Please{" "}
          <Link to="/login" className="text-indigo-400 font-medium hover:underline">
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
      const message = err?.response?.data?.error || err.message || "Failed to create order. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="Create Order" path="/orders/create" noIndex />

      {/* HEADER BANNER */}
      <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <button onClick={() => gig ? navigate(`/gigs/${gig._id}`) : navigate(-1)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4 w-fit">
            <ChevronLeft className="w-4 h-4" /> Back to Gig
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Create Order
              </h1>
              <p className="text-sm text-slate-400">
                Confirm details and place your order with the freelancer.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loadingGig ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading gig details...
          </div>
        ) : !gig ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Gig Not Found</h3>
            <p className="text-slate-400 mb-6">Unable to load gig details. It may have been deleted or removed.</p>
            <button onClick={() => navigate('/gigs')} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors">
              Browse Gigs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: FORM */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Order Configuration</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Package className="w-4 h-4" /> Package Type
                    </label>
                    <select
                      name="packageType"
                      value={form.packageType}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
                    >
                      {packageTypes.map((pkg) => (
                        <option key={pkg} value={pkg}>{pkg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Payment Method
                    </label>
                    <select
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
                    >
                      {paymentMethods.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" /> Work Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none custom-scrollbar"
                    placeholder="Explain exactly what you want the freelancer to deliver for this order..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Requirements & Notes
                  </label>
                  <textarea
                    name="requirements"
                    value={form.requirements}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none custom-scrollbar"
                    placeholder="Share access links, references, assets, or special instructions..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Hash className="w-4 h-4" /> Transaction Reference <span className="text-slate-600 normal-case font-normal ml-1">(Optional)</span>
                  </label>
                  <input
                    name="transactionId"
                    value={form.transactionId}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="UPI ref no / bank txn id / PayPal id"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => gig ? navigate(`/gigs/${gig._id}`) : navigate(-1)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
                  ) : "Place Order"}
                </button>
              </div>
            </form>

            {/* RIGHT: GIG SUMMARY CARD */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/10 to-slate-900/60 p-6 overflow-hidden relative">
                
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-indigo-500/20 pb-2">
                  Gig Summary
                </h2>
                
                <div className="space-y-4 relative z-10">
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug mb-1">{gig.title}</h3>
                    <span className="inline-block px-2.5 py-1 rounded-md bg-slate-950/50 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {gig.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 py-3 border-y border-slate-800/50">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Price</p>
                      <p className="text-lg font-bold text-emerald-400">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(gig.price)}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-slate-800"></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Delivery</p>
                      <p className="text-sm font-bold text-slate-200 flex items-center gap-1.5 mt-1">
                        <Clock className="w-4 h-4 text-indigo-400" /> {gig.deliveryTime} Days
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Freelancer Rating</p>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-white">{gig.averageRating ?? "New"}</span>
                      <span className="text-xs text-slate-500">({gig.totalReviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/50">
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    The exact payment details and delivery timeline will be finalized once the freelancer accepts the order.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOrderPage;

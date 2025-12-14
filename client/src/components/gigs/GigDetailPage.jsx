// // src/pages/gigs/GigDetailPage.jsx
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import useAuthStore from "../../store/authStore";
// import {
//   fetchGigById,
//   addGigReview,
//   markReviewHelpful,
// } from "../../api/gigsApi";

// const GigDetailPage = () => {
//   const { id } = useParams();
//   const { user } = useAuthStore();

//   const [gig, setGig] = useState(null);
//   const [userHasOrdered, setUserHasOrdered] = useState(false);
//   const [canReview, setCanReview] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [reviewForm, setReviewForm] = useState({
//     rating: 5,
//     comment: "",
//   });
//   const [reviewError, setReviewError] = useState("");
//   const [reviewLoading, setReviewLoading] = useState(false);

//   const loadGig = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetchGigById(id);
//       if (!res.data?.success) {
//         throw new Error(res.data?.error || "Failed to load gig");
//       }
//       setGig(res.data.gig);
//       setUserHasOrdered(res.data.userHasOrdered);
//       setCanReview(res.data.canReview);
//     } catch (err) {
//       console.error("Gig detail error:", err);
//       setError(
//         err?.response?.data?.error || err.message || "Failed to load gig"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadGig();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const handleReviewChange = (e) => {
//     const { name, value } = e.target;
//     setReviewForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmitReview = async (e) => {
//     e.preventDefault();
//     setReviewLoading(true);
//     setReviewError("");

//     try {
//       const payload = {
//         rating: Number(reviewForm.rating),
//         comment: reviewForm.comment,
//       };
//       const res = await addGigReview(id, payload);

//       if (!res.data?.success) {
//         throw new Error(res.data?.error || "Failed to add review");
//       }

//       setReviewForm({ rating: 5, comment: "" });
//       await loadGig();
//     } catch (err) {
//       console.error("Add review error:", err);
//       const msg =
//         err?.response?.data?.error ||
//         (err.message?.includes("Rating must be between")
//           ? "Rating must be between 1 and 5."
//           : err.message) ||
//         "Failed to add review";
//       setReviewError(msg);
//     } finally {
//       setReviewLoading(false);
//     }
//   };

//   const handleMarkHelpful = async (reviewId) => {
//     try {
//       const res = await markReviewHelpful(id, reviewId);
//       if (!res.data?.success) return;
//       // optimistic small update: just reload reviews
//       await loadGig();
//     } catch (err) {
//       console.error("Mark helpful error:", err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
//         Loading gig...
//       </div>
//     );
//   }

//   if (error || !gig) {
//     return (
//       <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
//         <p className="text-sm text-red-300">{error || "Gig not found"}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <div className="max-w-5xl mx-auto px-4 py-6 grid lg:grid-cols-[2fr,1fr] gap-6">
//         {/* LEFT: Main content */}
//         <div>
//           <div className="flex items-center justify-between gap-3 mb-2">
//             <span className="px-2 py-1 rounded-full bg-slate-900 text-[11px] text-slate-300 border border-slate-700">
//               {gig.category?.replace(/-/g, " ")}
//             </span>
//             {gig.averageRating > 0 && (
//               <div className="text-xs text-amber-300 flex items-center gap-1">
//                 <span>★ {Number(gig.averageRating).toFixed(1)}</span>
//                 <span className="text-slate-500">
//                   ({gig.totalReviews || 0} reviews)
//                 </span>
//               </div>
//             )}
//           </div>

//           <h1 className="text-xl sm:text-2xl font-semibold text-slate-50 mb-2">
//             {gig.title}
//           </h1>

//           {/* Creator */}
//           <div className="flex items-center gap-3 mb-4">
//             <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center text-sm font-semibold text-slate-100">
//               {gig.createdBy?.profilePicture ? (
//                 <img
//                   src={gig.createdBy.profilePicture}
//                   alt={gig.createdBy.name}
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 (gig.createdBy?.name?.[0] || "U").toUpperCase()
//               )}
//             </div>
//             <div className="text-xs">
//               <p className="text-slate-200">{gig.createdBy?.name}</p>
//               <p className="text-slate-500">
//                 {gig.createdBy?.role === "alumni"
//                   ? `${gig.createdBy.jobTitle || "Alumni"} @ ${
//                       gig.createdBy.company || "Company"
//                     }`
//                   : gig.createdBy?.role === "student"
//                   ? `${gig.createdBy.year || ""} yr · ${
//                       gig.createdBy.branch || ""
//                     }`
//                   : gig.createdBy?.role || "Freelancer"}
//               </p>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="mb-4">
//             <h2 className="text-sm font-semibold text-slate-200 mb-1">
//               About this gig
//             </h2>
//             <p className="text-sm text-slate-300 whitespace-pre-line">
//               {gig.description}
//             </p>
//           </div>

//           {/* Tech, requirements, deliverables */}
//           <div className="grid sm:grid-cols-3 gap-4 text-xs">
//             <div>
//               <h3 className="font-semibold text-slate-200 mb-1">Tech Stack</h3>
//               {gig.techStack?.length ? (
//                 <ul className="space-y-1">
//                   {gig.techStack.map((t) => (
//                     <li
//                       key={t}
//                       className="px-2 py-[2px] rounded-full bg-slate-900 text-slate-300 inline-block mr-1 mb-1"
//                     >
//                       {t}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-slate-500">Not specified</p>
//               )}
//             </div>

//             <div>
//               <h3 className="font-semibold text-slate-200 mb-1">
//                 Requirements
//               </h3>
//               {gig.requirements?.length ? (
//                 <ul className="list-disc list-inside text-slate-300 space-y-1">
//                   {gig.requirements.map((r, i) => (
//                     <li key={i}>{r}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-slate-500">Not specified</p>
//               )}
//             </div>

//             <div>
//               <h3 className="font-semibold text-slate-200 mb-1">
//                 Deliverables
//               </h3>
//               {gig.deliverables?.length ? (
//                 <ul className="list-disc list-inside text-slate-300 space-y-1">
//                   {gig.deliverables.map((d, i) => (
//                     <li key={i}>{d}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-slate-500">Not specified</p>
//               )}
//             </div>
//           </div>

//           {/* Tags */}
//           {gig.tags?.length > 0 && (
//             <div className="mt-4">
//               <h3 className="text-xs font-semibold text-slate-200 mb-1">
//                 Tags
//               </h3>
//               <div className="flex flex-wrap gap-1">
//                 {gig.tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="px-2 py-[2px] rounded-full bg-slate-900 text-[11px] text-slate-300"
//                   >
//                     #{tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Reviews */}
//           <div className="mt-6">
//             <h2 className="text-sm font-semibold text-slate-200 mb-2">
//               Reviews
//             </h2>

//             {!gig.reviews?.length && (
//               <p className="text-xs text-slate-500">
//                 No reviews yet. Be the first to review after ordering!
//               </p>
//             )}

//             {gig.reviews?.length > 0 && (
//               <div className="space-y-3">
//                 {gig.reviews.map((r) => (
//                   <div
//                     key={r._id}
//                     className="border border-slate-800 rounded-xl p-3 bg-slate-900/60 text-xs"
//                   >
//                     <div className="flex items-center justify-between mb-1">
//                       <div className="flex items-center gap-2">
//                         <div className="h-7 w-7 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-[10px] border border-slate-700">
//                           {r.reviewedBy?.profilePicture ? (
//                             <img
//                               src={r.reviewedBy.profilePicture}
//                               alt={r.reviewedBy.name}
//                               className="h-full w-full object-cover"
//                             />
//                           ) : (
//                             (r.reviewedBy?.name?.[0] || "U").toUpperCase()
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-slate-200 text-[11px]">
//                             {r.reviewedBy?.name || "User"}
//                           </p>
//                           <p className="text-amber-300 text-[10px]">
//                             ★ {r.rating}
//                           </p>
//                         </div>
//                       </div>
//                       <span className="text-[10px] text-slate-500">
//                         {new Date(r.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <p className="text-slate-300 text-xs mb-2">
//                       {r.comment || "No comment"}
//                     </p>
//                     <button
//                       onClick={() => handleMarkHelpful(r._id)}
//                       className="text-[10px] text-slate-400 hover:text-blue-300"
//                     >
//                       Helpful ({r.helpful?.length || 0})
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Review form */}
//             {user && userHasOrdered && canReview && (
//               <form
//                 onSubmit={handleSubmitReview}
//                 className="mt-4 border border-slate-800 rounded-xl p-3 bg-slate-900/70 text-xs space-y-2"
//               >
//                 <h3 className="font-semibold text-slate-200">Write a review</h3>

//                 {reviewError && (
//                   <div className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-[11px] text-red-200">
//                     {reviewError}
//                   </div>
//                 )}

//                 <div className="flex gap-2 items-center">
//                   <label className="text-slate-300 text-xs">Rating</label>
//                   <select
//                     name="rating"
//                     value={reviewForm.rating}
//                     onChange={handleReviewChange}
//                     className="input !py-1 !px-2 !text-xs w-20"
//                   >
//                     {[5, 4, 3, 2, 1].map((r) => (
//                       <option key={r} value={r}>
//                         {r} ★
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <textarea
//                   name="comment"
//                   value={reviewForm.comment}
//                   onChange={handleReviewChange}
//                   className="input min-h-[80px]"
//                   placeholder="Share your experience with this gig..."
//                 />

//                 <button
//                   type="submit"
//                   disabled={reviewLoading}
//                   className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-xs font-medium"
//                 >
//                   {reviewLoading ? "Posting..." : "Post review"}
//                 </button>
//               </form>
//             )}

//             {!user && (
//               <p className="mt-3 text-[11px] text-slate-500">
//                 Login and order this gig to leave a review.
//               </p>
//             )}
//           </div>
//         </div>

//         {/* RIGHT: Pricing box */}
//         <aside className="border border-slate-800 rounded-2xl bg-slate-900/80 p-4 h-fit">
//           <div className="flex items-baseline gap-2">
//             <span className="text-lg font-semibold text-slate-50">
//               {gig.currency === "INR" ? "₹" : "$"}
//               {gig.price?.toLocaleString("en-IN")}
//             </span>
//             <span className="text-[11px] text-slate-400">
//               {gig.pricingModel === "hourly"
//                 ? "/ hour"
//                 : gig.pricingModel === "negotiable"
//                 ? "(negotiable)"
//                 : "starting"}
//             </span>
//           </div>

//           <p className="mt-1 text-xs text-slate-400">
//             Delivery in{" "}
//             <span className="text-slate-100 font-medium">
//               {gig.deliveryTime} day{gig.deliveryTime > 1 && "s"}
//             </span>{" "}
//             · {gig.revisions || 0} revisions
//           </p>

//           {gig.paymentMethods?.length > 0 && (
//             <div className="mt-3">
//               <h3 className="text-[11px] text-slate-300 mb-1">
//                 Payment methods
//               </h3>
//               <div className="flex flex-wrap gap-1">
//                 {gig.paymentMethods.map((m) => (
//                   <span
//                     key={m}
//                     className="px-2 py-[2px] rounded-full bg-slate-800 text-[10px] text-slate-200"
//                   >
//                     {m}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {gig.upiId && (
//             <p className="mt-2 text-[11px] text-slate-400">
//               UPI: <span className="text-slate-100">{gig.upiId}</span>
//             </p>
//           )}

//           {/* Here you'd add "Order" / "Contact" buttons once orders UI is ready */}
//           <button
//             disabled
//             className="mt-4 w-full px-3 py-2 rounded-lg bg-blue-600/60 text-xs font-medium text-white cursor-not-allowed"
//           >
//             Order flow coming soon
//           </button>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default GigDetailPage;

// src/pages/gigs/GigDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import api from "../../api/client";
import {
  fetchGigById,
  addGigReview,
  markReviewHelpful,
} from "../../api/gigsApi";

const GigDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [userHasOrdered, setUserHasOrdered] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewError, setReviewError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Order modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    packageType: "Basic",
    description: "",
    requirements: "",
    paymentMethod: "UPI",
    transactionId: "",
  });
  const [orderError, setOrderError] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  const loadGig = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchGigById(id);
      if (!res.data?.success) {
        throw new Error(res.data?.error || "Failed to load gig");
      }
      setGig(res.data.gig);
      setUserHasOrdered(res.data.userHasOrdered);
      setCanReview(res.data.canReview);
    } catch (err) {
      console.error("Gig detail error:", err);
      setError(
        err?.response?.data?.error || err.message || "Failed to load gig"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError("");

    try {
      const payload = {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      };
      const res = await addGigReview(id, payload);

      if (!res.data?.success) {
        throw new Error(res.data?.error || "Failed to add review");
      }

      setReviewForm({ rating: 5, comment: "" });
      await loadGig();
    } catch (err) {
      console.error("Add review error:", err);
      const msg =
        err?.response?.data?.error ||
        (err.message?.includes("Rating must be between")
          ? "Rating must be between 1 and 5."
          : err.message) ||
        "Failed to add review";
      setReviewError(msg);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      const res = await markReviewHelpful(id, reviewId);
      if (!res.data?.success) return;
      // optimistic small update: just reload reviews
      await loadGig();
    } catch (err) {
      console.error("Mark helpful error:", err);
    }
  };

  // ------------------ ORDER FLOW ------------------

  // Open modal (only for logged in non-owner users)
  const openOrderModal = () => {
    setOrderError("");
    setOrderForm({
      packageType: "Basic",
      description: "",
      requirements: "",
      paymentMethod: "UPI",
      transactionId: "",
    });
    setOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setOrderModalOpen(false);
    setOrderLoading(false);
    setOrderError("");
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitOrder = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!orderForm.description || orderForm.description.trim().length < 10) {
      setOrderError("Please provide a description (at least 10 characters).");
      return;
    }

    setOrderLoading(true);
    setOrderError("");

    try {
      const payload = {
        gigId: gig._id,
        packageType: orderForm.packageType,
        description: orderForm.description,
        requirements: orderForm.requirements || undefined,
        paymentMethod: orderForm.paymentMethod,
        transactionId: orderForm.transactionId || undefined,
      };

      const res = await api.post("/orders", payload);

      if (!res.data?.success && !res.data?.order) {
        // If backend returns success:false, show its message
        throw new Error(res.data?.error || "Failed to create order");
      }

      // Success — close modal and navigate to order details if returned
      const createdOrder = res.data.order || res.data;

      closeOrderModal();

      if (createdOrder && createdOrder._id) {
        navigate(`/orders/${createdOrder._id}`);
      } else {
        // fallback
        navigate("/orders");
      }
    } catch (err) {
      console.error("Create order failed:", err);
      const message =
        err?.response?.data?.error ||
        err.message ||
        "Failed to create order. Try again.";
      setOrderError(message);
    } finally {
      setOrderLoading(false);
    }
  };

  // ------------------ RENDER ------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        Loading gig...
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <p className="text-sm text-red-300">{error || "Gig not found"}</p>
      </div>
    );
  }

  const isOwner = user && gig.createdBy && user._id === gig.createdBy._id;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6 grid lg:grid-cols-[2fr,1fr] gap-6">
        {/* LEFT: Main content */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="px-2 py-1 rounded-full bg-slate-900 text-[11px] text-slate-300 border border-slate-700">
              {gig.category?.replace(/-/g, " ")}
            </span>
            {gig.averageRating > 0 && (
              <div className="text-xs text-amber-300 flex items-center gap-1">
                <span>★ {Number(gig.averageRating).toFixed(1)}</span>
                <span className="text-slate-500">
                  ({gig.totalReviews || 0} reviews)
                </span>
              </div>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-slate-50 mb-2">
            {gig.title}
          </h1>

          {/* Creator */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center text-sm font-semibold text-slate-100">
              {gig.createdBy?.profilePicture ? (
                <img
                  src={gig.createdBy.profilePicture}
                  alt={gig.createdBy.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                (gig.createdBy?.name?.[0] || "U").toUpperCase()
              )}
            </div>
            <div className="text-xs">
              <p className="text-slate-200">{gig.createdBy?.name}</p>
              <p className="text-slate-500">
                {gig.createdBy?.role === "alumni"
                  ? `${gig.createdBy.jobTitle || "Alumni"} @ ${
                      gig.createdBy.company || "Company"
                    }`
                  : gig.createdBy?.role === "student"
                  ? `${gig.createdBy.year || ""} yr · ${
                      gig.createdBy.branch || ""
                    }`
                  : gig.createdBy?.role || "Freelancer"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-1">
              About this gig
            </h2>
            <p className="text-sm text-slate-300 whitespace-pre-line">
              {gig.description}
            </p>
          </div>

          {/* Tech, requirements, deliverables */}
          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div>
              <h3 className="font-semibold text-slate-200 mb-1">Tech Stack</h3>
              {gig.techStack?.length ? (
                <ul className="space-y-1">
                  {gig.techStack.map((t) => (
                    <li
                      key={t}
                      className="px-2 py-[2px] rounded-full bg-slate-900 text-slate-300 inline-block mr-1 mb-1"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">Not specified</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-slate-200 mb-1">
                Requirements
              </h3>
              {gig.requirements?.length ? (
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {gig.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">Not specified</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-slate-200 mb-1">
                Deliverables
              </h3>
              {gig.deliverables?.length ? (
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {gig.deliverables.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">Not specified</p>
              )}
            </div>
          </div>

          {/* Tags */}
          {gig.tags?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-200 mb-1">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1">
                {gig.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-[2px] rounded-full bg-slate-900 text-[11px] text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">
              Reviews
            </h2>

            {!gig.reviews?.length && (
              <p className="text-xs text-slate-500">
                No reviews yet. Be the first to review after ordering!
              </p>
            )}

            {gig.reviews?.length > 0 && (
              <div className="space-y-3">
                {gig.reviews.map((r) => (
                  <div
                    key={r._id}
                    className="border border-slate-800 rounded-xl p-3 bg-slate-900/60 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-[10px] border border-slate-700">
                          {r.reviewedBy?.profilePicture ? (
                            <img
                              src={r.reviewedBy.profilePicture}
                              alt={r.reviewedBy.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (r.reviewedBy?.name?.[0] || "U").toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-slate-200 text-[11px]">
                            {r.reviewedBy?.name || "User"}
                          </p>
                          <p className="text-amber-300 text-[10px]">
                            ★ {r.rating}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mb-2">
                      {r.comment || "No comment"}
                    </p>
                    <button
                      onClick={() => handleMarkHelpful(r._id)}
                      className="text-[10px] text-slate-400 hover:text-blue-300"
                    >
                      Helpful ({r.helpful?.length || 0})
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Review form */}
            {user && userHasOrdered && canReview && (
              <form
                onSubmit={handleSubmitReview}
                className="mt-4 border border-slate-800 rounded-xl p-3 bg-slate-900/70 text-xs space-y-2"
              >
                <h3 className="font-semibold text-slate-200">Write a review</h3>

                {reviewError && (
                  <div className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-[11px] text-red-200">
                    {reviewError}
                  </div>
                )}

                <div className="flex gap-2 items-center">
                  <label className="text-slate-300 text-xs">Rating</label>
                  <select
                    name="rating"
                    value={reviewForm.rating}
                    onChange={handleReviewChange}
                    className="input !py-1 !px-2 !text-xs w-20"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} ★
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  className="input min-h-[80px]"
                  placeholder="Share your experience with this gig..."
                />

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-xs font-medium"
                >
                  {reviewLoading ? "Posting..." : "Post review"}
                </button>
              </form>
            )}

            {!user && (
              <p className="mt-3 text-[11px] text-slate-500">
                Login and order this gig to leave a review.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: Pricing box */}
        <aside className="border border-slate-800 rounded-2xl bg-slate-900/80 p-4 h-fit">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-slate-50">
              {gig.currency === "INR" ? "₹" : "$"}
              {gig.price?.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-slate-400">
              {gig.pricingModel === "hourly"
                ? "/ hour"
                : gig.pricingModel === "negotiable"
                ? "(negotiable)"
                : "starting"}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Delivery in{" "}
            <span className="text-slate-100 font-medium">
              {gig.deliveryTime} day{gig.deliveryTime > 1 && "s"}
            </span>{" "}
            · {gig.revisions || 0} revisions
          </p>

          {gig.paymentMethods?.length > 0 && (
            <div className="mt-3">
              <h3 className="text-[11px] text-slate-300 mb-1">
                Payment methods
              </h3>
              <div className="flex flex-wrap gap-1">
                {gig.paymentMethods.map((m) => (
                  <span
                    key={m}
                    className="px-2 py-[2px] rounded-full bg-slate-800 text-[10px] text-slate-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {gig.upiId && (
            <p className="mt-2 text-[11px] text-slate-400">
              UPI: <span className="text-slate-100">{gig.upiId}</span>
            </p>
          )}

          {/* ORDER CTA */}
          <div className="mt-4">
            {!user ? (
              <button
                onClick={() =>
                  navigate("/login", { state: { from: `/gigs/${id}` } })
                }
                className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white"
              >
                Login to order
              </button>
            ) : isOwner ? (
              <div className="text-xs text-slate-400">
                You are the owner of this gig.
              </div>
            ) : (
              <button
                onClick={openOrderModal}
                className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white"
              >
                Order this gig
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* ---------- ORDER MODAL ---------- */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 text-sm text-slate-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create order</h3>
              <button
                onClick={closeOrderModal}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={submitOrder} className="space-y-3">
              {orderError && (
                <div className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {orderError}
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Package
                </label>
                <select
                  name="packageType"
                  value={orderForm.packageType}
                  onChange={handleOrderChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
                >
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Description (brief of work / expectations)
                </label>
                <textarea
                  name="description"
                  value={orderForm.description}
                  onChange={handleOrderChange}
                  placeholder="Describe what you need (at least 10 characters)"
                  className="w-full min-h-[100px] rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Requirements (optional)
                </label>
                <input
                  name="requirements"
                  value={orderForm.requirements}
                  onChange={handleOrderChange}
                  placeholder="Files / links / notes"
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Payment method
                </label>
                <select
                  name="paymentMethod"
                  value={orderForm.paymentMethod}
                  onChange={handleOrderChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Transaction ID (optional)
                </label>
                <input
                  name="transactionId"
                  value={orderForm.transactionId}
                  onChange={handleOrderChange}
                  placeholder="If you already paid, paste txn id"
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeOrderModal}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={orderLoading}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs text-white disabled:opacity-60"
                >
                  {orderLoading ? "Placing order..." : "Place order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigDetailPage;

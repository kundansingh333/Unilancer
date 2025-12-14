// src/components/gigs/GigForm.jsx
import { useState } from "react";
import { createGig, updateGig } from "../../api/gigsApi";

const CATEGORIES = [
  "web-development",
  "mobile-app",
  "data-science",
  "ui-ux-design",
  "graphic-design",
  "content-writing",
  "video-editing",
  "digital-marketing",
  "tutoring",
  "data-entry",
  "translation",
  "other",
];

const PRICING_MODELS = ["fixed", "hourly", "negotiable"];

const PAYMENT_METHODS = ["UPI", "Bank Transfer", "PayPal", "Cash"];

const GigForm = ({
  mode = "create",
  initialData = {},
  onSuccess,
  onCancel,
}) => {
  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    category: initialData.category || "web-development",
    subCategory: initialData.subCategory || "",
    pricingModel: initialData.pricingModel || "fixed",
    price: initialData.price || "",
    currency: initialData.currency || "INR",
    deliveryTime: initialData.deliveryTime || "",
    revisions: initialData.revisions ?? 1,
    techStack: (initialData.techStack || []).join(", "),
    requirements: (initialData.requirements || []).join("\n"),
    deliverables: (initialData.deliverables || []).join("\n"),
    paymentMethods: initialData.paymentMethods || [],
    upiId: initialData.upiId || "",
    videoUrl: initialData.videoUrl || "",
    tags: (initialData.tags || []).join(", "),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (method) => {
    setForm((prev) => {
      const current = new Set(prev.paymentMethods || []);
      if (current.has(method)) current.delete(method);
      else current.add(method);
      return { ...prev, paymentMethods: Array.from(current) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        subCategory: form.subCategory || undefined,
        pricingModel: form.pricingModel,
        price: Number(form.price),
        currency: form.currency,
        deliveryTime: Number(form.deliveryTime),
        revisions: Number(form.revisions) || 0,
        techStack: form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        requirements: form.requirements
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
        deliverables: form.deliverables
          .split("\n")
          .map((d) => d.trim())
          .filter(Boolean),
        paymentMethods: form.paymentMethods,
        upiId: form.upiId || undefined,
        videoUrl: form.videoUrl || undefined,
        tags: form.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      };

      let res;
      if (mode === "edit" && initialData?._id) {
        res = await updateGig(initialData._id, payload);
      } else {
        res = await createGig(payload);
      }

      if (!res.data?.success) {
        throw new Error(res.data?.error || "Failed to save gig");
      }

      onSuccess?.(res.data.gig || null, res.data);
    } catch (err) {
      console.error("Gig form submit error:", err);
      setError(
        err?.response?.data?.error || err.message || "Failed to save gig"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-50">
          {mode === "edit" ? "Edit Gig" : "Create New Gig"}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* Title & category */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="label">Gig Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="input"
            placeholder="I will build a full-stack MERN website for your startup"
          />
        </div>
        <div>
          <label className="label">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace(/-/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="input min-h-[120px]"
          placeholder="Describe your service, process, and what the buyer will receive..."
        />
        <p className="text-[11px] text-slate-500 mt-1">
          Min 50 characters, max 3000 characters as per backend validation.
        </p>
      </div>

      {/* Pricing & delivery */}
      <div className="grid sm:grid-cols-4 gap-3">
        <div>
          <label className="label">Pricing Model</label>
          <select
            name="pricingModel"
            value={form.pricingModel}
            onChange={handleChange}
            className="input"
          >
            {PRICING_MODELS.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Price</label>
          <input
            name="price"
            type="number"
            min={100}
            value={form.price}
            onChange={handleChange}
            required
            className="input"
            placeholder="1000"
          />
        </div>
        <div>
          <label className="label">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="input"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
        <div>
          <label className="label">Delivery Time (days)</label>
          <input
            name="deliveryTime"
            type="number"
            min={1}
            max={90}
            value={form.deliveryTime}
            onChange={handleChange}
            required
            className="input"
            placeholder="7"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Sub Category (optional)</label>
          <input
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            className="input"
            placeholder="Landing pages, React, Next.js, etc."
          />
        </div>
        <div>
          <label className="label">Revisions</label>
          <input
            name="revisions"
            type="number"
            min={0}
            max={10}
            value={form.revisions}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="label">Tech Stack (comma separated)</label>
          <input
            name="techStack"
            value={form.techStack}
            onChange={handleChange}
            className="input"
            placeholder="React, Node.js, MongoDB"
          />
        </div>
      </div>

      {/* Requirements & deliverables */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Requirements from client</label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={3}
            className="input min-h-[90px]"
            placeholder={"Website brief\nBrand guidelines\nLogos & assets"}
          />
        </div>
        <div>
          <label className="label">Deliverables</label>
          <textarea
            name="deliverables"
            value={form.deliverables}
            onChange={handleChange}
            rows={3}
            className="input min-h-[90px]"
            placeholder={
              "Responsive website\nSource code on GitHub\nDeployment support"
            }
          />
        </div>
      </div>

      {/* Payment methods */}
      <div>
        <label className="label">Payment Methods</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleCheckboxChange(m)}
              className={`px-3 py-1.5 rounded-full text-xs border ${
                form.paymentMethods?.includes(m)
                  ? "border-blue-500 bg-blue-500/10 text-blue-200"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="mt-2 grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">UPI ID (optional)</label>
            <input
              name="upiId"
              value={form.upiId}
              onChange={handleChange}
              className="input"
              placeholder="yourname@upi"
            />
          </div>
          <div>
            <label className="label">Video URL (optional)</label>
            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="label">Tags (comma separated)</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="input"
          placeholder="mern, full-stack, college-project"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-xs sm:text-sm font-medium text-white"
        >
          {isSubmitting
            ? mode === "edit"
              ? "Saving changes..."
              : "Creating gig..."
            : mode === "edit"
            ? "Save changes"
            : "Create gig"}
        </button>
      </div>
    </form>
  );
};

export default GigForm;

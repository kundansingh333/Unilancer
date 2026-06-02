import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createGig, updateGig } from "../../api/gigsApi";
import {
  Sparkles,
  Type,
  IndianRupee,
  Clock,
  Code2,
  ListChecks,
  CreditCard,
  Tags,
  Video,
  ChevronRight,
  Loader2,
  AlertCircle,
  X,
  Plus,
} from "lucide-react";

const CATEGORIES = [
  { value: "web-development", label: "Web Development", emoji: "🌐" },
  { value: "mobile-app", label: "Mobile App", emoji: "📱" },
  { value: "data-science", label: "Data Science", emoji: "📊" },
  { value: "ui-ux-design", label: "UI/UX Design", emoji: "🎨" },
  { value: "graphic-design", label: "Graphic Design", emoji: "✏️" },
  { value: "content-writing", label: "Content Writing", emoji: "✍️" },
  { value: "video-editing", label: "Video Editing", emoji: "🎬" },
  { value: "digital-marketing", label: "Digital Marketing", emoji: "📈" },
  { value: "tutoring", label: "Tutoring", emoji: "📚" },
  { value: "data-entry", label: "Data Entry", emoji: "⌨️" },
  { value: "translation", label: "Translation", emoji: "🌍" },
  { value: "other", label: "Other", emoji: "💡" },
];

const PRICING_MODELS = [
  { value: "fixed", label: "Fixed Price" },
  { value: "hourly", label: "Hourly Rate" },
  { value: "negotiable", label: "Negotiable" },
];

const PAYMENT_METHODS = ["UPI", "Bank Transfer", "PayPal", "Cash"];

const SECTIONS = [
  { id: "basic", label: "Basics", icon: Type },
  { id: "pricing", label: "Pricing", icon: IndianRupee },
  { id: "details", label: "Details", icon: Code2 },
  { id: "scope", label: "Scope", icon: ListChecks },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "extras", label: "Extras", icon: Tags },
];

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

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState(
    initialData.tags || []
  );

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

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed || tagsList.includes(trimmed)) return;
    const newTags = [...tagsList, trimmed];
    setTagsList(newTags);
    setForm((prev) => ({ ...prev, tags: newTags.join(", ") }));
    setTagInput("");
  };

  const removeTag = (index) => {
    const newTags = tagsList.filter((_, i) => i !== index);
    setTagsList(newTags);
    setForm((prev) => ({ ...prev, tags: newTags.join(", ") }));
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
        tags: tagsList.length > 0
          ? tagsList
          : form.tags
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

      if (onSuccess) {
        onSuccess(res.data.gig || null, res.data);
      } else {
        toast.success(
          mode === "edit"
            ? "Gig updated successfully!"
            : "Gig created successfully!"
        );
        navigate("/my-gigs");
      }
    } catch (err) {
      console.error("Gig form submit error:", err);
      setError(
        err?.response?.data?.error || err.message || "Failed to save gig"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Character count for description
  const descLength = form.description.length;
  const descPercent = Math.min((descLength / 3000) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* ==================== HEADER ==================== */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {mode === "edit" ? "Edit Gig" : "Create New Gig"}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {mode === "edit"
                  ? "Update your gig details below"
                  : "Fill in the details to publish your freelance service"}
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>

        {/* ==================== SECTION NAV (scrollable) ==================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#section-${s.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-full text-xs sm:text-sm text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200 whitespace-nowrap"
            >
              <s.icon className="w-3.5 h-3.5" />
              {s.label}
            </a>
          ))}
        </div>

        {/* ==================== ERROR ALERT ==================== */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-300">
                Failed to save gig
              </p>
              <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ==================== FORM ==================== */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ========== SECTION 1: BASIC INFO ========== */}
          <section
            id="section-basic"
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                Basic Information
              </h3>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Gig Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={100}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="e.g., I will build a full-stack MERN website for your startup"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Write a clear, descriptive title (10–100 characters)
              </p>
            </div>

            {/* Category + Sub Category */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sub Category{" "}
                  <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="e.g., Landing pages, React, Next.js"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Description <span className="text-red-400">*</span>
                </label>
                <span
                  className={`text-xs ${
                    descLength < 50
                      ? "text-red-400"
                      : descLength > 2800
                      ? "text-amber-400"
                      : "text-slate-500"
                  }`}
                >
                  {descLength} / 3000
                </span>
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                minLength={50}
                maxLength={3000}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-y min-h-[140px]"
                placeholder="Describe your service in detail — what you'll deliver, your process, technologies you use, and what makes your service stand out..."
              />
              {/* Progress bar for character count */}
              <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    descLength < 50
                      ? "bg-red-500"
                      : descLength > 2800
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${descPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Minimum 50 characters required
              </p>
            </div>
          </section>

          {/* ========== SECTION 2: PRICING & DELIVERY ========== */}
          <section
            id="section-pricing"
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">
                Pricing & Delivery
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pricing Model */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pricing Model
                </label>
                <select
                  name="pricingModel"
                  value={form.pricingModel}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                >
                  {PRICING_MODELS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Price <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    {form.currency === "INR" ? "₹" : "$"}
                  </span>
                  <input
                    name="price"
                    type="number"
                    min={100}
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="1000"
                  />
                </div>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                >
                  <option value="INR">🇮🇳 INR (₹)</option>
                  <option value="USD">🇺🇸 USD ($)</option>
                </select>
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Delivery <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    name="deliveryTime"
                    type="number"
                    min={1}
                    max={90}
                    value={form.deliveryTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 pr-14 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="7"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    days
                  </span>
                </div>
              </div>
            </div>

            {/* Revisions */}
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Revisions Included
              </label>
              <div className="flex items-center gap-3">
                <input
                  name="revisions"
                  type="range"
                  min={0}
                  max={10}
                  value={form.revisions}
                  onChange={handleChange}
                  className="flex-1 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-sm font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-1 min-w-[42px] text-center">
                  {form.revisions}
                </span>
              </div>
            </div>
          </section>

          {/* ========== SECTION 3: TECHNICAL DETAILS ========== */}
          <section
            id="section-details"
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-semibold text-white">
                Technical Details
              </h3>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tech Stack{" "}
                <span className="text-slate-500 font-normal">
                  (comma separated)
                </span>
              </label>
              <input
                name="techStack"
                value={form.techStack}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="React, Node.js, MongoDB, Tailwind CSS"
              />
              {/* Tech stack preview chips */}
              {form.techStack && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.techStack
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-300 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-slate-400" />
                  Video URL{" "}
                  <span className="text-slate-500 font-normal">(optional)</span>
                </span>
              </label>
              <input
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </section>

          {/* ========== SECTION 4: SCOPE (Requirements & Deliverables) ========== */}
          <section
            id="section-scope"
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">
                Scope of Work
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Requirements from Client
                </label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-y min-h-[120px]"
                  placeholder={"Website brief\nBrand guidelines\nLogos & assets\nContent copy"}
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  One requirement per line
                </p>
              </div>

              {/* Deliverables */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  What You'll Deliver
                </label>
                <textarea
                  name="deliverables"
                  value={form.deliverables}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-y min-h-[120px]"
                  placeholder={
                    "Responsive website\nSource code on GitHub\nDeployment support\nDocumentation"
                  }
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  One deliverable per line
                </p>
              </div>
            </div>
          </section>

          {/* ========== SECTION 5: PAYMENT METHODS ========== */}
          <section
            id="section-payment"
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Payment Methods
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-3">
                Select the payment methods you accept
              </p>
              <div className="flex flex-wrap gap-3">
                {PAYMENT_METHODS.map((m) => {
                  const isSelected = form.paymentMethods?.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleCheckboxChange(m)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/15 text-blue-300 shadow-lg shadow-blue-500/10"
                          : "border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                    >
                      {isSelected && "✓ "}
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UPI ID — show only if UPI is selected */}
            {form.paymentMethods?.includes("UPI") && (
              <div className="max-w-md">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  UPI ID
                </label>
                <input
                  name="upiId"
                  value={form.upiId}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="yourname@upi"
                />
              </div>
            )}
          </section>

          {/* ========== SECTION 6: TAGS ========== */}
          <section
            id="section-extras"
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Tags className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-semibold text-white">
                Tags & Discovery
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Add Tags
              </label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Type a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Tags display */}
              {tagsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tagsList.map((tag, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/10 border border-pink-500/30 text-pink-300 rounded-full text-xs group"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="text-pink-400/50 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                Tags help buyers discover your gig. Add relevant keywords.
              </p>
            </div>
          </section>

          {/* ========== SUBMIT SECTION ========== */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
            <p className="text-xs text-slate-500">
              Your gig will be reviewed by an admin before going live.
            </p>
            <div className="flex items-center gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {mode === "edit" ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {mode === "edit" ? "Save Changes" : "Create Gig"}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GigForm;

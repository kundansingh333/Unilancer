// src/components/Badge.jsx
import React from "react";

/**
 * Premium Badge Component
 */
const Badge = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-block rounded-md font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 border";

  const variantStyles = {
    primary: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    secondary: "bg-slate-800 text-slate-300 border-slate-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  };

  const finalClass = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  return (
    <span className={finalClass} {...props}>
      {children}
    </span>
  );
};

export default Badge;

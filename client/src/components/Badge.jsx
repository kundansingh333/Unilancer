// src/components/Badge.jsx
import React from "react";

/**
 * Strict Badge Component - Small but consistent
 */
const Badge = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-block rounded-full font-medium text-xs px-3 py-1";

  const variantStyles = {
    primary: "bg-accent text-white",
    secondary: "bg-indigo-100 text-dark",
    success: "bg-success/15 text-success border border-success/30",
    warning: "bg-warning/15 text-warning border border-warning/30",
    danger: "bg-danger/15 text-danger border border-danger/30",
    info: "bg-info/15 text-info border border-info/30",
  };

  const finalClass = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <span className={finalClass} {...props}>
      {children}
    </span>
  );
};

export default Badge;

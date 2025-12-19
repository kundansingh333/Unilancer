// src/components/Button.jsx
import React from "react";

/**
 * Strict Button Component - Dark Tech Theme
 * All variants use inline Tailwind utilities with slate/blue color scale
 */
const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  // Base styles applied to ALL buttons
  const baseStyles =
    "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size variants
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  // Color variants - Dark Tech Theme (slate/blue)
  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/20 active:scale-95 active:shadow-blue-600/10",
    secondary:
      "bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600",
    outline:
      "border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/20 active:scale-95",
    light:
      "bg-slate-800 text-slate-100 hover:bg-slate-700 hover:shadow-lg hover:shadow-slate-900/50 border border-slate-700 active:scale-95",
    danger:
      "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 active:scale-95",
    ghost:
      "text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 active:scale-95 transition-colors",
  };

  const finalClass = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button
      className={finalClass}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

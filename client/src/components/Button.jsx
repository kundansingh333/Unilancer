// src/components/Button.jsx
import React from "react";

/**
 * Premium Button Component - Glassmorphism & Gradient Tech Theme
 * All variants use inline Tailwind utilities with slate/indigo color scale
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
    "font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size variants
  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-3.5 text-base rounded-xl",
    xl: "px-10 py-4 text-lg rounded-2xl",
  };

  // Color variants - Premium Dark Theme (slate/indigo/emerald)
  const variantStyles = {
    primary:
      "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98]",
    secondary:
      "bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-600 shadow-sm active:scale-[0.98]",
    outline:
      "border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white shadow-sm hover:shadow-indigo-500/20 active:scale-[0.98]",
    light:
      "bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/10 active:scale-[0.98]",
    danger:
      "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white shadow-sm hover:shadow-rose-500/20 active:scale-[0.98]",
    ghost:
      "text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 active:scale-[0.98] transition-colors border border-transparent hover:border-indigo-500/20",
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

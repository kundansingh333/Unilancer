// src/components/Input.jsx
import React from "react";

/**
 * Premium Input Component
 */
const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  label = "",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "w-full rounded-xl px-4 py-3 bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm transition-all duration-300";

  const focusStyles =
    "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none";

  const errorStyles = error
    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
    : "";

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed bg-slate-900" : "";

  const inputClass = `${baseStyles} ${focusStyles} ${errorStyles} ${disabledStyles} ${className}`;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClass}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="text-rose-400 text-xs font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;

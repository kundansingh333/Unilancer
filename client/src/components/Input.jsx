// src/components/Input.jsx
import React from "react";

/**
 * Strict Input Component - Accessibility locked
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
    "w-full border-2 border-gray-100 rounded-lg px-4 py-3 bg-white text-dark placeholder-gray-400 font-medium transition-all duration-200";

  const focusStyles =
    "focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none";

  const errorStyles = error
    ? "border-danger focus:ring-danger/30"
    : "";

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  const inputClass = `${baseStyles} ${focusStyles} ${errorStyles} ${disabledStyles} ${className}`;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-dark">
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
        <p className="text-danger text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;

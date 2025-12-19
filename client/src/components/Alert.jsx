// src/components/Alert.jsx
import React from "react";

/**
 * Strict Alert Component - Visual hierarchy fixed with left border
 */
const Alert = ({
  variant = "info",
  title = "",
  children,
  className = "",
  icon: Icon = null,
  onClose = null,
  ...props
}) => {
  const baseStyles =
    "rounded-lg p-5 flex gap-4 items-start shadow-sm border border-l-4 animate-fade-in";

  const variantStyles = {
    success: "bg-success/10 border-success/30 border-l-success",
    warning: "bg-warning/10 border-warning/30 border-l-warning",
    danger: "bg-danger/10 border-danger/30 border-l-danger",
    info: "bg-info/10 border-info/30 border-l-info",
  };

  const iconColors = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    info: "text-info",
  };

  const finalClass = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <div className={finalClass} {...props}>
      {Icon && (
        <div className={`flex-shrink-0 ${iconColors[variant]}`}>
          <Icon size={22} />
        </div>
      )}
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold text-dark mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm text-gray-700">
          {children}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-dark transition-colors"
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;

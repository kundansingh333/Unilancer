// src/components/Card.jsx
import React from "react";

/**
 * Strict Card Component - Uniform visual depth
 * Base: white background, border, rounded corners, subtle shadow
 */
const Card = ({
  children,
  hoverable = false,
  className = "",
  padding = "p-6",
  ...props
}) => {
  const baseStyles =
    "bg-white border border-gray-100 rounded-xl shadow-sm";

  const hoverStyles = hoverable
    ? "hover:shadow-md hover:border-accent/30 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    : "";

  const finalClass = `${baseStyles} ${hoverStyles} ${padding} ${className}`;

  return (
    <div className={finalClass} {...props}>
      {children}
    </div>
  );
};

export default Card;

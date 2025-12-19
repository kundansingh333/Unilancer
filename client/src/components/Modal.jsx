// src/components/Modal.jsx
/**
 * Strict Modal Component - Fixed sizing and styling
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  className = "",
  size = "md",
  ...props
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-auto ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {/* Header */}
        {title && (
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-dark">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-dark transition-colors text-2xl leading-none"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

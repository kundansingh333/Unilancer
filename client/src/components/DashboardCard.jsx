// src/components/DashboardCard.jsx
/**
 * Dashboard card component - for status displays
 */
const DashboardCard = ({
  icon: Icon = null,
  title,
  value,
  subtitle,
  variant = "default",
  className = "",
  ...props
}) => {
  const variantStyles = {
    default: "bg-white border-gray-100",
    success: "bg-success/5 border-success/20",
    warning: "bg-warning/5 border-warning/20",
    danger: "bg-danger/5 border-danger/20",
    accent: "bg-accent/5 border-accent/20",
  };

  const iconColors = {
    default: "text-gray-400",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    accent: "text-accent",
  };

  return (
    <div
      className={`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-dark mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`flex-shrink-0 ${iconColors[variant]}`}>
            <Icon size={28} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;

// src/components/PageContainer.jsx
/**
 * Page container wrapper - ensures consistent layout across all pages
 */
const PageContainer = ({
  children,
  title = null,
  subtitle = null,
  className = "",
  noPadding = false,
  ...props
}) => {
  return (
    <div className="min-h-screen bg-light flex flex-col" {...props}>
      {/* Main content */}
      <main className={`flex-1 ${noPadding ? "" : "max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12"} ${className}`}>
        {/* Page Header */}
        {title && (
          <div className="mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-dark mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
};

export default PageContainer;

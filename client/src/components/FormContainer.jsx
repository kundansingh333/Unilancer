// src/components/FormContainer.jsx
/**
 * Reusable form container following the design system
 */
const FormContainer = ({
  children,
  title,
  subtitle,
  onSubmit,
  logo: Logo = null,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        {Logo && (
          <div className="flex justify-center mb-8">
            {Logo}
          </div>
        )}

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
          {title && (
            <>
              <h1 className="text-2xl font-display font-bold text-dark mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600 text-sm mb-6">
                  {subtitle}
                </p>
              )}
            </>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            {children}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;

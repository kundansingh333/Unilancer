// src/components/Tabs.jsx
/**
 * Tabs component - for switching between views
 */
const Tabs = ({
  tabs = [],
  activeTab = 0,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={className}>
      <div className="flex gap-0 border-b border-gray-100">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
              activeTab === index
                ? "text-accent border-accent"
                : "text-gray-600 border-transparent hover:text-dark"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;

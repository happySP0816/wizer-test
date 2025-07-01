import React from "react";

interface TabsProps {
  selectedTab: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const tabLabels = [
  "PROFILE TYPES OF YOUR PEOPLE",
  "GROUP DYNAMICS AND STYLES",
  // "OVERALL"
];

const Tabs: React.FC<TabsProps> = ({ selectedTab, onChange }) => {
  return (
    <div className="border-b border-gray-300 mb-4">
      <div className="flex">
        {tabLabels.map((label, idx) => (
          <button
            key={label}
            className={`px-6 py-2 text-sm font-medium transition-colors ${
              selectedTab === idx
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={e => onChange(e, idx)}
            type="button"
            aria-selected={selectedTab === idx}
            tabIndex={0}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

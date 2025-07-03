import React from "react";

interface TabsProps {
  selectedTab: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const tabLabels = [
  "PROFILE TYPES OF YOUR PEOPLE",
  "GROUP DYNAMICS AND STYLES",
];

const Tabs: React.FC<TabsProps> = ({ selectedTab, onChange }) => {
  return (
    <div className="border-b border-gray-200 mb-2 flex">
      {tabLabels.map((label, idx) => (
        <button
          key={label}
          type="button"
          onClick={e => onChange(e, idx)}
          className={`
            px-6 py-2 text-sm font-medium transition-colors
            ${selectedTab === idx
              ? "border-b-2 border-primary-600 text-primary-600 bg-white"
              : "border-b-2 border-transparent text-gray-500 hover:text-primary-600 hover:bg-gray-100"}
            focus:outline-none
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;

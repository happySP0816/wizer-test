import React, { useState } from 'react';

interface TabSelectorProps {
  options: string[];
  onSelect: (option: string) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ options, onSelect }) => {
  const [selectedTab, setSelectedTab] = useState<string>(options[0]);

  const handleTabClick = (option: string) => {
    setSelectedTab(option);
    onSelect(option);
  };

  return (
    <div
      className="flex w-full bg-[#e9e9e9] h-[47px] overflow-hidden flex-wrap sm:flex-nowrap justify-between sm:justify-start"
    >
      {options.map((option, index) => (
        <button
          key={option + index}
          type="button"
          onClick={() => handleTabClick(option)}
          className={`
            flex items-center justify-center text-center px-4 py-2 cursor-pointer transition-colors
            ${selectedTab === option ? 'bg-[#d7d2e7] text-black font-bold shadow-[0_7px_3px_-3px_#c3c3c3]' : 'bg-[#e9e9e9] text-gray-500 font-normal'}
            ${index !== options.length - 1 ? 'border-r-4 border-[#f4f5fa]' : ''}
            ${selectedTab !== option ? 'hover:bg-[#d0d0d0]' : ''}
            flex-1 sm:flex-none sm:w-auto
            mb-1 sm:mb-0
          `}
          style={{ flex: window.innerWidth < 640 ? '0 0 48%' : '1' }}
        >
          <span className="text-base">{option}</span>
        </button>
      ))}
    </div>
  );
};

export default TabSelector;

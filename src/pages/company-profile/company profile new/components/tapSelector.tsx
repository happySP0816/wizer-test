import React from 'react';

interface TabSelectorProps {
  options: string[];
  onSelect: (option: string) => void;
  selectedTab: string;
}

const TabSelector: React.FC<TabSelectorProps> = ({ options, onSelect, selectedTab }) => {
  const handleTabClick = (option: string) => {
    onSelect(option);
  };

  return (
    <div className="flex flex-wrap bg-[#e9e9e9] h-[47px] w-full justify-between sm:justify-start">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleTabClick(option)}
          className={`
            flex items-center justify-center text-center px-4 py-2 cursor-pointer transition-colors
            ${selectedTab === option ? 'bg-[#d7d2e7] text-black font-bold shadow-[0_7px_3px_-3px_#c3c3c3]' : 'bg-[#e9e9e9] text-gray-500 font-normal'}
            sm:min-w-[150px] sm:max-w-[150px] min-w-[45%] max-w-[48%]
            ${selectedTab !== option ? 'hover:bg-[#d0d0d0]' : ''}
            border-r-0 sm:border-r-4 sm:border-[#f4f5fa]
            mb-1 sm:mb-0
          `}
        >
          <span className="text-base">{option}</span>
        </button>
      ))}
    </div>
  );
};

export default TabSelector;

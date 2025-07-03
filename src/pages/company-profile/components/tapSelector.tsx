import { Button } from "@/components/components/ui/button";

interface TabSelectorProps {
  options: string[];
  onSelect: (option: string) => void;
  selectedTab: string;
}

const TabSelector: React.FC<TabSelectorProps> = ({ options, onSelect, selectedTab }) => {
  return (
    <div className="w-full">
      <div className="bg-gray-200 rounded-lg shadow-none">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {options.map((option) => (
            <Button 
              key={option}
              className={`h-[47px] w-[152PX] cursor-pointer px-4 text-sm rounded-none rounded-t-xs font-medium transition-colors duration-700 ${selectedTab === option ? 'bg-primary text-white font-semibold border' : 'bg-gray-200 text-gray-700'} hover:!text-white focus:!outline-none`}
              onClick={() => onSelect(option)}
            >
              {option}
            </Button>
          ))}
          </div>
      </div>
    </div>
  );
};

export default TabSelector;

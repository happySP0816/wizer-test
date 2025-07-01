import React from 'react';

interface StrengthMeterProps {
  strength: number;
}

const StrengthMeter: React.FC<StrengthMeterProps> = ({ strength }) => {
  return (
    <div className="inline-flex items-center gap-4 ml-4">
      <div className="relative w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
          style={{ width: `${strength}%` }}
        />
        <div
          className="absolute top-0 w-1 h-full bg-gray-800 rounded-full transition-all duration-300"
          style={{ left: `${strength}%` }}
        />
      </div>
      <div className="flex gap-4 text-xs text-gray-600">
        <span>low</span>
        <span>moderate</span>
        <span>high</span>
      </div>
    </div>
  );
};

export default StrengthMeter; 
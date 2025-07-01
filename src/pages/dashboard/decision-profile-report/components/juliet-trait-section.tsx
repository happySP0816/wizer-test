import React, { useEffect, useState } from 'react';
import type { Scores } from '..';
import { Typography } from '@/components/components/ui/typography';

interface TraitSectionProps {
  scores?: Scores;
  selectedTrait: string;
  setSelectedTrait: React.Dispatch<React.SetStateAction<string>>;
  type: 'juliet' | 'big 5';
  median?: number;
}

const JulietTraitSection: React.FC<TraitSectionProps> = ({ scores, selectedTrait, setSelectedTrait, type, median }) => {
  const [visibleIndex, setVisibleIndex] = useState<number>(-1);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!scores || !scores[type]) return;
    const entries = Object.entries(scores[type]);
    let index = 0;
    const showBars = () => {
      if (index < entries.length) {
        setVisibleIndex(index);
        index += 1;
        setTimeout(showBars, 300);
      } else {
        setAnimated(true);
      }
    };
    showBars();
  }, [scores, type]);

  if (!scores || !scores[type]) return null;

  return (
    <div className="flex flex-wrap gap-4 py-5 w-full overflow-x-auto pl-[3%]">
      {Object.entries(scores[type]).map(([key, value], index) => {
        const numericValue = value as number;
        const percentage = Math.min(numericValue, 100);
        const medianPercentage = median ? Math.min(median, 100) : null;
        return (
          <div
            key={`${type}-${key}`}
            className={`relative flex flex-col items-center justify-end w-28 h-[200px] text-center cursor-pointer transition-opacity duration-200 ${visibleIndex >= index ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setSelectedTrait(key)}
          >
            {/* Bar */}
            <div className="absolute bottom-10 flex flex-col items-center justify-end" style={{ height: '150px', width: '24px' }}>
              <div
                className="w-6 h-full rounded bg-gradient-to-t from-cyan-300/20 to-cyan-400/80 relative flex items-end justify-center transition-all duration-300"
                style={{ minHeight: '100%', maxHeight: '150px' }}
              >
                {/* User marker */}
                <div
                  className="absolute right-[-12px]"
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderRight: '8px solid black',
                    bottom: `${percentage}%`,
                    transform: 'translateY(50%)',
                  }}
                />
                {/* User dashed line */}
                {percentage !== null && (
                  <div
                    className="absolute left-0 w-full border-t-2 border-dashed border-black"
                    style={{ bottom: `${percentage}%` }}
                  />
                )}
                {/* Median marker */}
                {medianPercentage !== null && (
                  <div
                    className="absolute right-[-12px]"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      borderRight: '8px solid gray',
                      bottom: `${medianPercentage}%`,
                      transform: 'translateY(50%)',
                    }}
                  />
                )}
                {/* Median dashed line */}
                {medianPercentage !== null && (
                  <div
                    className="absolute left-0 w-full border-t-2 border-dashed border-gray-400"
                    style={{ bottom: `${medianPercentage}%` }}
                  />
                )}
              </div>
            </div>
            {/* Trait label */}
            <Typography
              variant="body2"
              className={`absolute bottom-2 pt-2 w-full text-center select-none ${selectedTrait === key ? 'text-[#7B69AF]' : 'text-black'}`}
            >
              {key}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export default JulietTraitSection;
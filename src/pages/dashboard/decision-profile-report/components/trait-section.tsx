import React, { useEffect, useState } from 'react';
import Progress, { getColor, useResponsiveSize } from '@/utils/progress';
import type { Scores } from '..';
import { Typography } from '@/components/components/ui/typography';

interface TraitSectionProps {
  scores?: Scores;
  selectedTrait: string;
  setSelectedTrait: React.Dispatch<React.SetStateAction<string>>;
  type: 'juliet' | 'big 5';
}

const TraitSection: React.FC<TraitSectionProps> = ({ scores, selectedTrait, setSelectedTrait, type }) => {
  const [visibleIndex, setVisibleIndex] = useState<number>(-1);
  const [animated, setAnimated] = useState(false);
  const { size, thickness } = useResponsiveSize();

  useEffect(() => {
    if (!scores || !scores[type]) return;
    const entries = Object.entries(scores[type]);
    let index = 0;
    const showCircles = () => {
      if (index < entries.length) {
        setVisibleIndex(index);
        index += 1;
        setTimeout(showCircles, 300);
      } else {
        setAnimated(true);
      }
    };
    showCircles();
  }, [scores, type]);

  if (!scores || !scores[type]) return null;

  return (
    <div className="flex flex-wrap gap-5 py-3 w-full overflow-x-auto pl-[3%]">
      {Object.entries(scores[type]).map(([key, value], index) => {
        const numericValue = value as number;
        const color = getColor(numericValue);
        return (
          <div
            key={`${type}-${key}`}
            className={`relative flex flex-col items-center justify-center w-36 text-center cursor-pointer py-3 transition-opacity duration-200 ${visibleIndex >= index ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setSelectedTrait(key)}
          >
            <div className="relative flex flex-col items-center justify-center">
              <Progress
                value={animated ? Math.floor(numericValue) : 0}
                size={size}
                thickness={thickness}
                color={color}
              />
              <Typography
                variant="body2"
                className={`mt-2 select-none ${selectedTrait === key ? 'text-[#7B69AF]' : 'text-black'}`}
              >
                {key}
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TraitSection;
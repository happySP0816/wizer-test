import React from 'react';
import type { IStatsViewCardProps } from './engagementTypes';

const StatsViewCard = (props: IStatsViewCardProps) => {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-black mb-2">{props.title}</div>
      <div className="text-[52px] font-bold text-black">{props.data}</div>
      <div className="mt-2 w-[200px] mx-auto flex items-center justify-center">
        <span className="text-base text-black">{props.explaination}</span>
        {props.hints && (
          <div className="relative group ml-2">
            <button
              type="button"
              className="bg-[#d9d9d9] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#bfbfbf] transition-colors"
              tabIndex={0}
            >
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="8" r="1" fill="currentColor" />
              </svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
              {props.hints}
              <div className="absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsViewCard;

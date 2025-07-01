import React from 'react';
import Circle from './Circle';

const DistributionChart = () => {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-2.5">
        <span className="font-normal text-xs font-montserrat text-black">High</span>
        <div className="w-2 h-24 bg-black" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-end gap-2">
          <span className="font-normal text-xs font-montserrat text-black">65% Ext</span>
          <span className="font-normal text-xs font-montserrat text-black">35% Int</span>
        </div>
        <div className="flex gap-5">
          <Circle size={91} color="rgba(91, 72, 146, 1)" />
          <Circle size={68} color="rgba(91, 72, 146, 1)" />
        </div>
      </div>

      <div className="flex items-center gap-4.5">
        <span className="font-normal text-xs font-montserrat text-black">Low</span>
        <div className="h-2 w-24 bg-black" />
      </div>
    </section>
  );
};

export default DistributionChart;
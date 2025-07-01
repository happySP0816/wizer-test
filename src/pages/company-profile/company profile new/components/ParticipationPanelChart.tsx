import React from "react";
import Circle from "../utils/Circle";

type ParticipationPanelChartProps = {
  data: {
    groups: any;
    departments: any;
  }[];
};

interface LegendItemProps {
  name: string;
  color: string;
}

export const LegendItem = ({ name, color }: LegendItemProps) => (
  <div className="flex items-center gap-2">
    <span className="font-normal text-xs font-montserrat text-black">{name}</span>
    <div className="w-3 h-3" style={{ backgroundColor: color }} />
  </div>
);

const ParticipationPanel: React.FC<ParticipationPanelChartProps> = ({ data }) => {
  return (
    <section className="flex flex-col w-full bg-[#D9D9D9] p-5">
      <header className="mb-5">
        <h2 className="font-semibold text-xs font-montserrat text-black text-center">Panel Participation</h2>
      </header>
      <div className="flex gap-5 flex-col lg:flex-row">
        <div className="flex gap-5">
          <div className="flex flex-col gap-2.5">
            <Circle size={137} color="rgba(91, 72, 146, 1)" />
            <Circle size={91} color="rgba(91, 72, 146, 1)" />
            <Circle size={68} color="rgba(91, 72, 146, 1)" />
          </div>
          <div className="flex flex-col gap-2.5">
            <Circle size={98} color="rgba(61, 89, 123, 1)" />
            <Circle size={56} color="rgba(61, 89, 123, 1)" />
            <Circle size={79} color="rgba(61, 89, 123, 1)" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {data[0]["groups"].map((group: any, index: number) => (
              <LegendItem key={index} {...group} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {data[0]["departments"].map((dept: any, index: number) => (
              <LegendItem key={index} {...dept} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticipationPanel;

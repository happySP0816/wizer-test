import React from "react";

interface MetricCardProps {
    title: string;
    responses: string;
    color: string;
    size: number;
    region: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    responses,
    color,
    size,
    region,
  }) => {
    return (
      <div className="flex flex-col items-center justify-between text-center h-full p-4 bg-white rounded-lg shadow">
        <h3 className="text-base font-medium uppercase min-h-[48px] font-montserrat m-0">{title}</h3>
        <span className="text-xs mt-4 font-montserrat">{responses}</span>
        <div
          className="rounded-full border border-white mt-6"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
          }}
        />
        <span className="text-xs mt-4 text-center font-montserrat">{region}</span>
      </div>
    );
  };
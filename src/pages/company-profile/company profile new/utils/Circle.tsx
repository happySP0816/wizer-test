import React from "react";

interface CircleProps {
  size: number;
  color: string;
}

const Circle: React.FC<CircleProps> = ({ size, color }) => {
  return (
    <div
      className="rounded-full border border-white"
      style={{ width: size, height: size, backgroundColor: color }}
    ></div>
  );
};

export default Circle; 
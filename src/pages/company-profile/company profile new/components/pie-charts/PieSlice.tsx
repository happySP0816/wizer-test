// # Slice component for rendering each segment of the pie chartimport React from "react";

type PieSliceProps = {
    size: number;
    thickness: number;
    value: number;
    color: string;
    offset: number;
};

const PieSlice: React.FC<PieSliceProps> = ({ size, thickness, value, color, offset }) => {
    const radius = size / 2;
    const innerRadius = radius - thickness;
    const circumference = 2 * Math.PI * innerRadius;
    const strokeDasharray = `${(value / 100) * circumference} ${circumference}`;

    return (
        <circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${radius} ${radius})`}
        />
    );
};

export default PieSlice;

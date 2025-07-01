// Main Pie Chart component

import React from "react";

type PieChartProps = {
    size: number; // Diameter of the pie chart
    thickness: number; // Thickness of the pie slice
    value: number; // Percentage value (0-100)
    color?: string; // Slice color
    backgroundColor?: string; // Background ring color
};

const PieChart: React.FC<PieChartProps> = ({ size, thickness, value, color = "#4CC9F0", backgroundColor = "#EEE" }) => {
    const radius = size / 2;
    const innerRadius = radius - thickness;
    const circumference = 2 * Math.PI * innerRadius;
    const strokeDasharray = `${(value / 100) * circumference} ${circumference}`;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Circle */}
            <circle cx={radius} cy={radius} r={innerRadius} fill="none" stroke={backgroundColor} strokeWidth={thickness} />
            
            {/* Foreground Circle */}
            <circle
                cx={radius}
                cy={radius}
                r={innerRadius}
                fill="none"
                stroke={color}
                strokeWidth={thickness}
                strokeDasharray={strokeDasharray}
                strokeDashoffset="0"
                transform={`rotate(-90 ${radius} ${radius})`} // Rotate to start at the top
            />
            
            {/* Text Percentage */}
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="1.5rem" fontWeight="bold">
                {value}%
            </text>
        </svg>
    );
};

export default PieChart;

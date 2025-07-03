import React from 'react';
import { calculateLabelPosition } from './chartUtils';

interface DonutChartProps {
    data: { name: string; value: number, color: string }[];
    donutSize?: number;
    dataGap?: number;
    highlightName?: string;
    children?: React.ReactNode;
    emptyColor?: string;
}

const DonutChart = ({
    data, 
    donutSize = 25, 
    dataGap = 0, 
    highlightName, 
    children,
    emptyColor = "#e0e0e0" // Default gray color for empty chart
}: DonutChartProps) => {
    const total = data.reduce((sum, segment) => sum + segment.value, 0);
    const isEmpty = total === 0;

    const centerX = 200;
    const centerY = 200;
    const radius = 180;
    const innerRadius = radius - donutSize; // Donut thickness

    // For empty state, create a complete donut
    if (isEmpty) {
        const emptyDonutPath = `
            M ${centerX} ${centerY - radius}
            A ${radius} ${radius} 0 1 1 ${centerX - 0.01} ${centerY - radius}
            L ${centerX - 0.01} ${centerY - innerRadius}
            A ${innerRadius} ${innerRadius} 0 1 0 ${centerX} ${centerY - innerRadius} Z
        `;

        return (
            <div className="flex flex-col items-center justify-center p-4">
                <div className="flex justify-center">
                    <svg width="300" height="300" viewBox="-80 0 500 500">
                        {/* Draw Empty Donut */}
                        <path d={emptyDonutPath} fill={emptyColor} />
                        {/* Center Content */}
                        <foreignObject x={centerX - 50} y={centerY - 50} width="100" height="100">
                            <div className="flex items-center justify-center w-full h-full">
                                {children}
                            </div>
                        </foreignObject>
                    </svg>
                </div>
            </div>
        );
    }

    // Normal chart rendering when there are values
    const gapAngle = dataGap / 100 * 2 * Math.PI; // Convert percentage to radians
    let cumulativeAngle = -Math.PI / 2;

    const segments = data.map((segment) => {
        const startAngle = cumulativeAngle;
        const angle = (segment.value / total) * (2 * Math.PI - data.length * gapAngle); // Subtract gaps
        const endAngle = startAngle + angle;

        cumulativeAngle = endAngle + gapAngle; // Add the gap

        const arcStartX = centerX + radius * Math.cos(startAngle);
        const arcStartY = centerY + radius * Math.sin(startAngle);
        const arcEndX = centerX + radius * Math.cos(endAngle);
        const arcEndY = centerY + radius * Math.sin(endAngle);

        const innerStartX = centerX + innerRadius * Math.cos(endAngle);
        const innerStartY = centerY + innerRadius * Math.sin(endAngle);
        const innerEndX = centerX + innerRadius * Math.cos(startAngle);
        const innerEndY = centerY + innerRadius * Math.sin(startAngle);

        const largeArcFlag = angle > Math.PI ? 1 : 0;

        // Donut Chart Path
        const path = `
            M ${arcStartX} ${arcStartY}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${arcEndX} ${arcEndY}
            L ${innerStartX} ${innerStartY}
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEndX} ${innerEndY} Z
        `;

        // Calculate percentage
        const percentage = ((segment.value / total) * 100).toFixed(1);

        // Calculate label and connection positions
        const midAngle = startAngle + angle / 2;
        const labelPosition = calculateLabelPosition(midAngle, radius + 30, centerX, centerY);
        const linePosition = calculateLabelPosition(midAngle, radius, centerX, centerY);

        return {
            path,
            labelPosition,
            linePosition,
            color: segment.color,
            label: segment.name,
            value: segment.value,
            percentage,
        };
    });

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="flex justify-center">
                <svg width="300" height="300" viewBox="-80 0 500 500">
                    {/* Draw Donut Segments */}
                    {segments.map((segment, index) => (
                        <path key={index} d={segment.path} fill={segment.color} />
                    ))}

                    {/* Show percentage and connection only for highlighted value */}
                    {segments.map((segment, index) => {
                        if (segment.label !== highlightName) return null;

                        const { x, y } = segment.labelPosition;
                        const { x: lineX, y: lineY } = segment.linePosition;

                        // Ensure label stays at the end of the connection path
                        const labelX = x > centerX ? x + 25 : x - 25;
                        const labelY = y > centerY ? y + 10 : y - 10;

                        return (
                            <g key={index}>
                                {/* Connection Line */}
                                <line
                                    x1={lineX}
                                    y1={lineY}
                                    x2={labelX}
                                    y2={labelY}
                                    stroke="#000"
                                    strokeWidth="1"
                                />
                                {/* Percentage Label */}
                                <text
                                    x={labelX}
                                    y={labelY}
                                    textAnchor={x > centerX ? 'start' : 'end'}
                                    fill="#323232"
                                    fontSize={16}
                                    fontWeight="bold"
                                >
                                    {segment.percentage}%
                                </text>
                                <text
                                    x={labelX}
                                    y={labelY +15}
                                    textAnchor={x > centerX ? 'start' : 'end'}
                                    fill="#323232"
                                    fontSize={12}
                                >
                                    {segment.label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Center Content */}
                    <foreignObject x={centerX - 50} y={centerY - 50} width="100" height="100">
                        <div className="flex items-center justify-center w-full h-full">
                            {children}
                        </div>
                    </foreignObject>
                </svg>
            </div>
        </div>
    );
};

export default DonutChart;
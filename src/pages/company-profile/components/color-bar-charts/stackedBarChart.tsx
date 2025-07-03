"use client";

import React, { useRef, useState, useEffect } from "react";
import type { ProfileData } from "./ChartTypes";
import BarLegend from "./barLegend";
import { Typography } from '@/components/components/ui/typography';

// Colors mapping for multiple-category data
export const profileColors: Record<string, string> = {
    Analyser: "#FC8DCA",
    Collaborator: "#3EDAA6",
    Guardian: "#FFA82E",
    Explorer: "#FFD421",
    Achiever: "#505DB0",
    Visionary: "#A080FC",
    Deliverer: "#4CC9F0",
};

// Main StackedBarChart Component
type StackedBarChartProps = {
    title: string;
    data: ProfileData[];
    chartName?: string;
    yLabelTop?: string;
    maxValue?: number;
    xAxisStep?: number;
    children?: React.ReactNode;
};

const StackedBarChart: React.FC<StackedBarChartProps> & {
    YAxis: React.FC<{ data: ProfileData[]; barHeight: number; yLabelTop?: string }>;
    Bars: React.FC<{ data: ProfileData[]; maxValue?: number; xAxisStep?: number, scale?: number }>;
    Legend: React.FC;
} = ({ title, chartName, children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [, setScale] = useState(1.0);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setScale(width >= 1024 ? 1.0 : width / 1024);
            }
        };
        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-4 w-full">
            <Typography variant="h5" className="mb-2 font-bold text-center w-[300px]">{title}</Typography>
            <div className="relative w-full flex flex-col items-center min-h-[500px] justify-center" ref={containerRef}>
                {children}
                {chartName && (
                    <Typography className="mt-4 text-black text-center">{chartName}</Typography>
                )}
            </div>
        </div>
    );
};

// Y-Axis Component
StackedBarChart.YAxis = ({ data, barHeight, yLabelTop }) => (
    <div
        className="absolute left-0 flex flex-col items-end pr-2 justify-start"
        style={{
            top: yLabelTop,
            width: 200,
            textAlign: "right",
            height: `${data.length * 50}px`,
        }}
    >
        {data.map((d, index) => (
            <Typography
                key={d.group}
                variant="body2"
                className="text-right flex items-center justify-end w-full"
                style={{
                    minHeight: `${barHeight}px`,
                    lineHeight: `${barHeight}px`,
                    position: "absolute",
                    top: `${index * 50 + (50 - barHeight) / 2}px`,
                }}
            >
                {d.group}
            </Typography>
        ))}
    </div>
);

// Bars & Chart Component
StackedBarChart.Bars = ({ data, maxValue, xAxisStep, scale = 1.0 }) => {
    const baseWidth = 800;
    const scaledWidth = baseWidth * scale;
    const barHeight = 24;
    const barSpacing = 50;
    const chartHeight = data.length * barSpacing + 50;
    const isSinglePercentage = data.every((d) => "percentage" in d);
    const autoMaxTotal = Math.max(
        ...data.map((d) =>
            isSinglePercentage
                ? d.percentage || 0
                : Object.values(d)
                      .slice(1)
                      .reduce((sum, val) => sum + (val as number), 0)
        )
    ) + 10;
    const maxTotal = maxValue ?? autoMaxTotal;
    const tickInterval = xAxisStep ?? 10;
    return (
        <div className="flex justify-start items-start w-4/5">
            <svg width={scaledWidth} height={chartHeight}>
                {/* Y-axis line */}
                <line x1="119" y1="0" x2="119" y2={chartHeight - 15} stroke="rgb(139 139 139)" strokeWidth={2} />
                {/* Bars */}
                {data.map((d, i) => {
                    let xOffset = 120;
                    return (
                        <g key={d.group}>
                            {isSinglePercentage ? (
                                <rect
                                    x={xOffset}
                                    y={i * barSpacing + 12}
                                    width={(d.percentage! / maxTotal) * scaledWidth}
                                    height={barHeight}
                                    fill="#4CC9F0"
                                />
                            ) : (
                                Object.entries(d)
                                    .filter(([key]) => key !== "group")
                                    .map(([key, value], j) => {
                                        const barWidth = (Number(value) / maxTotal) * scaledWidth;
                                        const rect = (
                                            <rect
                                                key={j}
                                                x={xOffset}
                                                y={i * barSpacing + 12}
                                                width={barWidth}
                                                height={barHeight}
                                                fill={profileColors[key] || "#CCC"}
                                            />
                                        );
                                        xOffset += barWidth;
                                        return rect;
                                    })
                            )}
                        </g>
                    );
                })}
                {/* X-axis */}
                <line x1="120" y1={chartHeight - 20} x2={scaledWidth + 120} y2={chartHeight - 20} stroke="#000" />
                {[...Array(Math.ceil(maxTotal / tickInterval) + 1)].map((_, i) => {
                    const value = i * tickInterval;
                    const xPosition = 120 + (value / maxTotal) * scaledWidth;
                    return (
                        <g key={i}>
                            <line x1={xPosition} y1={chartHeight - 20} x2={xPosition} y2={chartHeight - 15} stroke="#000" />
                            <text x={xPosition} y={chartHeight - 5} fontSize="12" fill="#555" textAnchor="middle">
                                {value}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// Legend Component
StackedBarChart.Legend = () => <BarLegend profileColors={profileColors} />;

export default StackedBarChart;

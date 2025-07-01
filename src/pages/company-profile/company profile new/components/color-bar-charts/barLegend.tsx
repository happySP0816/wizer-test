import React from "react";

interface BarLegendProps {
    profileColors: Record<string, string>;
}

const BarLegend = (props: BarLegendProps) => {
    return (
        <div
            className="absolute right-0 top-0 flex flex-col gap-1"
        >
            <p className="mb-1">Profile Types</p>
            {Object.keys(props.profileColors).map((label, i) => (
                <div key={i} className="flex items-center gap-1">
                    {/* Legend Color Box */}
                    <span
                        className="inline-block"
                        style={{ width: 15, height: 15, backgroundColor: props.profileColors[label as keyof typeof props.profileColors] }}
                    />
                    {/* Label Text */}
                    <span className="text-sm">{label.charAt(0).toUpperCase() + label.slice(1)}</span>
                </div>
            ))}
        </div>
    );
};

export default BarLegend;
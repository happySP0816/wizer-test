import React from "react";

type LegendItem = {
    label: string;
    color: string;
};

type ChartLegendProps = {
    items: LegendItem[];
};

const ChartLegend: React.FC<ChartLegendProps> = ({ items }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {items.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "15px", height: "15px", backgroundColor: item.color, borderRadius: "50%" }}></div>
                <span>{item.label}</span>
            </div>
        ))}
    </div>
);

export default ChartLegend;

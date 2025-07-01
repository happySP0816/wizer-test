import { colorMapping } from "../../utils/colorMapping";
import React from "react";

const BubbleLegend = () => {
    const legendItems = Object.entries(colorMapping);

    return (
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(4, 1fr)", 
            gap: "15px", 
            marginTop: "10px", 
            justifyContent: "flex-end", // Ensures alignment to the right
            textAlign: "right"
        }}>
            {legendItems.map(([label, color]) => (
                <div key={label} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    justifyContent: "flex-end" // Pushes both items to the right
                }}>
                    <span style={{ fontSize: "14px" }}>{label}</span>
                    <div style={{ width: "12px", height: "12px", backgroundColor: color, borderRadius: "3px" }}></div>
                </div>
            ))}
        </div>
    );
};

export default BubbleLegend;

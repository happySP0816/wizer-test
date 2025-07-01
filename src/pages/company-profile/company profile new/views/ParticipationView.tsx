import React, { useState } from "react";
// import ToggleButtonGroupComponent from "../components/ToggleButtonGroup";
import BubbleLegend from "../components/bubble-charts/BubbleLegend";

const ParticipationView = () => {
    const [view, setView] = useState("Internal");

    return (
        <div className="w-4/5 mx-auto text-center">
            <div className="text-2xl font-bold mb-2">
                Participation by SubGroup
            </div>

            {/*
            <div className="flex justify-end mb-2">
                <ToggleButtonGroupComponent view={view} setView={setView} />
            </div>
            */}

            <div className="text-base font-semibold mb-4">
                PARTICIPANT COUNT: 397
            </div>

            {/* <BubbleChart view={view} /> */}
            <BubbleLegend />
        </div>
    );
};

export default ParticipationView;

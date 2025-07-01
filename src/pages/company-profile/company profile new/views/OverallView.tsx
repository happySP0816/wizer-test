import React from "react";
import PersonalityTrait from "./decision-profiles/PersonalityTraitItem";

const OverallView = ({ data }: any) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="mx-10">
        <div className="text-lg font-bold text-black mb-4">
          Diversity of Thinking (Overall):
        </div>
        <PersonalityTrait data={data} title={"Primary Personality Trait"} name={"PERSONALITY"} />
        <PersonalityTrait data={data} title={"Primary Decision Thinking Trait"} name={"DECISION THINKING"} />
      </div>
    </div>
  );
};

export default OverallView;

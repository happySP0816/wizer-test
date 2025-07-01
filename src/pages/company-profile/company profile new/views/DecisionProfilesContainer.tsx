import React, { useState } from "react";
import Tabs from "../components/Tabs";
import ProfileTypesView from "./ProfileTypesView";
import GroupDynamicsView from "./GroupDynamicsView";
// import OverallView from "./OverallView";

interface DecisionProfilesContainerProps {
  decisionData: any;
  decisionGroups?: any;
  decisionStyleThinking?: any;
  insights?: { decisions?: string };
}

const DecisionProfilesContainer: React.FC<DecisionProfilesContainerProps> = ({
  decisionData,
  insights,
  decisionGroups,
  decisionStyleThinking,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="flex flex-col gap-4 bg-white">
      {/* Tabs for Navigation */}
      <Tabs selectedTab={selectedTab} onChange={(_e, newValue) => setSelectedTab(newValue)} />

      {/* Render Content Based on Selected Tab */}
      {selectedTab === 0 && (
        <div>
          <ProfileTypesView data={decisionData} />
          <div className="bg-[#d7d2e7] flex items-center px-2 flex-grow break-words mt-4">
            <div className="px-10 py-6 text-black w-full">
              <strong>INSIGHTS:</strong> {insights?.decisions ?? 'Unable to generate insights'}
            </div>
          </div>
        </div>
      )}
      {selectedTab === 1 && (
        <GroupDynamicsView
          decisionGroups={decisionGroups}
          decisionStyleThinking={decisionStyleThinking}
          insights={insights}
        />
      )}
      {/* {selectedTab === 2 && <OverallView data={decisionData} />} */}
    </div>
  );
};

export default DecisionProfilesContainer;

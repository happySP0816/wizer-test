import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/components/ui/tabs';
import ProfileTypesView from "./ProfileTypesView";
import GroupDynamicsView from "./GroupDynamicsView";

interface DecisionProfilesContainerProps {
  decisionData: any;
  decisionGroups?: any;
  decisionStyleThinking?: any;
  insights?: { decisions?: string };
}

const DecisionProfilesContainer: React.FC<DecisionProfilesContainerProps> = ({ decisionData, insights, decisionGroups, decisionStyleThinking }) => {
  const [selectedTab, setSelectedTab] = useState('profile');

  return (
    <div className="bg-white flex flex-col gap-1">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="gap-2">
          <TabsTrigger value="profile">PROFILE TYPES OF YOUR PEOPLE</TabsTrigger>
          <TabsTrigger value="group">GROUP DYNAMICS AND STYLES</TabsTrigger>
          <TabsTrigger value="group" disabled>OVERALL</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTypesView data={decisionData} insights={insights} />
        </TabsContent>
        <TabsContent value="group">
          <GroupDynamicsView decisionGroups={decisionGroups} decisionStyleThinking={decisionStyleThinking} insights={insights} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DecisionProfilesContainer;

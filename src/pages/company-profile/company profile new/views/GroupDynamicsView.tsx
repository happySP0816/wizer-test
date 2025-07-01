import React, { useState } from "react";
import StackedBarChart from "../components/color-bar-charts/stackedBarChart";
import GroupFilter from "../components/selection/GroupFilter";

const GroupDynamicsView = ({ decisionGroups, decisionStyleThinking, insights }: any) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(
    Object.keys(decisionGroups.groups)[0] || ""
  );

  const transformedGroups = Object.entries(decisionGroups.groups).map(([group, values]) => ({
    group,
    ...(values as object)
  }));
  const transformedThinking = Object.entries(decisionStyleThinking.groups).map(([group, values]) => ({
    group,
    ...(values as object)
  }));

  const selectedData = transformedThinking.find(item => item.group === selectedGroup);
  const selectedDataTransformed = selectedData
    ? {
        group: selectedData.group,
        values: Object.entries(selectedData)
          .filter(([key]) => key !== "group")
          .map(([key, value]) => ({
            group: key,
            percentage: Number(value),
          })),
      }
    : { group: "", values: [] };

  return (
    <div className="flex flex-col gap-6">
      {/* Charts Section */}
      <div className="w-full">
        <StackedBarChart
          data={transformedGroups}
          title="Group"
          chartName={`number of people (total=${decisionGroups['total_people']})`}
          yLabelTop="2px"
        >
          <StackedBarChart.YAxis data={transformedGroups} barHeight={24} yLabelTop="1px" />
          <StackedBarChart.Bars data={transformedGroups} maxValue={70} xAxisStep={10} scale={1.0} />
          <StackedBarChart.Legend />
        </StackedBarChart>

        {/* Dynamic Title Update */}
        <div className="flex gap-2 mt-5 pl-8 items-center">
          <span className="text-lg font-bold text-black">Diversity of Thinking (By Group):</span>
          <span className="text-lg font-bold text-[#7B69AF]">{selectedGroup}</span>
        </div>

        {/* StackedBarChart with selected group's data */}
        <div className="relative">
          <StackedBarChart
            data={selectedDataTransformed.values ?? []}
            title="Decision thinking"
            chartName="percentage (%)"
            yLabelTop="55px"
          >
            <StackedBarChart.YAxis data={selectedDataTransformed.values ?? []} barHeight={24} yLabelTop="45px" />
            <StackedBarChart.Bars data={selectedDataTransformed.values ?? []} maxValue={130} xAxisStep={10} scale={1.0} />
            <div className="absolute right-0 top-0 flex flex-col gap-1">
              <GroupFilter onSelectGroup={setSelectedGroup} data={transformedThinking} />
            </div>
          </StackedBarChart>
        </div>
      </div>
      {/* Insights Box */}
      <div className="bg-[#d7d2e7] flex items-center px-2 flex-grow break-words mt-4 ml-2">
        <div className="px-10 py-6 text-black w-full">
          <strong>INSIGHTS:</strong> {insights?.decisionsGroupData ?? 'Unable to generate insights'}
        </div>
      </div>
    </div>
  );
};

export default GroupDynamicsView;

import { useState } from "react";
import StackedBarChart from "../color-bar-charts/stackedBarChart";
import GroupFilter from "../selection/GroupFilter";
import { Card } from '@/components/components/ui/card';
import { Typography } from '@/components/components/ui/typography';

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
    <Card className="w-full p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-8">
        {/* Charts Section */}
        <div className="w-full">
          <div className="relative">
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
            <div className="flex items-center gap-2 mt-8">
              <Typography variant="h5" className="font-bold text-black">
                Diversity of Thinking (By Group):
              </Typography>
              <Typography variant="h5" className="font-bold text-primary">
                {selectedGroup}
              </Typography>
            </div>
            <div className="relative mt-8">
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
        </div>
        {/* Insights Section */}
        <div className="bg-[#d7d2e7] flex items-center px-10 py-6 rounded-md mt-4">
          <Typography variant="body1" className="text-black">
            <strong>INSIGHTS:</strong> {insights?.decisionsGroupData ?? 'Unable to generate insights'}
          </Typography>
        </div>
      </div>
    </Card>
  );
};

export default GroupDynamicsView;

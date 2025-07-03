import React, { useState } from 'react'
import TabSelector from '../tapSecondSelector'
import ParticipationRate from '../participationRate'
import RadialPerformanceChart from '../radialPerformanceChart'
import StakeholderCards from '../stakeholderCard'
import DiversityCard from '../diversityCard'
import DecisionProfilesContainer from '../profile/DecisionProfilesContainer';
import DonutChart from '../donut-charts/DonutChart'
import { Card } from '@/components/components/ui/card';
import { Typography } from '@/components/components/ui/typography';

// Types
type TabKeys =
  | 'Decision Profiles'
  | 'Participation Metrics'
  | 'Group Metrics'
  | 'Inclusivity'

type PerformanceListProps = {
  data: {
    TopPerformingCrowds: { crowdName: string }[]
    HighParticipation: { userName: string }[]
    LowParticipation: { userName: string }[]
  }
}


type EngagedViewProps = {
  participationRateData: {
    label: string
    value: number
    color: string
  }[]
  stackedBarData: {
    group: string
    values: number[]
    total: number
    labels: string[]
  }[]
  radialPerformanceChartData: {
    label: string
    percentage: number
    votes: string
    color: string
    radius: number
  }[]

  stakeholdersData: (
    | {
      name: string
      title: string
      participation: number
      image: string
    }
    | {
      name: string
      participation: null
      image: null
      title?: undefined
    }
  )[]

  decisionData: {
    name: string
    value: number
    color: string
  }[]

  decisionStyleThinking: any
  decisionGroups: any
  // engagementData:any

  diversityData: any
  donutData: any
  participationRateSummary: any
  insights: any
}

// Performance List Component
const PerformanceList: React.FC<PerformanceListProps> = ({ data }) => (
  <div>
    <div className="mb-6">
      <Typography className="font-normal text-base">
        <strong>Panel Participation:</strong> Top Panels
      </Typography>
      <ul className="list-disc pl-6">
        {data.TopPerformingCrowds.map((item, index) => (
          <li key={index}>{item.crowdName}</li>
        ))}
      </ul>
    </div>

    <div className="mb-6">
      <Typography className="font-normal text-base">
        <strong>Voter Participation:</strong> Top Performers
      </Typography>
      <ul className="list-disc pl-6">
        {data.HighParticipation.map((item, index) => (
          <li key={index}>{item.userName}</li>
        ))}
      </ul>
    </div>

    <div className="mb-6">
      <Typography className="font-normal text-base">
        <strong>Low Participation Alert:</strong>
      </Typography>
      <ul className="list-disc pl-6">
        {data.LowParticipation.map((item, index) => (
          <li key={index}>{item.userName}</li>
        ))}
      </ul>
    </div>
  </div>
)

// Main Component
const EngagedView: React.FC<EngagedViewProps> = props => {
  const [selectedTab, setSelectedTab] = useState<TabKeys>('Decision Profiles')

  const data = [
    { name: "A", value: 20, color: "#0088FE" },
    { name: "B", value: 35, color: "#00C49F" },
    { name: "C", value: 25, color: "#FFBB28" },
    { name: "D", value: 15, color: "#FF8042" },
    { name: "Treatment", value: 5, color: "#FF0000" },
  ];

  // Extract internal and external data arrays safely
  const internalData = props.donutData?.internal || [];
  const externalData = props.donutData?.external || [];

  // Calculate total questions from both internal and external data
  const totalInternalQuestions = internalData.reduce((sum: number, item: any) => sum + item.value, 0);
  const totalExternalQuestions = externalData.reduce((sum: number, item: any) => sum + item.value, 0);
  const totalQuestions = totalInternalQuestions + totalExternalQuestions;

  // Combine and aggregate data by category name
  const combinedCategories: { [key: string]: { name: string; value: number; color: string } } = {};

  // Process internal data
  internalData.forEach((item: any) => {
    if (!combinedCategories[item.name]) {
      combinedCategories[item.name] = {
        name: item.name,
        value: 0,
        color: item.color
      };
    }
    combinedCategories[item.name].value += item.value;
  });

  // Process external data
  externalData.forEach((item: any) => {
    if (!combinedCategories[item.name]) {
      combinedCategories[item.name] = {
        name: item.name,
        value: 0,
        color: item.color
      };
    }
    combinedCategories[item.name].value += item.value;
  });

  // Convert to array and sort to get top categories
  const topCategories = Object.values(combinedCategories)
    .sort((a, b) => b.value - a.value)
    .filter(category => category.value > 0)
    .slice(0, 5);

  const findLowestCategory = (data: any[]) => {
    if (!data || data.length === 0) return null;
    const nonZeroData = data.filter((item: any) => item.value > 0);
    if (nonZeroData.length === 0) {
      return data.length > 0 ? data[0].name : null;
    }
    return nonZeroData.reduce(
      (min: any, item: any) => (item.value < min.value ? item : min),
      nonZeroData[0]
    ).name;
  };

  const lowestInternalCategory = findLowestCategory(props.donutData?.internal || []);
  const lowestExternalCategory = findLowestCategory(props.donutData?.external || []);

  return (
    <div className="w-full">
      <TabSelector
        options={['Decision Profiles', 'Participation Metrics', 'Inclusivity']}
        onSelect={tab => setSelectedTab(tab as TabKeys)}
      />
      <div className='p-4 border rounded-b-xs mb-2.5'>
        {selectedTab === 'Decision Profiles' && (
          <DecisionProfilesContainer decisionData={props.decisionData} insights={props.insights} decisionGroups={props.decisionGroups} decisionStyleThinking={props.decisionStyleThinking} />
        )}

      {selectedTab === 'Participation Metrics' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Engagement at a Glance */}
            <Card className="flex-1 bg-white flex flex-col p-6 relative">
              <Typography variant="h6" className="mb-2">Engagement at a Glance</Typography>
              <div className="flex items-center justify-center flex-grow w-full h-full">
                {/* Left side - Donut charts */}
                <div className="flex flex-col gap-8 w-1/2 h-full">
                  <div className="relative w-[280px] h-[163px]">
                    <DonutChart
                      data={props.donutData['internal']}
                      donutSize={85}
                      dataGap={0}
                      highlightName={lowestInternalCategory}
                    >
                      <text
                        fontSize="12"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#555"
                      >
                        Internal
                      </text>
                    </DonutChart>
                  </div>
                  <div className="relative w-[280px] h-[163px]">
                    <DonutChart
                      data={props.donutData['external']}
                      donutSize={85}
                      dataGap={0}
                      highlightName={lowestExternalCategory}
                    >
                      <text
                        fontSize="12"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#555"
                      >
                        External
                      </text>
                    </DonutChart>
                  </div>
                </div>
                {/* Right side - Types of Questions */}
                <div className="flex flex-col items-center w-1/2">
                  <Typography variant="h2" className="font-bold mb-0">{totalQuestions}</Typography>
                  <Typography className="text-xs text-center mb-2">
                    Number of<br />Questions asked
                  </Typography>
                  <Typography variant="body1" className="font-bold mb-1">Types of Questions</Typography>
                  <div className="flex flex-col gap-1 pl-12">
                    {topCategories.map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span style={{ width: 12, height: 12, backgroundColor: category.color, display: 'inline-block', borderRadius: 2 }} />
                        <Typography className="text-xs">{category.name} ({category.value})</Typography>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-[#E6E1F9] p-2 rounded mt-auto">
                <Typography className="text-sm">
                  <strong>INSIGHTS:</strong> {props.insights?.stackedData ?? 'Unable to generate insights'}
                </Typography>
              </div>
            </Card>
            {/* Participation Rate */}
            <Card className="flex-1 bg-white flex flex-col p-6 relative">
              <Typography variant="h6" className="mb-2">Participation Rate</Typography>
              <div className="flex items-center justify-center flex-grow w-full h-full">
                <ParticipationRate data={props.participationRateData as any[]} />
              </div>
              <div className="bg-[#E6E1F9] p-2 rounded mt-auto">
                <Typography className="text-sm">
                  <strong>INSIGHTS:</strong> {props.insights?.participation ?? 'Unable to generate insights'}
                </Typography>
              </div>
            </Card>
          </div>
          {/* Performance by Group */}
          <Card className="mt-4">
            <Typography variant='h5' className="pl-2 font-bold mb-5">
              Average Performance by Group
            </Typography>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex items-center justify-center py-6">
                <RadialPerformanceChart data={props.radialPerformanceChartData} />
              </div>
              <div className="flex-1 flex items-center justify-center py-6">
                <PerformanceList data={props.participationRateSummary} />
              </div>
            </div>
            <StakeholderCards data={props.stakeholdersData} />
          </Card>
        </div>
      )}

      {selectedTab === 'Inclusivity' && (
        <div className="flex flex-col gap-4">
          <DiversityCard data={props.diversityData} />
          <div className="bg-[#d7d2e7] flex items-center px-4 py-6 rounded-md mt-6">
            <Typography className="pl-2">
              <strong>INSIGHTS:</strong> {props.insights?.diversity ?? 'Unable to generate insights'}
            </Typography>
          </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EngagedView

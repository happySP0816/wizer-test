'use client'
import React, { useState } from 'react'

import TabSelector from '../tapSecondSelector'
import ParticipationRate from '../participationRate'
import RadialPerformanceChart from '../radialPerformanceChart'
import ParticipationPanel from '../ParticipationPanelChart'
import StakeholderCards from '../stakeholderCard'
import EngagementCard from '../engagementCard'
import DiversityCard from '../diversityCard'
import DecisionProfilesContainer from '../../views/DecisionProfilesContainer';
import ParticipationView from '../../views/ParticipationView'
import DonutChart from '../donut-charts/DonutChart'

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

type DonutDataItem = { name: string; value: number; color: string };

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
  diversityData: any
  donutData: {
    internal: DonutDataItem[];
    external: DonutDataItem[];
  }
  participationRateSummary: any
  insights: any
}

// Performance List Component
const PerformanceList: React.FC<PerformanceListProps> = ({ data }) => (
  <div>
    <div className="mb-6">
      <div className="mb-4 font-normal text-base"><strong>Panel Participation:</strong> Top Panels</div>
      <ul className="pl-4 list-disc text-sm">
        {data.TopPerformingCrowds.map((item, index) => (
          <li key={index}>{item.crowdName}</li>
        ))}
      </ul>
    </div>
    <div className="mb-6">
      <div className="mb-4 font-normal text-base"><strong>Voter Participation:</strong> Top Performers</div>
      <ul className="pl-4 list-disc text-sm">
        {data.HighParticipation.map((item, index) => (
          <li key={index}>{item.userName}</li>
        ))}
      </ul>
    </div>
    <div className="mb-6">
      <div className="mb-4 font-normal text-base"><strong>Low Participation Alert:</strong></div>
      <ul className="pl-4 list-disc text-sm">
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
  const internalData: DonutDataItem[] = props.donutData?.internal || [];
  const externalData: DonutDataItem[] = props.donutData?.external || [];
  
  // Calculate total questions from both internal and external data
  const totalInternalQuestions = internalData.reduce((sum: number, item: DonutDataItem) => sum + item.value, 0);
  const totalExternalQuestions = externalData.reduce((sum: number, item: DonutDataItem) => sum + item.value, 0);
  const totalQuestions = totalInternalQuestions + totalExternalQuestions;
  
  // Combine and aggregate data by category name
  const combinedCategories: { [key: string]: { name: string; value: number; color: string } } = {};
  
  // Process internal data
  internalData.forEach((item: DonutDataItem) => {
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
  externalData.forEach((item: DonutDataItem) => {
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

  const findLowestCategory = (data: DonutDataItem[]) => {
    if (!data || data.length === 0) return null;
    const nonZeroData = data.filter((item: DonutDataItem) => item.value > 0);
    if (nonZeroData.length === 0) {
      return data.length > 0 ? data[0].name : null;
    }
    return nonZeroData.reduce(
      (min: DonutDataItem, item: DonutDataItem) => (item.value < min.value ? item : min),
      nonZeroData[0]
    ).name;
  };

  const lowestInternalCategory = findLowestCategory(props.donutData?.internal || []);
  const lowestExternalCategory = findLowestCategory(props.donutData?.external || []);

  return (
    <div>
      <TabSelector
        options={['Decision Profiles', 'Participation Metrics', 'Inclusivity']}
        onSelect={tab => setSelectedTab(tab as TabKeys)}
      />

      {selectedTab === 'Decision Profiles' && (
        <div className="flex flex-col gap-4">
          <div className="flex-1 border border-[#d7d2e7] flex flex-col justify-between bg-white p-7">
            <DecisionProfilesContainer decisionData={props.decisionData} insights={props.insights} decisionGroups={props.decisionGroups} decisionStyleThinking={props.decisionStyleThinking} />
          </div>
        </div>
      )}

      {selectedTab === 'Participation Metrics' && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-row md:flex-col">
            {/* Left Panel */}
            <div className="flex-1 bg-white border border-[#d7d2e7] flex flex-col p-6 relative">
              <div className="font-bold text-lg mb-2">Engagement at a Glance</div>
              <div className="flex items-center justify-center flex-grow w-full h-full relative">
                {/* Left side - Donut charts */}
                <div className="flex flex-col gap-16 w-1/2 h-full">
                  <div className="relative w-[280px] h-[163px]">
                    <DonutChart 
                      data={props.donutData['internal']} 
                      donutSize={85} 
                      dataGap={0}
                      highlightName={lowestInternalCategory ?? undefined}
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
                      highlightName={lowestExternalCategory ?? undefined}
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
                  <div className="font-bold text-3xl mb-0">{totalQuestions}</div>
                  <div className="text-xs text-center mb-2">
                    Number of<br />Questions asked
                  </div>
                  <div className="font-bold text-base mb-1">Types of Questions</div>
                  <div className="flex flex-col gap-1 pl-12">
                    {topCategories.map((category, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <span className="inline-block" style={{ width: 12, height: 12, backgroundColor: category.color }} />
                        <span className="text-xs">{category.name} ({category.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-[#E6E1F9] p-2 rounded mt-auto flex items-center">
                <span className="text-sm"><strong>INSIGHTS:</strong> {props.insights?.stackedData ?? 'Unable to generate insights'}</span>
              </div>
            </div>
            {/* Right Panel - Participation Rate */}
            <div className="flex-1 bg-white border border-[#d7d2e7] flex flex-col p-6 relative">
              <div className="font-bold text-lg mb-2">Participation Rate</div>
              <div className="flex items-center justify-center flex-grow w-full h-full relative">
                <ParticipationRate data={props.participationRateData} />
              </div>
              <div className="bg-[#E6E1F9] p-2 rounded mt-auto flex items-center">
                <span className="text-sm"><strong>INSIGHTS:</strong> {props.insights?.participation ?? 'Unable to generate insights'}</span>
              </div>
            </div>
          </div>
          <div className="border border-[#d7d2e7] min-h-[400px] p-4">
            <div className="font-bold text-xl pl-2 mb-5">Average Performance by Group</div>
            <div className="flex flex-row gap-4 md:flex-col">
              <div className="flex-1 flex justify-center items-center h-full w-full pt-[6%]">
                <RadialPerformanceChart data={props.radialPerformanceChartData} />
              </div>
              <div className="flex-1 flex justify-center items-center h-full w-full">
                <PerformanceList data={props.participationRateSummary} />
              </div>
            </div>
            <StakeholderCards data={props.stakeholdersData} />
          </div>
        </div>
      )}

      {selectedTab === 'Inclusivity' && (
        <div className="flex flex-col gap-4">
          <div className="flex-1 border border-[#d7d2e7] flex flex-col bg-white p-7">
            <DiversityCard data={props.diversityData} />
            <div className="bg-[#d7d2e7] flex items-center px-2 flex-grow word-break break-words mt-4">
              <span className="pl-2"><strong>INSIGHTS:</strong> {props.insights?.diversity ?? 'Unable to generate insights'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EngagedView

import { useState } from 'react'
import type { IStatsViewCardProps, IStatsViewProps, TabKeys } from '../engagementTypes'
import TabSelector from '../tapSelector'
import StatsViewCard from '../statsViewCard'

type StatsViewProps = {
  data: Record<TabKeys, any>
  onTabChange: (tab: TabKeys) => void
  selectedTab: TabKeys
  loading: boolean
}

const StatsView = ({ data, selectedTab, onTabChange, loading }: StatsViewProps) => {
  const currentTabData = data[selectedTab] || {}
  const summary = currentTabData.summary || {}

  const statsData: IStatsViewCardProps[] = [
    {
      title: 'QUESTIONS',
      data: summary.questionsAsked?.toString() || '0',
      explaination: 'questions asked'
    },
    {
      title: 'STAKEHOLDERS',
      data: summary.totalMembers?.toString() || '0',
      explaination: 'number of people onboarded',
    },
    {
      title: 'PARTICIPATION RATE',
      data: summary.participationRate?.toString() || '0%',
      explaination: '% of People Engaged',
      hints: `This is the total percentage of people over this period`
    },
    {
      title: 'RECOMMENDATIONS',
      data: summary.recommendations?.toString() || '0',
      explaination: '# of recommendations',
      hints: `This is total recommendations over this period`
    }
  ]
  
  return (
    <div>
      <TabSelector 
        options={['All', 'Year', 'Quarter', 'Month']} 
        onSelect={tab => onTabChange(tab as TabKeys)}
        selectedTab={selectedTab}
      />
      <div className="flex justify-around mt-6 w-full flex-wrap gap-6 sm:flex-col sm:gap-3">
        {statsData.map((stats, idx) => (
          <div key={idx} className="flex-1 mx-2 min-w-[200px]">
            <StatsViewCard {...stats} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsView
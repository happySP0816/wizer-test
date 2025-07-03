import type { IStatsViewCardProps, TabKeys } from '../engagementTypes'
import TabSelector from '../tapSelector'
import StatsViewCard from '../statsViewCard'

type StatsViewProps = {
  data: Record<TabKeys, any>
  onTabChange: (tab: TabKeys) => void
  selectedTab: TabKeys
  loading: boolean
}

const StatsView = ({ data, selectedTab, onTabChange }: StatsViewProps) => {
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
    <div className='flex flex-col gap-4'>
      <TabSelector 
        options={['All', 'Year', 'Quarter', 'Month']} 
        onSelect={tab => onTabChange(tab as TabKeys)}
        selectedTab={selectedTab}
      />
      <div className="flex flex-wrap justify-around items-start w-full gap-8 flex-row">
        {statsData.map((stats, idx) => (
          <div key={idx} className="flex-1 min-w-[220px] flex items-center justify-center">
            <StatsViewCard {...stats} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsView
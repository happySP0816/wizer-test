import React from 'react'
import RadialPerformanceChart from '../radialPerformanceChart'
import StakeholderCards from '../stakeholderCard'

// Types
type PerformanceViewProps = {
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
}

const PerformanceView = (props: PerformanceViewProps) => {
  const PerformanceList = () => {
    return (
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <div className="mb-2 font-normal text-base">
            <strong>Correct Decisions</strong> Top Performers
          </div>
          <ul className="pl-4 list-disc text-sm">
            <li>xxx</li>
            <li>xxx</li>
            <li>xxx</li>
          </ul>
        </div>
        <div className="mb-6">
          <div className="mb-2 font-normal text-base">
            <strong>Voter Participation</strong> Top Performers
          </div>
          <ul className="pl-4 list-disc text-sm">
            <li>xxx</li>
            <li>xxx</li>
            <li>xxx</li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-bold text-base">Low Participation Alert</div>
          <ul className="pl-4 list-disc text-sm">
            <li>xxx</li>
            <li>xxx</li>
            <li>xxx</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 border border-[#d7d2e7]">
      <div className="text-lg font-bold mb-5">Average Performance by Team</div>
      <div className="flex gap-8 mt-2">
        {/* Left: Radial Chart */}
        <RadialPerformanceChart data={props.radialPerformanceChartData} />
        {/* Right: Top Performers List */}
        <PerformanceList />
      </div>
      <StakeholderCards data={props.stakeholdersData} />
    </div>
  )
}

export default PerformanceView
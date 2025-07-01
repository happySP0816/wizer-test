'use client'

import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { Button } from '@/components/components/ui/button'
import StatsView from './components/stats/statsView'
import EngagedView from './components/engage/engagedView'
import { getCompanyAnalyticsReport, getCompanyInsights } from '@/apis/company-profile'
import type { IStatsViewProps, TabKeys } from './components/engagementTypes'

const CompanyProfileScreen: FC<any> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)
  const [selectedTab, setSelectedTab] = useState<TabKeys>('All')
  const [insightsLoading, setInsightsLoading] = useState<boolean>(false)

  const fetchCompanyData = async (tab: TabKeys) => {
    setLoading(true)
    try {
      const tabKey = tab === 'All' ? '' : tab;
      const report = await getCompanyAnalyticsReport(props.user.small_decision.organization_id, tabKey)
      if (report) {
        const transformedReport = Object.fromEntries(
          Object.entries(report).map(([key, value]) => [
            key.charAt(0).toUpperCase() + key.slice(1),
            value
          ])
        )
        setData((prevData: any) => ({
          ...prevData,
          [tab]: transformedReport[tab]
        }))
        if (transformedReport[tab]) {
          fetchInsights(transformedReport[tab], tab)
        }
      } else {
        console.error('No report data available')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInsights = async (tabData: any, tab: TabKeys) => {
    setInsightsLoading(true)
    try {
      const insights = await getCompanyInsights(tabData)
      setData((prevData: any) => {
        if (!prevData || !prevData[tab]) return prevData;
        return {
          ...prevData,
          [tab]: {
            ...prevData[tab],
            insights: insights.insights
          }
        };
      });
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setInsightsLoading(false)
    }
  }

  useEffect(() => {
    if (!data || !(selectedTab in data)) {
      fetchCompanyData(selectedTab)
    }
  }, [selectedTab])

  const handleTabChange = (tab: TabKeys) => {
    setSelectedTab(tab)
  }

  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#5f4c9f] border-solid"></div>
      </div>
    )
  }

  return (
    <div className="relative px-12">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#5f4c9f] border-solid"></div>
        </div>
      )}
      <div className="flex justify-between items-center h-28 mb-12">
        <h2 className="text-[#5f4c9f] m-0 flex items-center h-full text-2xl font-bold">Your People</h2>
        <Button className="bg-[#5f4c9f] hover:bg-[#4a3b7d] text-white w-38 h-12 text-xs">BACK</Button>
      </div>
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold">An Overview of Primary Metrics for Stakeholder Engagement</h3>
      </div>
      <div className="mb-24">
        <StatsView 
          data={data} 
          selectedTab={selectedTab} 
          onTabChange={handleTabChange}
          loading={loading}
        />
      </div>
      {insightsLoading && (
        <div className="flex items-center mb-8 p-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-[#5f4c9f] border-solid mr-2"></div>
          <span className="text-sm">Loading insights...</span>
        </div>
      )}
      <div>
        {data[selectedTab] && (
          <EngagedView
            participationRateData={data[selectedTab].participationRateData}
            stackedBarData={data[selectedTab].stackedBarData}
            radialPerformanceChartData={data[selectedTab].radialPerformanceChartData}
            stakeholdersData={data[selectedTab].stakeholdersData}
            decisionData={data[selectedTab].decisionData}
            decisionStyleThinking={data[selectedTab].decisionStyleThinking}
            decisionGroups={data[selectedTab].decisionGroups}
            diversityData={data[selectedTab].diversityData}
            participationRateSummary={data[selectedTab].participationRateSummary}
            donutData={data[selectedTab].donutData}
            insights={data[selectedTab].insights}
          />
        )}
      </div>
    </div>
  )
}

export default CompanyProfileScreen
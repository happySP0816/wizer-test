import authRoute from '@/authentication/authRoute'
import { useEffect, useState } from 'react'
import StatsView from './components/stats/statsView'
import type { TabKeys } from './components/engagementTypes'
import EngagedView from './components/engage/engagedView'
import { getCompanyAnalyticsReport, getCompanyInsights } from '@/apis/company-profile'
import { Button } from '@/components/components/ui/button'
import { Typography } from '@/components/components/ui/typography'
import { WizerProfileIcon } from '@/components/icons'
import Loading from '@/components/loading'

const CompanyProfile = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<Record<TabKeys, any>>({} as Record<TabKeys, any>)
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
        setData(prevData => ({
          ...prevData,
          [tab]: transformedReport[tab]
        }))
        // Start insights fetch but don't block the UI
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
      setData(prevData => {
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

  if (!data || !data[selectedTab]) {
    return (
      <Loading />
    );
  }

  return (
    <div className="!h-screen p-[30px] flex flex-col gap-8">
      <div className="flex items-center justify-between flex-none">
        <div className='flex items-center justify-center'>
          <div className='mr-3 text-primary'>
            <WizerProfileIcon size={32} style={{ width: '32px', height: '32px' }} />
          </div>
          <Typography className="flex items-center text-4xl font-bold">
            Your People
          </Typography>
        </div>
        <div className='flex items-center gap-2'>
          <div className="flex gap-2">
            <Button className='rounded-4xl' onClick={() => window.history.back()}>
              BACK
            </Button>
          </div>
        </div>
      </div>
      <div className="p-0">
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <Typography variant="h3" className="font-semibold text-black">
                An Overview of Primary Metrics for Stakeholder Engagement
              </Typography>
            </div>
            <div className="col-span-12 mb-24">
              <StatsView
                data={data}
                selectedTab={selectedTab}
                onTabChange={handleTabChange}
                loading={loading}
              />
            </div>

            {insightsLoading && (
              <div className="col-span-12">
                <Loading className='h-5 w-5'>
                  <Typography variant="body2">Loading insights...</Typography>
                </Loading>
              </div>
            )}

            <div className="col-span-12">
              {data[selectedTab] && (
                <EngagedView
                  participationRateData={data[selectedTab].participationRateData}
                  stackedBarData={data[selectedTab].stackedBarData}
                  radialPerformanceChartData={data[selectedTab].radialPerformanceChartData}
                  stakeholdersData={data[selectedTab].stakeholdersData}
                  decisionData={data[selectedTab].decisionData}
                  decisionStyleThinking={data[selectedTab].decisionStyleThinking}
                  decisionGroups={data[selectedTab].decisionGroups}
                  // engagementData={data[selectedTab].engagementData}
                  diversityData={data[selectedTab].diversityData}
                  participationRateSummary={data[selectedTab].participationRateSummary}
                  donutData={data[selectedTab].donutData}
                  insights={data[selectedTab].insights}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default authRoute(CompanyProfile)
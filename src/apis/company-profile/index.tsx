import axios from 'src/services/interceptor'

export const getCompanyReport = async (orgId): Promise<any> => {
  const response = await axios.get<any>(
    `/org_Dashboard/get/company/report?organizationId=${orgId}`
  )

  return response.data
}

export const getCompanyInsights = async (body: any): Promise<any> => {
  const response = await axios.post(
    `/org_Dashboard/organization/insights/generate`, body
  )

  return response.data
}

export const getCompanyAnalyticsReport = async (orgId, timeframe): Promise<any> => {
  const formattedTimeframe = timeframe === '' ? "All" : timeframe?.toLowerCase();
  const response = await axios.get<any>(
    `/org_Dashboard/get/company/analytics?organizationId=${orgId}&timeframe=${formattedTimeframe}`
  )

  return response.data
}

export const getCompanyDecisionReport = async (orgId): Promise<any> => {
  const response = await axios.get<any>(
    `/org_Dashboard/get/company/decision-report?organizationId=${orgId}`
  )

  return response.data
}

export const getDeiWheel = async (orgId): Promise<any> => {
  const response = await axios.get<any>(
    `/org_Dashboard/get/organisation/diversity-data?organizationId=${orgId}`
  )
  return response.data
}
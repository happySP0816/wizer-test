import React from 'react'
import authRoute from '@/authentication/authRoute'
import CompanyProfileScreen from '@/pages/company-profile/company profile new'

const CompanyProfilePage: React.FC<any> = (props: any) => {
  // Mock data for each tab
  return <CompanyProfileScreen {...props} />
}

export default authRoute(CompanyProfilePage)
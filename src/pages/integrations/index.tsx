import React from 'react'
import authRoute from '@/authentication/authRoute'
import { Typography } from '@/components/components/ui/typography'


type UserProfileType = {
  username: string;
  id: number;
}

type MembershipType = {
  small_decision: { organization_id: number };
  member_role: string;
}

interface PanelsProps {
  userProfile: UserProfileType
  user: MembershipType
}

const Integration: React.FC<PanelsProps> = () => {
  return (
    <div className="!h-screen p-[30px] flex flex-col gap-8">
      <div className="flex items-center justify-between flex-none">
        <div className='flex items-center justify-center'>
          <Typography className="flex items-center text-4xl font-bold">
            Integration
          </Typography>
        </div>
      </div>
      <div className="p-6">
        developing....
      </div>
    </div>
  )
}

export default authRoute(Integration)

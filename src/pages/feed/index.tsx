import React, { useEffect, useState } from 'react'
import authRoute from '@/authentication/authRoute'
import { Typography } from '@/components/components/ui/typography'

type UserProfileType = {
  name: string;
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

const Feed: React.FC<PanelsProps> = (props) => {
  const [timeOfDay, setTimeOfDay] = useState('')
  const [iconUrl, setIconUrl] = useState('')

  useEffect(() => {
    const currentTime = new Date().getHours()
    if (currentTime >= 5 && currentTime < 12) {
      setTimeOfDay('morning')
      setIconUrl('/morning.svg')
    } else if (currentTime >= 12 && currentTime < 18) {
      setTimeOfDay('afternoon')
      setIconUrl('/noon.svg')
    } else {
      setTimeOfDay('evening')
      setIconUrl('/moon.svg')
    }
  }, [])

  return (
    <div className="!h-screen p-[30px] flex flex-col gap-8">
      <div className="flex items-center justify-between flex-none">
        <div className='flex items-center justify-center'>
          <Typography className="flex items-center text-4xl font-bold">
            {iconUrl && <img src={iconUrl} alt="time" className="w-8 h-8 mr-4" />}
            Good {timeOfDay},{' '}
            <span className="font-bold">&nbsp;{props.userProfile?.name || 'User'}</span>
          </Typography>
        </div>
      </div>
      <div className="p-6">
        developing....
      </div>
    </div>
  )
}

export default authRoute(Feed)

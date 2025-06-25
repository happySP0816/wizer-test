import React from 'react'
import { Card, CardContent } from '@/components/components/ui/card'
import { Typography } from '@/components/components/ui/typography'
import { cn } from '@/components/lib/utils'
import UserAvatar from '@/components/UserAvatar'

interface UserProfileProps {
  image?: string
  name: string
  id: string
  bio?: string
}

const UserProfile: React.FC<UserProfileProps> = ({ image, name, bio }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-x-4">
          <div className="flex-shrink-0">
            <UserAvatar 
              user={{ image, name }}
              size="lg"
              className="w-16 h-16"
            />
          </div>
          <br/>
          <div className="flex-1 min-w-0">
            <Typography variant="h6" className="font-semibold text-gray-900 truncate">
              {name}
            </Typography>
            {bio && (
              <Typography variant="body2" className="text-gray-600 mt-1">
                {bio}
              </Typography>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfile 
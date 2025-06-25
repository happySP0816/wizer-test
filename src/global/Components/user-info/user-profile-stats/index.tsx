import React from 'react'
import { Card, CardContent } from '@/components/components/ui/card'
import { Typography } from '@/components/components/ui/typography'

interface UserProfileStatsProps {
  numberOfPosts: number
  numberOfFollowers: number
  numberOfFriends: number
  numberOfFollowing: number
}

const UserProfileStats: React.FC<UserProfileStatsProps> = ({
  numberOfPosts,
  numberOfFollowers,
  numberOfFriends,
  numberOfFollowing
}) => {
  const stats = [
    { label: 'Posts', value: numberOfPosts },
    { label: 'Followers', value: numberOfFollowers },
    { label: 'Friends', value: numberOfFriends },
    { label: 'Following', value: numberOfFollowing }
  ]

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <Typography variant="h6" className="font-bold text-gray-900">
                {stat.value}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfileStats 
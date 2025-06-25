import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/components/ui/card'
import { Typography } from '@/components/components/ui/typography'
import { Progress } from '@/components/components/ui/progress'

interface UserProfile {
  id: string
  name: string
  username: string
  image?: string
  bio?: string
  numberOfPosts: number
  numberOfFollowers: number
  numberOfFriends: number
  numberOfFollowing: number
}

interface YourDecisionMakingProps {
  userProfile: UserProfile
}

const YourDecisionMaking: React.FC<YourDecisionMakingProps> = ({ userProfile }) => {
  const decisionProfile = {
    analytical: 85,
    intuitive: 72,
    collaborative: 68,
    decisive: 91
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <Typography variant="h5" className="font-semibold">
          Decision Profile
        </Typography>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Typography variant="body2" className="font-medium">
                Analytical Thinking
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {decisionProfile.analytical}%
              </Typography>
            </div>
            <Progress value={decisionProfile.analytical} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Typography variant="body2" className="font-medium">
                Intuitive Decision Making
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {decisionProfile.intuitive}%
              </Typography>
            </div>
            <Progress value={decisionProfile.intuitive} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Typography variant="body2" className="font-medium">
                Collaborative Approach
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {decisionProfile.collaborative}%
              </Typography>
            </div>
            <Progress value={decisionProfile.collaborative} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Typography variant="body2" className="font-medium">
                Decisiveness
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {decisionProfile.decisive}%
              </Typography>
            </div>
            <Progress value={decisionProfile.decisive} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default YourDecisionMaking 
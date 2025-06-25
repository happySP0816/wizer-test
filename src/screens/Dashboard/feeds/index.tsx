import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/components/ui/card'
import { Typography } from '@/components/components/ui/typography'
import { Button } from '@/components/components/ui/button'
import UserAvatar from '@/components/UserAvatar'
import type { Post, Invite } from '@/apis/dashboard'

interface FeedsProps {
  invite: Invite
  post: Post
  image: string
  backgroundimage: string
}

const Feeds: React.FC<FeedsProps> = ({ invite, post, image, backgroundimage }) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <UserAvatar 
            user={{ image, name: post.owner.name }}
            size="md"
          />
          <div>
            <Typography variant="h6" className="font-semibold">
              {post.owner.name}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Typography variant="h6" className="font-semibold mb-2">
          {post.title}
        </Typography>
        <Typography variant="body2" className="text-gray-600 mb-4">
          {post.content}
        </Typography>
        {backgroundimage && (
          <div className="mb-4">
            <img
              src={backgroundimage}
              alt="Post media"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button size="sm">
            Respond
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Feeds 
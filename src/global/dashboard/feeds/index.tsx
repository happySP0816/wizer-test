import React from 'react'
import { Card, CardContent } from '@/components/components/ui/card'
import { Typography } from '@/components/components/ui/typography'
import type { Post, Invite } from '@/apis/dashboard'
import moment from 'moment'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar'

interface FeedsProps {
  invite: Invite
  post: Post
  image: string
}

const notificationTitles: Record<string, string> = {
  post_invite_notification: ` invited you to vote on a decision. `,
  post_feedback_notification: 'Please provide feedback for your decision. ',
  friend_request_notification: ' friend request.',
  post_vote_notification: ' voted on your decision. ',
  new_post_comment_notification: "commented on your decision. "
}

const Feeds: React.FC<FeedsProps> = ({ invite, post, image }) => {
  const getAvatarName = (username: string | undefined): string => {
    if (!username) return ''
    const names = username.split(' ')
    if (names.length >= 2) {
      const initials = names.map(name => name.charAt(0)).join(' ')

      return initials.toUpperCase()
    }
    
    return names[0].charAt(0).toUpperCase()
  }
  return (
    <Card className="hover:shadow-md transition-shadow border border-[#767676]">
      <div className="px-4 py-1.5">
        <div className="flex items-right justify-end space-x-3">
          <Typography className='text-[10px] font-bold text-primary text-right'>
            {moment(parseInt(invite.createdAt)).format('D MMMM YYYY')}
          </Typography>
          <Typography className='text-[10px] font-bold text-[#767676] text-right'>
            {moment(parseInt(invite.createdAt)).format('h:mma')}
          </Typography>
        </div>
      </div>
      <CardContent className='flex items-start !pl-5 gap-2'>
        <Avatar 
          className='feedUserImage w-10 h-10'
        >
          <AvatarImage src={image} alt="@shadcn" />
          <AvatarFallback>
            {getAvatarName(invite.from?.user?.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <span className="text-primary font-semibold mb-2 break-words text-sm">
            {invite?.from?.user?.name || invite?.postComment?.from?.user?.name || invite?.voteFrom?.user?.name || invite?.friendRequest?.from?.user?.name || invite?.friendRequest?.from?.user?.username}
          </span>{' '}
          <span className='text-black text-sm'>
            {notificationTitles[(invite as any).type] || ''}{' '}
          </span>
          {post?.question && (
            <span 
              className='text-sm text-black font-normal italic break-words'
            >
              {'"' + post.question + '"'}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default Feeds 
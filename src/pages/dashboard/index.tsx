import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/components/ui/dialog'
import { Typography } from '@/components/components/ui/typography'
import Feeds from '@/global/dashboard/feeds'
import { getAllPostForFeed, getFetchPostId } from '@/apis/dashboard'
import type { Invite, Post } from '@/apis/dashboard'
import YourDecisionMaking from '@/global/dashboard/YourDecisionMaking'
import { UserCategories, UserProfile, UserProfileStats } from '@/global/user-info'
import authRoute from '@/authentication/authRoute'

interface UserProfileType {
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

interface DashboardProps {
  userProfile?: UserProfileType
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [isWizerOpen, setIsWizerOpen] = useState(false)
  const [isOrganizationOpen, setIsOrganizationOpen] = useState(false)
  const [invitePostData, setInvitePostData] = useState<Array<{ invite: Invite; post: Post | null }> | null>(null)
  const [timeOfDay, setTimeOfDay] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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

  const notificationCount = useCallback(async () => {
    setIsLoading(true)
    const postIds = new Set()
    try {
      const response = await getFetchPostId(35)

      response.forEach((item: any) => {
        if (item.postId) {
          postIds.add(item.postId)
        }
        if (item.postFeedback && item.postFeedback.postId) {
          postIds.add(item.postFeedback.postId)
        }
      })
      const fetchedData = []

      for (const postId of postIds) {
        try {
          const data = await getAllPostForFeed(postId as string)
          fetchedData.push(data)
        } catch (error) {
          // console.error(`Error fetching data for postId ${postId}:`, error)
        }
      }

      const postMap: Record<string, Post> = {}
      fetchedData.forEach(post => {
        postMap[post.id] = post
      })
      const organizedData = response?.map((item: any) => ({
        invite: item,
        post: (item?.postId && postMap[item.postId]) || (item?.postFeedback?.postId && postMap[item.postFeedback.postId]) || null
      }))
      // console.log('organizedData', organizedData)
      setInvitePostData(organizedData)
    } catch (error) {
      // console.error('Error fetching postIds:', error)
    } finally {
      setIsLoading(false)
    }
  }, [getFetchPostId, getAllPostForFeed])

  useEffect(() => {
    notificationCount()
  }, [notificationCount])

  const totalNotifcations = invitePostData?.filter(({ post, invite }) => post !== null && invite.status !== 'read')

  return (
    <div className="min-h-screen p-[30px] flex flex-col gap-8">
      <div className="flex items-center justify-between flex-none">
        <Typography className="flex items-center text-4xl font-bold">
          {iconUrl && <img src={iconUrl} alt="time" className="w-8 h-8 mr-4" />}
          Good {timeOfDay},{' '}
          <span className="font-bold">&nbsp;{props.userProfile?.name || 'User'}</span>
        </Typography>
        <div className="flex gap-2">
          <Button className='bg-[#0084CE] hover:bg-[#0084CE]/90 rounded-4xl' onClick={() => setIsWizerOpen(true)}>
            Join the Wizer Community
          </Button>
          <Button className='bg-[#0084CE] hover:bg-[#0084CE]/90 rounded-4xl' onClick={() => setIsOrganizationOpen(true)}>
            Add your Organization
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        <div className="md:col-span-8 col-span-12 flex flex-col h-full w-full gap-8">
          {/* profile section */}
          <div className='flex-none'>
            <Typography variant="h6" className="mb-2.5 font-bold">
              YOUR DECISION PROFILE
            </Typography>
            {props.userProfile && <YourDecisionMaking userProfile={props.userProfile} />}
          </div>
          {/* notification section */}
          <div className='flex-1'>
            <Typography variant="h6" className="mb-2.5 font-bold">
              NOTIFICATION FEED
            </Typography>
            <div className='flex flex-col gap-2.5'>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <span>Loading...</span>
                </div>
              ) : invitePostData && totalNotifcations && totalNotifcations.length > 0 ? (
                invitePostData.map(({ invite, post }) => {
                  const feedPostId = post?.id
                  const notificationId = invite?.id
                  let image = post?.owner?.image || ''
                  if (image && !image.startsWith('http://') && !image.startsWith('https://') && !image.startsWith('ftp://')) {
                    image = `https://api.wizer.life/api/users/${image}`
                  }
                  if (invite.status === 'read') {
                    return null
                  }

                  return (
                    <div
                      key={`${notificationId}-${feedPostId}`}
                      onClick={() => console.log("")}
                    >
                      <Feeds invite={invite} post={post!} image={image} />
                    </div>
                  )
                })
              ) : (
                <div className="flex justify-center items-center py-8">
                  <Typography variant='h5' className='text-black text-center'>
                    You are all caught up.
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:col-span-4 col-span-12">
          <Typography variant="h6" className="mb-2.5 font-bold">PROFILE</Typography>
          {props.userProfile && (
            <div className="bg-white rounded-lg border p-4 flex flex-col items-center justify-center relative gap-9">
              <UserProfile image={props.userProfile.image} name={props.userProfile.name} bio={props.userProfile.bio} />
              <UserCategories userId={props.userProfile.id} />
              <UserProfileStats
                numberOfPosts={props.userProfile.numberOfPosts}
                numberOfFollowers={props.userProfile.numberOfFollowers}
                numberOfFriends={props.userProfile.numberOfFriends}
                numberOfFollowing={props.userProfile.numberOfFollowing}
              />
            </div>
          )}
        </div>
      </div>
      <Dialog open={isWizerOpen} onOpenChange={setIsWizerOpen}>
        <DialogContent>
          <DialogTitle>Coming Soon!</DialogTitle>
          <DialogDescription>
            Your decision profile will be certified and you will be rewarded for helping organizations make decisions.
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Dialog open={isOrganizationOpen} onOpenChange={setIsOrganizationOpen}>
        <DialogContent>
          <DialogTitle>Add Your Organization</DialogTitle>
          <DialogDescription>
            Add your Organization so your teams can see their Decision Profiles in action.
            <div className="mt-4 flex flex-col items-center">
              <Button className="mb-2" onClick={() => setIsOrganizationOpen(false)}>
                Add
              </Button>
              <Button variant="link" onClick={() => setIsOrganizationOpen(false)}>
                Click here
              </Button>
              <span className="text-xs text-gray-500">if your company already has an account.</span>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default authRoute(Dashboard)

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/components/ui/dialog'
import { Typography } from '@/components/components/ui/typography'
import Feeds from '@/screens/Dashboard/feeds'
import { getAllPostForFeed, getFetchPostId, getUserProfile, getCurrentUserProfile } from '@/apis/dashboard'
import type { Invite, Post } from '@/apis/dashboard'
import YourDecisionMaking from '@/screens/Dashboard/YourDecisionMaking'
import { UserCategories, UserProfile, UserProfileStats } from '@/global/Components/user-info'
import { getNotifications, getUserNotifications, markAllNotificationsAsRead, getUnreadNotificationsCount } from '@/apis/notifications'
import type { Notification } from '@/apis/notifications'
import NotificationItem from '@/components/notifications/NotificationItem'

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

const Dashboard: React.FC = () => {
  const [isWizerOpen, setIsWizerOpen] = useState(false)
  const [isOrganizationOpen, setIsOrganizationOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  const fetchNotifications = async () => {
    try {
      // Try to get notifications for current user first
      let notificationsData = await getNotifications()
      
      // If no notifications from current user endpoint, try user-specific endpoint
      if (!notificationsData || notificationsData.length === 0) {
        const userId = userProfile?.id || sessionStorage.getItem('userId')
        if (userId) {
          notificationsData = await getUserNotifications(userId)
        }
      }
      
      setNotifications(notificationsData || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setNotifications([])
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setProfileError(null)
      
      try {
        // Try to get user data from session storage first
        const storedUser = sessionStorage.getItem('user')
        let profile: UserProfileType | null = null
        
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            profile = {
              id: userData.id || sessionStorage.getItem('userId') || '',
              name: userData.name || userData.username || 'User',
              username: userData.username || userData.name || 'user',
              image: userData.image,
              bio: userData.bio || '',
              numberOfPosts: userData.numberOfPosts || 0,
              numberOfFollowers: userData.numberOfFollowers || 0,
              numberOfFriends: userData.numberOfFriends || 0,
              numberOfFollowing: userData.numberOfFollowing || 0
            }
          } catch (e) {
            console.log('Could not parse stored user data')
          }
        }
        
        if (!profile) {
          try {
            profile = await getCurrentUserProfile()
          } catch (e) {
            const userId = sessionStorage.getItem('userId')
            if (userId) {
              profile = await getUserProfile(userId)
            }
          }
        }
        
        if (profile) {
          setUserProfile(profile)
          await fetchNotifications()
        } else {
          setProfileError('Could not load user profile. Please try logging in again.')
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setProfileError('Failed to load dashboard data. Please check your connection and try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
    await fetchNotifications()
  }

  const handleNotificationUpdate = () => {
    fetchNotifications() 
  }

  const unreadNotifications = notifications.filter(n => n.status === 'unread')
  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <Typography variant="h6">Loading dashboard...</Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <Typography variant="h4" className="flex items-center gap-3 text-primary">
          {iconUrl && <img src={iconUrl} alt="time" className="w-8 h-8" />}
          Good {timeOfDay},{' '}
          <span className="font-bold">{userProfile?.username || 'User'}</span>
        </Typography>
        <div className="flex gap-2">
          <Button onClick={() => setIsWizerOpen(true)}>
            Join the Wizer Community
          </Button>
          <Button onClick={() => setIsOrganizationOpen(true)}>
            Add your Organization
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
        <div className="md:col-span-8 col-span-12">
          <Typography variant="h5" className="mb-2">YOUR DECISION PROFILE</Typography>
          {profileError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {profileError}
            </div>
          )}
          {userProfile && <YourDecisionMaking userProfile={userProfile} />}
          <div className="mt-8 mb-4 flex items-center justify-between">
            <Typography variant="h5" className="flex items-center gap-2">
              NOTIFICATIONS
              <span className="text-base font-normal">({unreadNotifications.length} new events)</span>
            </Typography>
            {unreadNotifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Mark All as Read
              </Button>
            )}
          </div>
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onUpdate={handleNotificationUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <img src="/wizermainlogo.svg" alt="No Data" className="w-24 h-24 mb-4" />
              <Typography variant="h5" className="font-bold mb-2">You are all caught up.</Typography>
            </div>
          )}
        </div>
        <div className="md:col-span-4 col-span-12">
          <Typography variant="h5" className="mb-2">PROFILE</Typography>
          {userProfile && (
            <div className="bg-white rounded-lg border p-4 flex flex-col items-center justify-center">
              <UserProfile {...userProfile} />
              <UserCategories userId={userProfile.id} />
              <UserProfileStats
                numberOfPosts={userProfile.numberOfPosts}
                numberOfFollowers={userProfile.numberOfFollowers}
                numberOfFriends={userProfile.numberOfFriends}
                numberOfFollowing={userProfile.numberOfFollowing}
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

export default Dashboard

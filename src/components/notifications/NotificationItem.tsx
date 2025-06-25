import React from 'react'
import { Card, CardContent } from '@/components/components/ui/card'
import { Typography } from '@/components/components/ui/typography'
import { Button } from '@/components/components/ui/button'
import { Bell, MessageSquare, Users, ThumbsUp, AtSign } from 'lucide-react'
import type { Notification } from '@/apis/notifications'
import { markNotificationAsRead, deleteNotification } from '@/apis/notifications'

interface NotificationItemProps {
  notification: Notification
  onUpdate: () => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onUpdate }) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'post_invite':
        return <MessageSquare className="w-5 h-5 text-blue-500" />
      case 'feedback_request':
        return <ThumbsUp className="w-5 h-5 text-green-500" />
      case 'decision_made':
        return <Bell className="w-5 h-5 text-purple-500" />
      case 'follow':
        return <Users className="w-5 h-5 text-orange-500" />
      case 'mention':
        return <AtSign className="w-5 h-5 text-red-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'post_invite':
        return 'border-l-blue-500 bg-blue-50'
      case 'feedback_request':
        return 'border-l-green-500 bg-green-50'
      case 'decision_made':
        return 'border-l-purple-500 bg-purple-50'
      case 'follow':
        return 'border-l-orange-500 bg-orange-50'
      case 'mention':
        return 'border-l-red-500 bg-red-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const handleMarkAsRead = async () => {
    await markNotificationAsRead(notification.id)
    onUpdate()
  }

  const handleDelete = async () => {
    await deleteNotification(notification.id)
    onUpdate()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Card className={`mb-3 border-l-4 ${getNotificationColor(notification.type)} hover:shadow-md transition-shadow ${notification.status === 'unread' ? 'ring-2 ring-blue-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <Typography variant="h6" className="font-semibold text-gray-900 mb-1">
                {notification.title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-2">
                {notification.message}
              </Typography>
              <div className="flex items-center justify-between">
                <Typography variant="caption" className="text-gray-500">
                  {formatTime(notification.createdAt)}
                </Typography>
                {notification.metadata?.postTitle && (
                  <Typography variant="caption" className="text-blue-600 font-medium">
                    {notification.metadata.postTitle}
                  </Typography>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-1 ml-4">
            {notification.status === 'unread' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                className="text-xs h-8 px-2"
              >
                Mark Read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-xs h-8 px-2 text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationItem 
import axios from 'src/services/interceptor'

export interface Notification {
  id: string
  type: 'post_invite' | 'feedback_request' | 'decision_made' | 'follow' | 'mention'
  title: string
  message: string
  postId?: string
  userId: string
  targetUserId: string
  status: 'read' | 'unread'
  createdAt: string
  updatedAt: string
  metadata?: {
    postTitle?: string
    decisionType?: string
    feedbackType?: string
  }
}

export interface CreateNotificationPayload {
  type: Notification['type']
  title: string
  message: string
  postId?: string
  targetUserId: string
  metadata?: Notification['metadata']
}

// Get all notifications for current user (using inbox endpoint)
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axios.get('/inbox')
    return response.data
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
}

// Get notifications for specific user (using inbox endpoint)
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await axios.get('/inbox')
    return response.data
  } catch (error) {
    console.error('Error fetching user notifications:', error)
    return []
  }
}

// Get unread notifications count (using inbox count endpoint)
export const getUnreadNotificationsCount = async (): Promise<number> => {
  try {
    const response = await axios.get('/inbox/number-of-inbox-notifications')
    return response.data.count || response.data
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }
}

// Mark notification as read (using inbox read endpoint)
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await axios.patch('/inbox/read-inbox-notification', { notificationId })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

// Mark all notifications as read (using inbox read endpoint)
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await axios.patch('/inbox/read-inbox-notification', { markAll: true })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    throw error
  }
}

// Create a new notification (using inbox endpoint)
export const createNotification = async (payload: CreateNotificationPayload): Promise<Notification> => {
  try {
    const response = await axios.post('/inbox', payload)
    return response.data
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

// Delete a notification (using inbox endpoint)
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await axios.delete(`/inbox/${notificationId}`)
  } catch (error) {
    console.error('Error deleting notification:', error)
    throw error
  }
}

// Get notifications by type (using inbox endpoint with filter)
export const getNotificationsByType = async (type: Notification['type']): Promise<Notification[]> => {
  try {
    const response = await axios.get(`/inbox?type=${type}`)
    return response.data
  } catch (error) {
    console.error('Error fetching notifications by type:', error)
    return []
  }
} 
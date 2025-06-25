import axios from 'src/services/interceptor'

export interface Post {
  id: string
  title: string
  content: string
  owner: {
    id: string
    name: string
    image: string
  }
  medias?: Array<{
    files: Array<{
      url: string
    }>
  }>
  mediasC?: Array<{
    id: string
  }>
  createdAt: string
  updatedAt: string
}

export interface Invite {
  id: string
  postId: string
  status: 'read' | 'unread'
  postFeedback?: {
    postId: string
  }
}

export interface InvitePostData {
  invite: Invite
  post: Post | null
}

export const getFetchPostId = async (userId: number): Promise<Invite[]> => {
  try {
    // Try different possible notification endpoints
    let response
    try {
      response = await axios.get(`/notifications/${userId}`)
    } catch {
      try {
        response = await axios.get(`/users/${userId}/notifications`)
      } catch {
        try {
          response = await axios.get('/notifications')
        } catch {
          // If all endpoints fail, return empty array
          console.log('No notifications endpoint found, returning empty array')
          return []
        }
      }
    }
    return response.data
  } catch (error) {
    console.error('Error fetching post IDs:', error)
    // Return empty array instead of throwing error
    return []
  }
}

export const getAllPostForFeed = async (postId: string): Promise<Post> => {
  try {
    const response = await axios.get(`/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error)
    throw error
  }
}

export const getUserProfile = async (userId: string) => {
  try {
    // Try different possible endpoints for user profile
    let response
    try {
      response = await axios.get(`/users/${userId}/profile`)
    } catch {
      try {
        response = await axios.get(`/users/${userId}`)
      } catch {
        response = await axios.get(`/user/profile`)
      }
    }
    return response.data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

// Get current user profile (alternative approach)
export const getCurrentUserProfile = async () => {
  try {
    const response = await axios.get('/user/profile')
    return response.data
  } catch (error) {
    console.error('Error fetching current user profile:', error)
    throw error
  }
} 
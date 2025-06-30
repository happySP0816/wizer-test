import customAxios from '@/services/interceptor'
import { type AxiosResponse } from 'axios'

interface UserCategory {
  id: number
  name: string
}

export interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  owner: {
    name: string
    image?: string
  }
  question: string
}

export interface Invite {
  id: string
  postId: string
  status: 'read' | 'unread'
  postFeedback?: {
    postId: string
  }
  createdAt: string
  from: {
    user: {
      name: string
    }
  }
  type: string
  post: {
    id: string
    title: string
    content: string
    createdAt: string
    owner: {
      name: string
      image?: string
    }
  }
  postComment?: {
    from: {
      user: {
        name: string
        username: string
        image?: string
      }
    }
  }
  voteFrom?: {
    user: {
      name: string
      username: string
      image?: string
    }
  }
  friendRequest?: {
    from: {
      user: {
        name: string
        username: string
        image?: string
      }
    }
  }
}

export const fetchUserCategories = async (userId: number): Promise<UserCategory[]> => {
  const response: AxiosResponse<UserCategory[]> = await customAxios.get(`/categories/user-categories/${userId}`)

  return response.data
}

export const fetchUserDetailByUsername = async (username: string) => {
  try {
    const response = await customAxios.get(`/users/username/${username}`)

    return response.data
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

export const fetchUserVotesByUserName = async (username: string) => {
  try {
    const response = await customAxios.get('/org_Dashboard/post/votecount-byOrganization', {
      params: {
        username: username
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

export const getAllPostsForUser = async (organizationId: any, username: any, postclosed: any, limit: any, page: any) => {
  try {
    const response = await customAxios.get(`/org_Dashboard/getPost/byOrganization`, {
      params: {
        organizationId: organizationId,
        username: username,
        postclosed: postclosed,
        limit: limit,
        page: page
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching posts by organization:', error)
    throw error
  }
}

export const getRatingByCategory = async (userID: any = {}) => {
  const response = await customAxios.get(`/leaderboard/user/ranking/category-wise?userId=${userID}`)

  return response.data
}

export const getPostResult = async (userId: number, limit: number, page: number): Promise<any> => {
  const queryParams = {
    userId: userId,
    limit: limit,
    page: page
  }

  try {
    const response = await customAxios.get<any>(`/org_Dashboard/get/yourDecision/winningoption/ofPost`, {
      params: queryParams
    })

    return response.data
  } catch (error) {
    console.error('Error fetching post result:', error)
    throw error
  }
}

export const fetchInvitePost = async (postId: any): Promise<any> => {
  try {
    const response = await customAxios.get(`/posts/auth/${postId}`)

    return response.data
  } catch (error) {
    console.error('Error fetching post result:', error)
    throw error
  }
}
export const getFetchPostId = async (limit?: any, offset?: any): Promise<any> => {
  try {
    const response = await customAxios.get('/inbox', {
      params: {
        limit: limit,
        offset: offset
      }
    })
    
return response.data
  } catch (error) {
    console.error('Error fetching post result:', error)
    throw error
  }
}
export const getAllPostForFeed = async (postId: any): Promise<any> => {
  try {
    const response = await customAxios.get(`/posts/auth/All/${postId}`)
    
return response.data
  } catch (error) {
    console.error('Error fetching post result:', error)
    throw error
  }
}
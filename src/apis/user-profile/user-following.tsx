import customAxios from '@/services/interceptor'

export const getFollowing = async (params: any = {}) => {
  try {
    const response = await customAxios.get(`users/following/${params.userId}`, { params: { ...params } })

    return response.data
  } catch (error) {
    throw error
  }
}
export const checkIfFollowing = async (params: any = {}) => {
  try {
    const response = await customAxios.get(`users/check-if-following/${params.id}`)

    return response.data
  } catch (error) {
    throw error
  }
}

export const followUser = async (params: any = {}) => {
  try {
    const response = await customAxios.post(`users/following/${params.id}`)

    return response.data
  } catch (error) {
    throw error
  }
}

export const unfollowUser = async (params: any = {}) => {
  try {
    const response = await customAxios.delete(`users/unfollow/${params}`)

    return response.data
  } catch (error) {
    throw error
  }
}

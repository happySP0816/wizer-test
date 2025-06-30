import customAxios from '@/services/interceptor'

interface FriendRequestParams {
  id: string
}

export const getUserFriends = async (params: any = {}) => {
  try {
    const response = await customAxios.get('users/friends', { params })

    return response.data
  } catch (error) {
    throw error
  }
}

export const checkIfFriends = async (params: FriendRequestParams) => {
  try {
    const response = await customAxios.get(`users/check-if-friends/${params}`)

    return response.data
  } catch (error) {
    throw error
  }
}

export const sendFriendRequest = async (params: FriendRequestParams) => {
  try {
    const response = await customAxios.post(`users/add-friend/${params.id}`)

    return response.data
  } catch (error) {
    throw error
  }
}

export const acceptFriendRequest = async (params: FriendRequestParams) => {
  try {
    const response = await customAxios.patch(`users/change-friend-request-status/${params.id}`, params)

    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteFriend = async (params: FriendRequestParams) => {
  try {
    const response = await customAxios.post(`users/delete-friend/${params.id}`)

    return response.data
  } catch (error) {
    throw error
  }
}

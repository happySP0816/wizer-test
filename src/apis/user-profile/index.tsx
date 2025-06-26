import { type AxiosResponse } from 'axios'
import customAxios from 'src/services/interceptor'

export const getUserByUserName = async (username: string) => {
  try {
    const response = await customAxios.get(`/users/username/${username}`)

    return response.data
  } catch (error: any) {
    console.error(error.message)
  }
}

export const getUserCategories = async (username: string) => {
  try {
    const response = await customAxios.get(`/categories/user-categories/${username}`)

    return response.data
  } catch (error) {
    return false
  }
}
interface UploadUserAvatarResponse {
  success: boolean
  image?: string
  error?: string
}
export async function uploadUserAvatar(imageFile: File): Promise<UploadUserAvatarResponse> {
  try {
    const formData = new FormData()
    formData.append('file', imageFile)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const response: AxiosResponse<UploadUserAvatarResponse> = await customAxios.post(
      '/users/user-media.public/upload/avatar',
      formData,
      config
    )

    if (response.data.success && response.data.image) {
      sessionStorage.setItem('img', response.data.image)
    }

    return response.data
  } catch (error) {
    console.error('Error uploading user image:', error)

    return { success: false, error: 'Failed to upload the image' }
  }
}

export const getParticularUserPosts = async (params: any) => {
  try {
    const response = await customAxios.get(`posts/user/${params.userId}`, { params: { ...params } })

    return response.data
  } catch (error) {
    return false
  }
}
export const checkIfUserAlreadyFriend = async (userId: any) => {
  try {
    const response = await customAxios.get(`users/check-if-friends/${Number(userId)}`)

    return response.data
  } catch (error) {
    return false
  }
}
export const checkIfUserAlreadyFollow = async (userId: any) => {
  try {
    const response = await customAxios.get(`users/check-if-following/${Number(userId)}`)

    return response.data
  } catch (error) {
    return false
  }
}

export const sendFriendRequest = async (userId: any) => {
  try {
    const response = await customAxios.post(`users/add-friend/${Number(userId)}`)

    return response.data
  } catch (error) {
    return false
  }
}

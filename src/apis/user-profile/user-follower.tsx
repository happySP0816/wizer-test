import customAxios from 'src/services/interceptor'

export const getFollowers = async (params: any = {}) => {

  try {
    const response = await customAxios.get(`users/followers/${params.userId}`, { params: { ...params } })
    
    return response.data
  } catch (error) {
    throw error
  }
}
export const deleteFollower = async (params: any = {}) => {
  try {
    const response = await customAxios.delete(`users/remove-follower/${params.id}`)

    return response.data
  } catch (error) {
    throw error
  }
}

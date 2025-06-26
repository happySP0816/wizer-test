import axios from 'src/services/interceptor'

export const getGlobalPost = async (
  viewerid: number,
  limit: number,
  offset: number,
  closedStatus: boolean,
  voted: number
): Promise<any> => {
  let response

  if (voted === 0 || voted === 1) {
    response = await axios.get<any>(
      `/organization/get/organization/posts?viewerid=${viewerid}&limit=${limit}&offset=${offset}&closed=${closedStatus}&voted=${voted}`
    )
  }

  if (voted === 2) {
    response = await axios.get<any>(
      `/organization/get/organization/posts?limit=${limit}&offset=${offset}&closed=${closedStatus}`
    )
  }

  return response?.data
}

export const postOption = async (payload: {
  postId: string
  optionId: string
  optionIdsSequence: any
}): Promise<any> => {
  const response = await axios.post<any>('/posts/votes', payload)

  return response.data
}
export const fetchAnswer = async (params: { postId: string | number }): Promise<any> => {
  const response = await axios.get<any>('/posts/votes', { params: { ...params } })

  return response.data
}

export const followUser = async (userId: number): Promise<any> => {
  const response = await axios.post<any>(`/users/following/${userId}`, {})

  return response.data
}
export const unfollowUser = async (userId: number): Promise<any> => {
  const response = await axios.delete<any>(`/users/unfollow/${userId}`, {})

  return response.data
}

export const getFollowingList = async (userId: any): Promise<any> => {
  const response = await axios.get<any>(`/users/following/${userId}`, {})

  return response.data
}

export const getClosedPost = async (postId: any): Promise<any> => {
  const response = await axios.get<any>(`/posts/stat/${postId}`, {})

  return response.data
}

export const postComment = async (postId: any, comment: any): Promise<any> => {
  const res = await axios.post(`/posts/comments/${postId}`, comment)

  return res.data
}

export const getPostComment = async (params: any, closed: any) => {
  const res = closed
    ? await axios.get(`/posts/comments/post/${params.postId}`)
    : await axios.get(`/posts/auth/${params.postId} `)
  const response = closed ? res.data : res.data.userComments

  return response
}

export const postDelete = async (postId: number): Promise<any> => {
  const res = await axios.delete(`/posts/${postId}`)

  return res.data
}

export const createNewPost = async (postData: any) => {
  if (postData['description'] === '') {
    delete postData['description']
  }
  const response = await axios.post('/posts', postData)

  return response.data
}
export const uploadPostImage = async (postData: any) => {
  const formData = new FormData()
  formData.append('file', postData)

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }

  const response = await axios.post('/posts/post-media.public/upload/photo', formData, config)

  return response.data
}

export const getPostCrowdStrength = async (params: any = {}) => {
  const response = await axios.post('posts/post-crowd-strength', params)

  return response.data
}

export const uploadPostVideo = async (postData: any) => {
  const formData = new FormData()
  formData.append('file', postData)

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }

  const response = await axios.post('/posts/post-media.public/upload/video', formData, config)

  return response.data
}

export const getPostInviteLink = async (params: any = {}) => {
  const response = await axios.get('/posts/invites/get-invite', {
    params: { ...params }
  })

  return response.data
}

export const postReportOption = async () => {
  const response = await axios.get('/data/post-report-options')

  return response.data
}
interface ReportData {
  postId: number
  reason: string
}

export const reportOnPost = async (postId: number, reason: string) => {
  const reportData: ReportData = {
    postId: postId,
    reason: reason
  }

  const response = await axios.post('/posts/report', reportData)

  return response.data
}
export const likeOnComment = async (commentId: number) => {
  const response = await axios.post(`/posts/comments/add-like/${commentId}`)

  return response.data
}

export const commentReply = async (postId: string, replyData: any) => {
  const response = await axios.post(`/posts/comments/replies/${postId}`, replyData)

  return response.data
}

export const getCategoryExperts = async (params: any = {}) => {
  const response = await axios.get('/categories/category/experts', { params })

  return response.data
}

export const getFriends = async (params: any = {}) => {
  const response = await axios.get('/users/friends', { params })

  return response.data
}

export const getCrowds = async (params: any): Promise<any[]> => {
  const response = await axios.get('/users/crowds', { params })

  return response.data
}

export const getAllParticipants = async (params: any): Promise<any[]> => {
  const response = await axios.get('/users/crowds/available-users', { params })

  return response.data
}

export const setPostFeedback = async (postId: any, payload: any): Promise<any> => {
  const response = await axios.post<any>(`/posts/feedbacks/${postId}`, payload)

  return response.data
}

export const getUserEndorsed = async (userId: any): Promise<any> => {
  const response = await axios.get<any>(`/users/endorsed-expertise/${userId}`)

  return response.data
}
export const getUserCategories = async (userId: any): Promise<any> => {
  const response = await axios.get<any>(`/users/categories?userId=${userId}`)

  return response.data
}

export const postUserExpertiseEndorsed = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`/users/endorsed-expertise`, payload)

  return response.data
}

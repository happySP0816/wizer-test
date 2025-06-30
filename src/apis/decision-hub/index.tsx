import axios from '@/services/interceptor'

export const getDecisionHubTopic = async () => {
  try {
    const response = await axios.get('/categories/category/bytype', {
      params: {
        viewType: 'business'
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
export const uploadDecisionPostImage = async (postData: any) => {
  try {
    const formData = new FormData()
    formData.append('file', postData)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const response = await axios.post('/posts/post-media.public/upload/photo', formData, config)

    return response.data
  } catch (error) {
    // console.log(error)
  }
}

export const uploadDecisionPostVideo = async (postData: any) => {
  try {
    const formData = new FormData()
    formData.append('file', postData)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const response = await axios.post('/posts/post-media.public/upload/video', formData, config)

    return response.data
  } catch (error) {
    // console.log(error)
  }
}

export const getDecisionHubCrowds = async (params: any): Promise<any[] | undefined> => {
  try {
    const response = await axios.get('/decisionHub/crowds', { params })

    return response.data
  } catch (error) {
    // console.log(error)
  }
}

export const getOrganizationMembers = async (organizationId: number): Promise<any[]> => {
  try {
    const response = await axios.get('/organization/get/all/organization-member', {
      params: {
        id: organizationId
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching organization members:', error)
    throw error
  }
}

export const createDecisionHubPost = async (postData: any) => {
  const response = await axios.post('/posts', postData)

  return response.data
}

export const getDecisionHubCrowdStrength = async (params: any) => {
  try {
    const response = await axios.post('/decisionHub/crowds/post-crowd-strength', params)

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export const getDecisionHubPost = async (organizationId: any,userId:any): Promise<any> => {
  const response = await axios.get<any>(
    `/organization/get/organization/posts?viewerid=${userId}&id=${organizationId}&visbility=${'decision_hub'}&closed=${'true'}&contributor=${'true'}`
  )

  // // console.log(response)

  return response.data
}

export const getDecisionHubPostAdmin = async (organizationId: any): Promise<any> => {

  const response = await axios.get<any>(
    `/organization/get/organization/posts?id=${organizationId}&visbility=${'decision_hub'}&closed=${'true'}`
  )

  // // console.log(response)

  return response.data
}

export const getDecisionHubPostListing = async (organizationId: any,userId:any): Promise<any> => {
  const response = await axios.get<any>(
    `/organization/get/organization/posts?viewerid=${userId}&id=${organizationId}&visbility=${'decision_hub'}&closed=${'false'}&contributor=${'true'}`
  )

  return response.data
}

export const getDecisionPostListing = async (userId:any): Promise<any> => {
  const response = await axios.get<any>(
    `/organization/get/organization/posts?viewerid=${userId}&visbility=${'decision_hub'}&closed=${'false'}&contributor=${'true'}`
  )

  return response.data
}

export const getDecisionHubPostListingAdmin = async (organizationId: any): Promise<any> => {
  const response = await axios.get<any>(
    `/organization/get/organization/posts?id=${organizationId}&visbility=${'decision_hub'}&closed=${'false'}`
  )

  return response.data
}

export const postDecisionPostOption = async (payload: {
  postId: string
  optionId: string
  optionIdsSequence: any
}): Promise<any> => {
  const response = await axios.post<any>('/posts/votes', payload)

  return response.data
}
export const postDecisionRanking = async (payload: { postId: string; optionIdsSequence: any }): Promise<any> => {
  const response = await axios.post<any>('/posts/votes', payload)

  return response.data
}

export const fetchDecisionAnswer = async (params: { postId: string | number }): Promise<any> => {
  const response = await axios.get<any>('/posts/votes', { params: { ...params } })

  return response.data
}

export const postDecisionComment = async (postId: any, organizationId: any, comment: any): Promise<any> => {
  let res;
  if (organizationId === 0) {
    res = await axios.post(`/posts/comments/${postId}?postId=${postId}`, comment)
  } else {
    res = await axios.post(`/posts/comments/${postId}?postId=${postId}&organizationId=${organizationId}`, comment)
  }

  return res.data
}

export const getPostDecisionComment = async (postId: any, closed: any) => {
  const res = closed ? await axios.get(`/posts/comments/post/${postId}`) : await axios.get(`/posts/auth/${postId} `)
  const response = closed ? res.data : res.data.userComments

  return response
}
export const decisionCommentReply = async (postId: string, replyData: any) => {
  const response = await axios.post(`/posts/comments/replies/${postId}`, replyData)

  return response.data
}
export const getDecisionRankingAnswer = async (params: { postId: string | number }): Promise<any> => {
  const response = await axios.get<any>('/posts/votes', { params: { ...params } })

  return response.data
}

export const getDecisionPostAllComment = async (postId: any, organizationId: any) => {
  try {
    const apiUrl = `/posts/comments/decisionhub/post`
    let queryParams
    if (organizationId === 0) {
      queryParams = new URLSearchParams({
        postId
      })
    } else {
      queryParams = new URLSearchParams({
        postId,
        organizationId
      })
    }

    const response = await axios.get(`${apiUrl}?${queryParams}`)

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export const getDecisionPostLike = async (params: any) => {
  try {
    const response = await axios.post('/posts/comments/decisionhub/add-like', params)

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export const getDecisionPostReport = async (params: any) => {
  const { postId, orgnizationId } = params
  try {
    const response = await axios.get(`/org_Dashboard/get/post/Report?postId=${postId}&orgnizationId=${orgnizationId}`)

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
export const postMemberPrediction = async (params: any) => {
  try {
    const response = await axios.post('/decisionHub/crowds/post-member-prediction', params)

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
import axios from 'src/services/interceptor'

interface SignUpResponse {
  error: any
  result: any
  user: {
    username: string
    email: string
    id: string
  }
}
interface Membership {
  member_role: string
  organization_id: number
  organization_name: string
  organization_type: string
  small_decision: boolean
  large_decision: boolean
  web: boolean
  [key: string]: any
}

interface PasswordResetRequest {
  email: string
}
interface PasswordResetResponse {
  error: any
  result: boolean
}
export const userResetPwdwithToken = async (payload: any, type?: string): Promise<SignUpResponse> => {
  try {
    if (type === 'decisionHub') {
      const response = await axios.patch('/users/decisionHub-created-user/change/password-after-reset', payload)

      return response.data
    } else {
      const response = await axios.patch('/users/change/password-after-reset', payload)

      return response.data
    }
  } catch (error) {
    return error as SignUpResponse
  }
}

export const checkToken = async (payload?: any): Promise<any> => {
  try {
    const response = await axios.post('/users/decisionHub-created-user/check/token-after-reset', payload)

    return response.data
  } catch (error) {
    console.error('Password reset error:', error)
    throw new Error('Password reset failed. Please try again later.')
  }
}

export const sendPasswordResetRequest = async (requestData: PasswordResetRequest): Promise<PasswordResetResponse> => {
  try {
    const response = await axios.post('/auth/change-password', requestData)

    return response.data
  } catch (error) {
    console.error('Password reset error:', error)
    throw new Error('Password reset failed. Please try again later.')
  }
}

export const userSignUp = async (payload: any): Promise<SignUpResponse> => {
  try {
    const response = await axios.post('/auth/signup', payload)
    const { user } = response.data

    if (user) {
      sessionStorage.setItem('userId', user.id)
      sessionStorage.setItem('img', user.image)
    }

    return response.data
  } catch (error) {
    return error as SignUpResponse
  }
}

export const signIn = async (payload: any) => {
  try {
    const response = await axios.post('/auth/signin', payload)
    if (response.data.user) {
      const { tokens, user } = response.data
      sessionStorage.setItem('userId', user.id)
      sessionStorage.setItem('token', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('token', tokens.accessToken)
      sessionStorage.setItem('img', user.image)
    }

    return response.data
  } catch (error) {
    return error
  }
}

export const refreshToken = async (refreshToken: string) => {
  const payload={'refreshToken': refreshToken}
  const res = await axios.post('auth/refresh', payload)
  const { tokens } = res.data
  
  return tokens
}

export const logoutUser = () => {
  if (sessionStorage.getItem('token')) {
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('token')
    localStorage.removeItem('token')
  }
}

export const googleSignIn = async (payload: any) => {
  const res = await axios.post('/auth/google/signin', payload)
  sessionStorage.setItem('userId', res.data.user.id)
  sessionStorage.setItem('token', res.data.tokens.accessToken)
  localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
  localStorage.setItem('token', res.data.tokens.accessToken)
  sessionStorage.setItem('img', res.data.user.image)

  return res.data
}

export const getMembershipDetail = async (payload: any): Promise<Membership> => {
  try {
    const response = await axios.get('/organization/get/membership/byUserid', payload)

    return response.data
  } catch (error) {
    return error as Membership
  }
}

export const getUserRoles = async (): Promise<any> => {
  const userid = sessionStorage.getItem('userId')

  const payload = {
    userid: Number(userid)
  }
  try {
    const data = await getMembershipDetail(payload)
    console.log("data",data)
    const resData: Record<string, any> = {};
    for (const key in data) {
      // // console.log('key', key)
      if (data[key] === null) {
        resData['user']={
          name: 'user',
          member_role: 'user',
          web: false,
          small_decision: false,
          large_decision: false,
          organization_name: '',
          organization_id: 0
        }
      } else if (data[key].member_role === 'external' ) {
        resData['external'] = {
          name: 'external',
          member_role: data[key].member_role,
          web: false,
          small_decision: false,
          large_decision: false,
          organization_name: '',
          organization_id: 0
        }
      } else if (data[key].small_decision === true ) {
        resData['small_decision'] = {
          name: 'small_decision',
          member_role: data[key].member_role,
          web: data[key].web,
          small_decision: data[key].small_decision,
          large_decision: data[key].large_decision,
          organization_name: data[key].organization_name,
          organization_id: data[key].organization_id
        }
      }  else if (data[key].web === true ) {
        resData['web'] = {
          name: 'web',
          member_role: data[key].member_role,
          web: data[key].web,
          small_decision: data[key].small_decision,
          large_decision: data[key].large_decision,
          organization_name: data[key].organization_name,
          organization_id: data[key].organization_id
        }
      }
      }
    // console.log('resData: ', resData);

    return resData
  } catch (error) {
      // console.log(error);
      
      return error
  }
}

export const validateEmail = async (email: string) => {
  try {
    const response = await axios.get("/auth/check-credentials", {
      params: {
        email: email
      }
    })

    return response
  } catch (error) {
    return error
  }
}

export const checkCredential = async () => {
  try {
    const response = await axios.get('/users')

    return response
  } catch (error) {
    return error
  }
}

export const subscriptionCheckForAiQuestion = async (subscriptionId: any, organizationId: any) => {
  try {
    const response = await axios.get('/organization/get/subscription-subscribed/byOrganization', {
      params: {
        subscriptionId: subscriptionId,
        organizationId: organizationId
      }
    })

    return response.data
  } catch (error) {
    throw error
  }
}

//**** slack intefaces and api ******//

export const saveSlackuser = async (requestData: any): Promise<boolean> => {
  try {
    const response = await axios.post('/slack-user/create', requestData)

    return response.data
  } catch (error) {
    console.error('error:', error)
    throw new Error('user save failed. Please try again later.')
  }
}

export const getSlackuserDetail = async (requestData: any): Promise<boolean> => {
  
  try {
    const response = await axios.get(`/slack-user/check-user?user_id=${requestData.user_id}`)
    
return response.data
  } catch (error) {
    console.error('error:', error)
    throw new Error('user get failed. Please try again later.')
  }
}

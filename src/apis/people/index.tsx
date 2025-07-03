import axios from 'src/services/interceptor'

interface SignUpResponse {
  result: any
  user: {
    username: string
    email: string
    id: string
  }
  error: {
    errorCode: number
    message: string
  }
}

export const getOrganizationMembersForPeople = async (organizationId: number) => {
  try {
    const response = await axios.get('/organization/get/all/organization-member', {
      params: {
        id: organizationId
      }
    })
    
return response.data
  } catch (error) {
    // console.error('Error fetching organization members:', error)
    
return false
  }
}

export const userCheck = async (email: string) => {
  try {
    const response = await axios.get('/users/email/' + email)

  return response.data.user.id
  } catch (error) {
    // console.error('User Doesnt Exist:', error)
    
  return false
  }
}

export const removeMemberApi = async (member_id:number, orgId:number) => {
  const payload = {
    id: member_id,
    organization: orgId
  }
  try {
    const response = await axios.post('/organization/remove/organization-member',payload)

  return response.data
  } catch (error) {
    // console.error('Membership failed:', error)
    
  return false
  }
}
export const attachMember = async (role: string, userId: number, organizationId: number) => {
  const payload = {
    role: role,
    userId: userId,
    organizationId: organizationId
  }
  try {
    const response = await axios.post('/organization/create/organization-member',payload)

  return response.data
  } catch (error) {
    // console.error('Membership failed:', error)
    
  return false
  }
}

export const userSignUpDecisionHub = async (
  email: string,
  username: string,
  userId: number,
  orgId: number,
  role: string
): Promise<SignUpResponse> => {
  const payload = {
    username: username,
    email: email.toLowerCase(),
    password: 'Wizer@123',
    roles: [role],
    decisionHub: [
      {
        userId: userId,
        organizationId: orgId
      }
    ]
  }
  try {
    const response = await axios.post('/auth/signup', payload)
    return response.data
  } catch (error) {
    return {
      result: null,
      user: { username: '', email: '', id: '' },
      error: {
        errorCode: -1,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

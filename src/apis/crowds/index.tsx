import axios from '@/services/interceptor'

export const getCrowds = async () => {
  try {
    const response = await axios.get('/decisionHub/crowds')

    return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const addCrowd = async (title: string, organizationId: string) => {
  const paylaod = {
    title: title,
    organizationId: Number(organizationId),
    participants: []
  }
  try {
    const response = await axios.post('/decisionHub/crowds', paylaod)

    return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const editCrowd = async (title: string, crowdId: number) => {
  const paylaod = {
    title: title
  }
  try {
    const response = await axios.patch(`/decisionHub/crowds/${crowdId}/edit`, paylaod)

    return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const deleteCrowd = async (crowdId: number) => {
  try {
    const response = await axios.delete(`/decisionHub/crowds/${crowdId}`)
    
return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const getOrganizationMembersForCrowd = async (organizationId: number) => {
  try {
    const response = await axios.get('/organization/get/all/organization-member', {
      params: {
        id: organizationId
      }
    })
    
return response.data
  } catch (error) {
    console.error('Error fetching organization members:', error)
    
return false
  }
}

export const getCrowdParticipants = async (crowdId: number) => {
  try {
    const response = await axios.get('/decisionHub/crowds/participants', {
      params: {
        crowdId: crowdId
      }
    })
    
return response.data
  } catch (error) {
    console.error('Error fetching crowd members:', error)
    
return false
  }
}

export const addCrowdParticipants = async (crowdId: number, participants: number[]) => {
  const paylaod = {
    crowdId: crowdId,
    participants: participants
  }
  try {
    const response = await axios.post('/decisionHub/crowds/multiple/participants', paylaod)

    return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const deleteCrowdParticipant = async (userId: number, crowdId: number) => {
  const payload = {
    userId: userId,
    crowdId: crowdId
  }
  try {
    const response = await axios.delete('/decisionHub/crowds/delete/participant', {
      data: payload
    })
    
return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

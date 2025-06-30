import axios from 'src/services/interceptor'

export const getTeams = async (org:number) => {
  try {
    const response = await axios.get('/decisionHub/teams', {
      params: {
        organizationId: org
      }
    })

    return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const addTeam = async (name: string, organizationId: string) => {
  const paylaod = {
    name: name,
    organizationId: Number(organizationId),
    participants: []
  }
  try {
    const response = await axios.post('/decisionHub/teams', paylaod)

    return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const editTeam = async (name: string, teamId: number) => {
  const paylaod = {
    name: name
  }
  try {
    const response = await axios.patch(`/decisionHub/teams/${teamId}/edit`, paylaod)

    return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const deleteTeam = async (teamId: number) => {
  try {
    const response = await axios.delete(`/decisionHub/teams/{teamId}`, {
      params: {
        teamId: teamId
      }
    })
    
return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const getOrganizationMembersForTeam = async (organizationId: number) => {
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

export const getTeamParticipants = async (teamId: number) => {
  try {
    const response = await axios.get('/decisionHub/teams/participants', {
      params: {
        teamId: teamId
      }
    })
    
return response.data
  } catch (error) {
    console.error('Error fetching team members:', error)
    
return false
  }
}

export const addTeamParticipants = async (teamId: number, participants: number[]) => {
  const paylaod = {
    role: 'team-member',
    teamId: teamId,
    participants: participants
  }
  try {
    const response = await axios.post('/decisionHub/teams/multiple/participants', paylaod)

    return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const deleteTeamParticipant = async (userId: number, teamId: number) => {
  const payload = {
    userId: userId,
    teamId: teamId
  }
  try {
    const response = await axios.delete('/decisionHub/teams/participants/{userId}', {
      data: payload
    })
    
return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

export const changeTeamParticipant = async (userId: number, teamId: number, role: string) => {
  try {
    const response = await axios.patch(
      '/decisionHub/teams/update/team-member-role' + `?userId=${userId}&role=${role}&teamId=${teamId}`
    )
    
return response.data
  } catch (error) {
    // console.log(error.message)

    return false
  }
}

import axios from 'axios'

//**** slack intefaces and api ******//
interface AuthedUser {
  id: string
  scope: string
  access_token: string
  token_type: string
}

interface Team {
  id: string
  name: string
}

interface SlackResponse {
  ok: boolean
  app_id: string
  authed_user: AuthedUser
  scope: string
  token_type: string
  access_token: string
  bot_user_id: string
  team: Team
  enterprise: null | any // You can replace 'any' with the actual type if needed
  is_enterprise_install: boolean
  error: string 
  userId: string
}

export const slackGetAccessToken = async (payload: any): Promise<SlackResponse> => {
  try {
    const response = await axios.post('https://slack.com/api/oauth.v2.access', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // Add necessary headers here
      }
    }) 
    
return response.data
  } catch (error) {
    return error
  }
}

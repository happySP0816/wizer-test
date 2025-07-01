import React, { useEffect, useState } from 'react'
import { slackGetAccessToken } from '@/apis/slack'
import { saveSlackuser, getSlackuserDetail } from '@/apis/auth'
import { toast } from 'sonner'

interface userProfileprops {
  id: number;
}

interface Slackintegrationprops {
  code: string
  userProfile: userProfileprops
}

const Integration: React.FC<Slackintegrationprops> = ({ code, userProfile }) => {
  const [Isconfigured, setIsConfigured] = useState(false)
  const [message, setmessage] = useState('')

  // // console.log("user is", userProfile)
  const titleStyle: React.CSSProperties = {
    margin: 'auto',
    textAlign: 'center',
    fontSize: 22
  }

  const fetchAccess = async () => {
    try {
      const payload = {
        code,
        client_id: process.env.NEXT_SLACK_CLIENT_ID,
        client_secret: process.env.NEXT_SLACK_CLIENT_SECRET
      }

      const response = await slackGetAccessToken(payload)

      if (response.ok) {
        const payloadSlackUser = {
          userId: userProfile.id,
          team: response.team,
          enterprise: response.enterprise,
          authUser: response.authed_user,
          tokenType: response.token_type,
          isEnterpriseInstall: response.is_enterprise_install,
          appId: response.app_id,
          access_token: response.access_token,
          bot: { id: response.bot_user_id }
        }

        const saveReq = await saveSlackuser(payloadSlackUser)

        if (saveReq) {
          setIsConfigured(true)
          setmessage('Slack configured successfully')
          toast.success('Slack configured successfully')
        } else {
          setIsConfigured(false)
          setmessage('Slack not configured. Please contact administrator.')
          toast.warning('Slack not configured. Please contact administrator.')
        }

        return saveReq
      } else {
        // console.log('Not able to establish connection with slack')
      }
    } catch (error) {
      // console.log(error)
    }
  }

  const fetchSlackDetailIfExist = async () => {
    try {
      const userId = userProfile.id

      const payloadSlackUserDetail = {
        user_id: Number(userId)
      }

      const res = await getSlackuserDetail(payloadSlackUserDetail)

      if (res) {
        setIsConfigured(res)
      }

      return res
    } catch (error) {
      setIsConfigured(false)
      // console.log(error)
    }
  }

  useEffect(() => {
    fetchSlackDetailIfExist()

    if (code || code != null) {
      fetchAccess()
    }
  }, [code])

  return (
    <>
      <div>
        <h1>
          Integration
          <hr />
        </h1>
      </div>
      <div>
        <div>
          <div>
            {message}
            <h2 style={titleStyle}>
              <a
                style={{ pointerEvents: Isconfigured ? 'none' : 'auto' }}
                href='https://slack.com/oauth/v2/authorize?client_id=2366736083286.5922908013778&scope=commands,chat:write,chat:write.public,groups:write,groups:history,mpim:write,mpim:read,im:read,im:write,channels:read,channels:join&user_scope=channels:write,channels:read,im:write,im:read,mpim:read,mpim:write'
              >
                <img
                  alt='Add to Slack'
                  height='40'
                  width='139'
                  src='https://platform.slack-edge.com/img/add_to_slack.png'
                  srcSet='https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x'
                />
              </a>
            </h2>
          </div>
          <div>{Isconfigured && ' Slack already configured ✅'}</div>
        </div>
      </div>
    </>
  )
}

export default Integration

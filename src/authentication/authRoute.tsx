import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { checkCredential, getUserRoles, googleSignIn } from '@/apis/auth'
import { getUserPersonalityQuestions } from '@/apis/profile'
import customAxios from '@/services/interceptor'
import { jwtDecode } from 'jwt-decode'

interface AuthRouteProps {
  user?: any
  authenticated?: boolean
  userProfile?: any
}

const authRoute = <P extends AuthRouteProps>(Component: ComponentType<P>) => {
  return (props: Omit<P, keyof AuthRouteProps>) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState<any>(null)
    const [userProfile, setUserProfile] = useState<any>(null)
    const [authenticated, setAuthenticated] = useState<boolean | null>(null)
    const [, setRedirectUrl] = useState<string | null>(null)
    const [, setUserPersonalityQuestion] = useState<any>()

    const [, setProfile] = useState<any>(null)
    const redirectTo = '/dashboard'

    useEffect(() => {
      const checkToken = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
          const attemptedUrl = location.pathname;
          setRedirectUrl(location.pathname)
          setAuthenticated(false);
          navigate(`/login?redirectTo=${encodeURIComponent(attemptedUrl)}`);
        } else {
          try {
            let res

            try {
              res = await checkCredential()
            } catch (error) {
              sessionStorage.clear()
              localStorage.clear()
              setAuthenticated(false)
              navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`)
            }
            if ('data' in (res as any)) {
              const userPersonalityQuestion = await getUserPersonalityQuestions()
              const UserProfile = (res as any).data.user
              const response = await getUserRoles()
              setUser(response)
              setUserProfile(UserProfile)
              setAuthenticated(true)
              setUserPersonalityQuestion(userPersonalityQuestion.personalityQuestionsAnswers)
              if ('small_decision' in response) {
                if (
                  UserProfile.bio === null ||
                  UserProfile.gender === null ||
                  UserProfile.birthday === null ||
                  UserProfile.location === null ||
                  UserProfile.username === null ||
                  UserProfile.ethnicities.length === 0 ||
                  UserProfile.educations.length === 0 ||
                  UserProfile.professions.length === 0 ||
                  UserProfile.hobbiesOrInterests.length === 0 ||
                  userPersonalityQuestion.personalityQuestionsAnswers.length === 0
                ) {
                  // return navigate('/userInfo-form-popup')
                  return navigate('/dashboard')
                }
              }
            } else {
              throw new Error('Invalid response')
              console.log("Auth Step 5");
            }
          } catch (error) {
            console.log("Auth Step 6");
            sessionStorage.clear()
            localStorage.clear()
            setAuthenticated(false)
            return navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`);
          }
        }
      }

      checkToken()
    }, [authenticated])

    // if (authenticated === null) {
    //   navigate(`/login?redirectTo=${encodeURIComponent(redirectUrl || location.pathname)}`);
    // }

    useEffect(() => {
      async function getProfile() {
        try {
          if (user && user.access_token) {
            const res = await customAxios.get<any>(
              `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
              {
                headers: {
                  Authorization: `Bearer ${user.access_token}`,
                  Accept: 'application/json'
                }
              }
            )
            setProfile(res.data)
            responseGoogle(res.data)
          } else if (user && user.credential) {
            const decoded = jwtDecode(user.credential)
            setProfile(decoded)
            responseGoogle(decoded)
          }
        } catch (error) {
          // console.log(error)
        }
      }
  
        async function responseGoogle(response: any) {
        const { id, email, family_name, given_name, name, picture } = response
  
        const userResponse = await googleSignIn({
          id,
          email: email || '.',
          familyName: family_name || '.',
          givenName: given_name || '.',
          name: name ? name : `${given_name || ''} ${family_name || ''}`,
          photo: picture || '.'
        })
        if (userResponse.tokens.accessToken) {
          navigate(redirectTo)
        }
      }
  
      getProfile()
    }, [user, navigate, redirectTo])
 
    if (authenticated) {
      return <Component {...props as P} user={user} authenticated={authenticated} userProfile={userProfile} />
    }
    else {
      return null
    }
  }
}

export default authRoute 
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { checkCredential, getUserRoles } from '@/apis/auth'
import { getUserPersonalityQuestions } from '@/apis/profile'

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
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
    const [, setUserPersonalityQuestion] = useState<any>()

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
              console.log("ddd",response)
              setUser(response)
              setUserProfile(UserProfile)
              setAuthenticated(true)
              setUserPersonalityQuestion(userPersonalityQuestion.personalityQuestionsAnswers)
              if('small_decision' in response) {
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
                  return navigate('/userInfo-form-popup')
                }
              }
            } else {
              throw new Error('Invalid response')
            }
          } catch (error) {
            sessionStorage.clear()
            localStorage.clear()
            setAuthenticated(false)
            return navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`);
          }
        }
      }

      checkToken()
    }, [authenticated])
    
    if (authenticated === null) {
      navigate(`/login?redirectTo=${encodeURIComponent(redirectUrl || location.pathname)}`);
    }
    
    if (authenticated) {
      return <Component {...props as P} user={user} authenticated={authenticated} userProfile={userProfile} />
    } 
    else {
      return null
    }
  }
}

export default authRoute 
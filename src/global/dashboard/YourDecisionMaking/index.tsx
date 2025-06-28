import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/components/ui/card'
import { Typography } from '@/components/components/ui/typography'
import { Button } from '@/components/components/ui/button'
import {
  getdecisionProfileStatus,
  getdecisionProfilePercentages,
} from '@/apis/decisionProfile'
import { profileDescriptions } from '@/utils/profileDescriptions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar'

interface UserProfile {
  id: string
  name: string
  username: string
  image?: string
  bio?: string
  numberOfPosts: number
  numberOfFollowers: number
  numberOfFriends: number
  numberOfFollowing: number
}

interface YourDecisionMakingProps {
  userProfile: UserProfile
}

const YourDecisionMaking: React.FC<YourDecisionMakingProps> = ({ userProfile }) => {
  const navigate = useNavigate()
  const [taken, setTaken] = useState(false)
  const [errorTaken, seterrorTaken] = useState(false)
  const [scores, setScores] = useState<{ [key: string]: any } | null>(null);
  const [quizLabel, setQuizLabel] = useState('TAKE THE DECISION PROFILE QUIZ')
  const [takeId, setTakeId] = useState(null)

  const handleProfileButtonClick = () => {
    navigate('/decision-profile-report')
  }
  const handleButtonClick = () => {
    if (takeId) {
      navigate(`/decision-profile-test?decision_takeId=${String(takeId)}&updatedQuestions=True`)
    } else {
      navigate(`/decision-profile`)
    }
  }
  const checkTest = async () => {

    try {
      const response = await getdecisionProfileStatus(Number(userProfile.id))
      if ('status' in response) {
        if (response['status'] === 'completed' && response['newQuestions'] != true) {
          if ('scores' in response) {
            if (response['scores'] === null) {
              const res = await getdecisionProfilePercentages(Number(userProfile.id))
              setScores(res)
            } else {
              setScores(response['scores'])
            }
          } 
          setTaken(true)
        } else if (response['newQuestions'] === true) {
          setTakeId(response['takeId'])
          setQuizLabel('UPDATED DECISION PROFILE QUESTIONS AVAILABLE')
          setTaken(false)
        } else if (response['status'] === 'pending') {
          setTakeId(response['takeId'])
          setQuizLabel('CONTINUE YOUR DECISION PROFILE QUIZ')
          setTaken(false)
        }
      }
    } catch (error) {
      seterrorTaken(true)
    }
  }

  useEffect(() => {
    checkTest()
  }, [])

  return (
    <Card>
      <CardContent className='!p-5'>
      {taken && scores ? (
        <>
          <div className="flex flex-col w-full gap-5">
            <div className="flex items-start gap-5">
              <div className='px-5 py-6 flex-none'>
                <div className="relative w-[117px] h-[117px] flex-shrink-0">
                  <Avatar className='w-[117px] h-[117px]'>
                    <AvatarImage src={`images/decision-profile/${scores['profiletype']}.png`} alt="@shadcn" />
                    <AvatarFallback>
                      {'A'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className='flex-1 pl-2.5 pr-5 py-[12.5px]'>
                <div 
                  className="text-[#2D3648] text-sm font-normal"
                  dangerouslySetInnerHTML={{ __html: profileDescriptions[scores['profiletype']] }} 
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleProfileButtonClick} 
                className="px-5 py-2.5 rounded-4xl text-[16px] font-bold"
              >
                See Your Full Decision Profile
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          {!taken && !errorTaken && (
            <>
            <div className="flex flex-col items-center w-full p-4">
              <Typography className="mt-2.5 text-sm ml-4 text-center mb-5">
                Take the Decision Profile Test to find out what type of decision maker you are!
              </Typography>
              <Button 
                className="w-4/5 max-w-[500px] rounded-4xl text-[16px] font-bold" 
                onClick={handleButtonClick}>
                {quizLabel}
              </Button>
            </div>
            </>
          )}
          {!taken && errorTaken && <span>Sorry we can't retrieve your test status</span>}
        </>
      )}
      </CardContent>
    </Card>
  )
}

export default YourDecisionMaking 
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getdecisionProfile, getdecisionProfilePercentages } from '@/apis/decisionProfile'
import { traitDescriptions } from '@/utils/traitDescriptions'
import { profileDescriptions } from '@/utils/profileDescriptions'
import { traitDynamicDescriptions } from '@/utils/profileDynamicDescriptions'
import DecisionProfileTabs from './components/tabs';
import authRoute from '@/authentication/authRoute'
import { Typography } from '@/components/components/ui/typography'
import { Button } from '@/components/components/ui/button'

export interface Scores {
  juliet: Record<string, number>
  'big 5': Record<string, number>
  profiletype?: string
  [key: string]: any // allow for extra fields like profiletype
}

interface DecisionProfileReportProps {
  userProfile: {
    userProfile: {
      id: string
    }
  }
}

const useDecisionProfile = (userId: string) => {
  const [taken, setTaken] = useState<boolean>(false)
  const [errorTaken, setErrorTaken] = useState<boolean>(false)
  const [scores, setScores] = useState<Scores | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getdecisionProfile({ userId })
        const res = await getdecisionProfilePercentages(Number(userId))
        setScores(res)
        setTaken(true)
      } catch (error) {
        console.error('Error fetching decision profile', error)
        setErrorTaken(true)
      }
    }

    fetchData()
  }, [userId])

  return { taken, errorTaken, scores }
}

const DecisionProfileReport: React.FC<any> = ({ userProfile }) => {
  const { taken, errorTaken, scores } = useDecisionProfile(userProfile.id)
  const [selectedTrait, setSelectedTrait] = useState<string>('Process')
  const [selectedBigFiveTrait, setSelectedBigFiveTrait] = useState<string>('Extraversion')
  const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate('/dashboard')
  }

  function getFirstName(fullName: string) {
    const nameParts = (fullName?.trim() || "").split(' ');
    let firstName = nameParts[0];
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    if (nameParts.length > 1) {
      return firstName + "'s";
    } else {
      return firstName
    }
  }

  const renderContent = () => {
    if (!taken && errorTaken) {
      return (
        <div className="w-full flex flex-col items-center justify-center bg-red-50 border border-red-200 rounded-lg p-6 my-8">
          {!errorTaken ? (
            <>
              <Typography variant='body1' className="text-center mb-2">
                Take the Decision Profile Test to find out what type of decision maker you are!
              </Typography>
              <Button onClick={handleButtonClick} className="max-w-xs w-full mt-2">
                TAKE THE DECISION PROFILE QUIZ
              </Button>
            </>
          ) : (
            <Typography className="text-red-600">Sorry, we can't retrieve your test status</Typography>
          )}
        </div>
      )
    }

    if (!scores) return null

    return (
      <>
        <div className="flex flex-col md:flex-row items-center justify-between px-8 pb-6">
          <Typography variant='h4' className="font-bold text-primary">
            {getFirstName(userProfile.name)} Decision Profile
          </Typography>
          <Button onClick={handleButtonClick} className="rounded-xs h-8 mt-4 md:mt-0">
            Back
          </Button>
        </div>

        <div className="pb-6">
          <div className="flex items-center w-full">
            <div className="flex-none w-1/4 text-center mr-4">
              {scores['profiletype'] && (
                <img
                  src={`/images/decision-profile/${scores['profiletype']}.png`}
                  width={160}
                  height={160}
                  alt={scores['profiletype']}
                  className="mx-auto max-w-full h-auto rounded-full border shadow"
                />
              )}
            </div>
            <div className="flex-1">
              <Typography variant="h4" className="mb-2 font-semibold text-black">
                The {scores['profiletype'] ?? ''}
              </Typography>
              {scores['profiletype'] && (
                <div 
                  className="text-base text-black leading-7"
                  dangerouslySetInnerHTML={{ __html: profileDescriptions[scores['profiletype']] }} 
                />
              )}
            </div>
          </div>
        </div>
        <DecisionProfileTabs
          scores={scores}
          traitDescriptions={traitDescriptions}
          profileDynamicDescriptions={traitDynamicDescriptions}
        />
      </>
    )
  }

  return <div className="container mx-auto px-4 py-8">{renderContent()}</div>
}

export default authRoute(DecisionProfileReport)

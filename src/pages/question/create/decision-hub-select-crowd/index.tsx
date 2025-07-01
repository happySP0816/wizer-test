import { useEffect, useState, type FC } from 'react';
import { getDecisionHubCrowdStrength, getDecisionHubCrowds } from '@/apis/decision-hub'
import { Typography } from '@/components/components/ui/typography';
import DecisionHubReviewData from './decision-hub-review-data';
import DecisionHubSelectPeople from './decision-hub-select-people';
import DecisionHubSelectPanel from './decision-hub-select-pancel';

interface DecisionHubInvite {
  questionData: any
  setQuestionData: any
  setselectedCrowdPreview: any
  setdecisionCrowds: any
  setSelectedPeopleReview: any
  setStrengthReview: any
  user: any
}

const DecisionHubSelectCrowd: FC<DecisionHubInvite> = ({ questionData, setQuestionData, setselectedCrowdPreview, setdecisionCrowds, setSelectedPeopleReview, setStrengthReview, user }) => {
  const [decisionCrowds, setDecisionCrowds] = useState<any[]>([])
  const [selectedCrowds, setSelectedCrowds] = useState([])
  const [selectedMembers, setSelectedMembers] = useState<any[]>([])
  const [diversity, setDiversity] = useState(0)
  const [expertise, setExpertise] = useState(0)
  const [age, setAge] = useState(0)
  const [decisionPostStrength, setDecisionPostStrength] = useState(50)

  const handleCrowdStrength = async () => {
    try {
      const selectedUserIds = selectedMembers.map(member => member.user).filter(Boolean)
      const selectedCrowdIds = selectedCrowds.filter(Boolean)

      // Only make the API call if we have either selected users or crowds
      if (selectedUserIds.length > 0 || selectedCrowdIds.length > 0) {
        const requestData = {
          categoryId: questionData.categoryId,
          postCrowdParticipants: [
            ...selectedCrowdIds.map(crowdId => ({ crowdId })),
            ...selectedUserIds.map(userId => ({ userId: userId }))
          ]
        }

        const response = await getDecisionHubCrowdStrength(requestData)
        setDecisionPostStrength(response?.postCrowdStrength || 0)
        setDiversity(response?.diversity || 0)
        setExpertise(response?.expertise || 0)
        setAge(response?.age || 0)
      } else {
        setDecisionPostStrength(0)
      }
    } catch (error) {
      console.error('Error calculating crowd strength:', error)
      setDecisionPostStrength(0)
    }
  }

  const fetchData = async () => {
    try {
      const response = await getDecisionHubCrowds('')
      setDecisionCrowds(response || [])
    } catch (error) {
      console.error('Error fetching panels:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    handleCrowdStrength()

    setselectedCrowdPreview(selectedCrowds)
    setdecisionCrowds(decisionCrowds)
    setSelectedPeopleReview(selectedMembers)
    setStrengthReview(decisionPostStrength)
    const invites = []
    const slackInvites = []

    for (const crowdId of selectedCrowds) {
      invites.push({ crowdId: crowdId })
      slackInvites.push({ crowdId: crowdId })
    }

    for (const userId of selectedMembers) {
      invites.push({
        userId: userId.user
      })
      slackInvites.push({ userId: userId.user })
    }

    setQuestionData({
      ...questionData,
      invites: invites,
      DecisionHubCrowd_invites: slackInvites
    })
  }, [selectedMembers, selectedCrowds, decisionCrowds, decisionPostStrength])



  return (
    <div className='flex flex-col gap-[18px] px-[12px]'>
      <div className='grid lg:grid-cols-2 grid-cols-1 gap-4'>
        <div className='col-span-1'>
          <Typography variant="h3" className="font-bold text-black">
            Who will answer this question?
          </Typography>
          <Typography variant="h6" className="text-black">
            Pick your panels + individual people! The strength meter will tell you how strong your panel is and provide suggestions to improve strength.
          </Typography>
        </div>
        <div className='w-full col-span-1'>
          <Typography variant='h3' className='text-black'>Panel Strength</Typography>
          <div className="relative w-full p-0 m-0 mt-2 mb-1 pt-[10px]">
            <div className="meter-bar h-[12px] w-full rounded-full p-0 m-0 bg-gradient-to-r from-[#FF4D4D] via-[#FFA500] to-[#4CAF50]"></div>
            <div
              className={`pointer absolute top-0 w-0 h-0 -translate-x-1/2 m-0 p-0`}
              style={{
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '10px solid black',
                left: `${decisionPostStrength}%`,
              }}
            ></div>
            <div
              className={`pointer absolute ml-[-1px] top-2.5 w-0.5 h-3 bg-black`}
              style={{
                left: `${decisionPostStrength}%`,
              }}
            />
            <div className="labels flex justify-between mt-1 text-xs text-gray-500">
              <span>low</span>
              <span>moderate</span>
              <span>high</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid xl:grid-cols-3 grid-cols-1 gap-4 mt-4">
        <div className='col-span-1 h-full'>
          <Typography variant="h5" className='text-black italic'>
            1. Review Data
          </Typography>
          <div className='rounded-[10px] border border-[#BDBDBD] max-h-[800px] overflow-y-auto h-full'>
            <DecisionHubReviewData selectedMembers={selectedMembers} selectedCrowds={selectedCrowds} diversity={diversity} expertise={expertise} age={age} />
          </div>
        </div>
        <div className='col-span-1 h-full'>
          <Typography variant="h5" className='text-black italic'>
            2. Review Suggested People
          </Typography>
          <div className='rounded-[10px] border border-[#BDBDBD] max-h-[800px] overflow-y-auto h-full'>
            <DecisionHubSelectPeople selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} user={user} />
          </div>
        </div>
        <div className='col-span-1 h-full'>
          <Typography variant="h5" className='text-black italic'>
            3. Review Selected Panels
          </Typography>
          <div className='rounded-[10px] border border-[#BDBDBD] max-h-[800px] overflow-y-auto h-full'>
            <DecisionHubSelectPanel selectedCrowds={selectedCrowds} setSelectedCrowds={setSelectedCrowds} user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DecisionHubSelectCrowd

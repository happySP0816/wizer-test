import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/components/ui/dialog'
import { Typography } from '@/components/components/ui/typography'
import { getAllPostForFeed, getFetchPostId } from '@/apis/dashboard'
import type { Invite, Post } from '@/apis/dashboard'
import YourDecisionMaking from '@/global/dashboard/YourDecisionMaking'
import authRoute from '@/authentication/authRoute'
import { getDecisionHubPost, getDecisionHubPostAdmin, getDecisionHubPostListing, getDecisionHubPostListingAdmin, getDecisionHubTopic } from '@/apis/decision-hub'
import { Badge } from '@/components/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar'
import CompleteQuestion from './complete-question'
import { getNumberOfDaysLeft } from '@/helper'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/components/ui/pagination"
import DecisionHubQuestion from './create/decision-hub-question'
import { Box } from 'lucide-react'
import DecisionHubQuestionType from './create/decision-hub-question-type'
import DecisionHubYesOrNo from './create/decision-hub-yes-or-no'
import DecisionHubOpenEnded from './create/decision-hub-open-ended'
import DecisionHubMultipleChoice from './create/decision-hub-multiple-choice'

type UserProfileType = {
  username: string;
  id: number;
}

type MembershipType = {
  organization_id: number
  member_role: string
  small_decision: {
    organization_id: number
    member_role: string
  }
}

interface DashboardProps {
  userProfile: UserProfileType
  user: MembershipType
}

interface DecisionPost {
  post: {
    questionType: string
    owner: {
      id: number
      username: string
      image: string
      imageC: string | null
    }
    categoryId: number
    closed: boolean
    createdAt: number
    question: string
    description: string
    id: number
    expiresAt?: number
  }
}

interface DecisionTopic {
  category: {
    id: number
    title: string
  }
}

const Question: React.FC<DashboardProps> = (props) => {
  const [pageLoading, setPageLoading] = useState(false)
  const [isWizerOpen, setIsWizerOpen] = useState(false)
  const [isOrganizationOpen, setIsOrganizationOpen] = useState(false)
  const [invitePostData, setInvitePostData] = useState<Array<{ invite: Invite; post: Post | null }> | null>(null)
  const [timeOfDay, setTimeOfDay] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [livePostList, setLivePostList] = useState<DecisionPost[]>([])
  const [closedPostList, setClosedPostList] = useState<DecisionPost[]>([])
  const [decisionTopics, setDecisionTopics] = useState<DecisionTopic[]>([])
  const [page, setPage] = useState(1)
  const postsPerPage = 12

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [showCreateQuestion, setShowCreateQuestion] = useState<boolean>(false)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [questionData, setQuestionData] = useState<any>({
    question: '',
    description: '',
    questionType: '',
    options: [],
    medias: []
  })

  const setResetQuestionData = () => {
    setQuestionData({
      question: '',
      description: '',
      questionType: '',
      options: [],
      medias: []
    })
  }

  const fetchDecisionData = async () => {
    try {
      setPageLoading(true)
      if (props.user.small_decision.member_role === 'admin') {
        const decisionPostResponse = await getDecisionHubPostListingAdmin(props.user.small_decision.organization_id)
        const decisionClosedPostResponse = await getDecisionHubPostAdmin(props.user.small_decision.organization_id)
        const decisionTopicResponse = await getDecisionHubTopic()
        setDecisionTopics(decisionTopicResponse)
        setLivePostList(decisionPostResponse)
        setClosedPostList(decisionClosedPostResponse)
      }
      else {
        const decisionPostResponse = await getDecisionHubPostListing(props.user.small_decision.organization_id, props.userProfile.id)
        const decisionClosedPostResponse = await getDecisionHubPost(props.user.small_decision.organization_id, props.userProfile.id)
        const decisionTopicResponse = await getDecisionHubTopic()
        setDecisionTopics(decisionTopicResponse)
        setLivePostList(decisionPostResponse)
        setClosedPostList(decisionClosedPostResponse)
      }
      setPageLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchDecisionData()
  }, [])

  const startIndex = (page - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage

  const currentPosts = livePostList.slice(startIndex, endIndex)
  const currentClosedPosts = closedPostList.slice(startIndex, endIndex)

  const findMatchingCategoryTitle = (categoryId: number): string => {
    const matchingCategory = decisionTopics.find(topic => topic.category.id === categoryId)
    return matchingCategory ? matchingCategory.category.title : 'Unknown'
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const totalPages = Math.ceil(closedPostList.length / postsPerPage)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i)
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const componentMap = {
    multiple_choice: (
      <DecisionHubMultipleChoice
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        questionData={questionData}
        setQuestionData={setQuestionData}
      />
    ),
    ranking: (<></>),
    open_ended: <DecisionHubOpenEnded />,
    yes_or_no: <DecisionHubYesOrNo selectedImage={selectedImage} setSelectedImage={setSelectedImage} questionData={questionData} setQuestionData={setQuestionData} />
  }

  const setDisabledNextBtn = () => {
    switch (activeStep) {
      case 0:
        return questionData.question === '' || questionData.description === ''
      case 1:
        return questionData.questionType === ''
      case 2:
        if (questionData.questionType === 'yes_or_no') {
          return questionData.medias && questionData.medias.length <= 0
        }
        return questionData.options.length <= 1
    }
    return true
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <DecisionHubQuestion questionData={questionData} setQuestionData={setQuestionData} />
      case 1:
        return <DecisionHubQuestionType questionData={questionData} setQuestionData={setQuestionData} />
      case 2:
        return componentMap[questionData.questionType as keyof typeof componentMap]
      default:
        return 'Unknown step'
    }
  }

  return (
    <div className="!h-screen p-[30px] flex flex-col gap-8">
      {!showCreateQuestion ? <>
        <div className="flex items-center justify-between flex-none">
          <Typography className="flex items-center text-4xl font-bold">
            <img src={'/morning.svg'} className='w-8 h-8 mr-4' />
            Your Questions
          </Typography>
          <div className="flex gap-2">
            <Button className='rounded-4xl' onClick={() => {
              setActiveStep(0);
              setShowCreateQuestion(true);
            }}>
              Ask a new question
            </Button>
          </div>
        </div>
        {pageLoading ? (
          <div className="flex justify-center items-center flex-1">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
            <div className="col-span-12 flex flex-col h-full w-full gap-8">
              {/* live section */}
              <div className='flex-none'>
                <Typography variant="h6" className="mb-2.5 font-bold">
                  LIVE
                </Typography>
                <div className='flex flex-col gap-2.5'>
                  {livePostList.length !== 0 ? (
                    currentPosts.map((item, key) => {
                      const {
                        post: { owner, categoryId, createdAt, question, description, id, closed, expiresAt }
                      } = item

                      const closingTime = expiresAt ? getNumberOfDaysLeft(expiresAt) : null

                      return (
                        <div
                          key={`${id}`}
                          onClick={() => console.log(0)}
                        >
                          <CompleteQuestion
                            owner={owner}
                            categoryTitle={findMatchingCategoryTitle(categoryId)}
                            createdAt={createdAt}
                            question={question}
                            description={description}
                            closingTime={closingTime}
                            postId={id}
                            closed={closed}
                          />
                        </div>
                      )
                    })
                  ) : (
                    <Typography variant='h6'>Oops, no live decisions found</Typography>
                  )}
                </div>
              </div>
              {/* completed section */}
              <div className='flex-1'>
                <Typography variant="h6" className="mb-2.5 font-bold">
                  COMPLETED
                </Typography>
                <div className='flex flex-col gap-2.5'>
                  {closedPostList.length !== 0 ? (
                    currentClosedPosts.map((item, key) => {
                      const {
                        post: { owner, categoryId, createdAt, question, description, id, closed }
                      } = item

                      return (
                        <div key={`${id}`} onClick={() => console.log(0)} >
                          <CompleteQuestion
                            owner={owner}
                            categoryTitle={findMatchingCategoryTitle(categoryId)}
                            createdAt={createdAt}
                            question={question}
                            description={description}
                            postId={id}
                            closed={closed}
                          />
                        </div>
                      )
                    })
                  ) : (
                    <Typography variant='h6' className='text-black'>Oops, you don't have any decisions completed.</Typography>
                  )}
                </div>
              </div>
              <div className='flex justify-center w-full'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page > 1) handlePageChange(page - 1)
                        }}
                        className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>

                    {getVisiblePages().map((pageNumber, index) => (
                      <PaginationItem key={index}>
                        {pageNumber === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              handlePageChange(pageNumber as number)
                            }}
                            isActive={page === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page < totalPages) handlePageChange(page + 1)
                        }}
                        className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        )}
      </> : <>
        <div className='flex-1 flex flex-col justify-between gap-4 w-full pt-1.5 px-5 pb-2.5'>
          <div className='border border-gray-500 rounded-[10px] overflow-auto h-auto max-h-[calc(100vh-122px)]'>
            <div className='w-full flex justify-center p-[30px]' >
              <Typography className='font-bold !text-[16px] text-black'>
                {activeStep + 1} of 7
              </Typography>
            </div>
            <div className='flex flex-col px-8 pb-[60px] gap-[45px]'>
              {activeStep > 0 &&
                <div className='flex flex-col gap-4 bg-[#D7D2E7] rounded-[10px] p-4'>
                  <Typography variant="h3" className="font-bold text-black">
                    {questionData.question}
                  </Typography>
                </div>
              }
              {getStepContent(activeStep)}
            </div>
          </div>
          <div className={`flex-none flex ${activeStep === 0 ? 'justify-end' : 'justify-between'}`}>
            {activeStep >= 1 && (
              <Button
                variant='outline'
                onClick={() => setActiveStep(activeStep - 1)}
                className='border border-primary text-primary rounded-[5px] w-24 h-10 font-semibold'
              >
                PREVIOUS
              </Button>
            )}
            <div className='flex gap-1'>
              <Button variant='ghost' onClick={() => {
                setShowCreateQuestion(false)
                setActiveStep(0)
                setResetQuestionData()
              }} className='rounded-[5px] w-24 h-10 font-semibold'>
                CANCEL
              </Button>
              <Button
                onClick={() => setActiveStep(activeStep + 1)}
                className='rounded-[5px] w-24 h-10 font-semibold'
                disabled={setDisabledNextBtn()}
              >
                NEXT
              </Button>
            </div>
          </div>
        </div>
      </>}
    </div>
  )
}

export default authRoute(Question)

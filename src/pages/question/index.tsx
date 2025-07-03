import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/components/ui/button'
import { Typography } from '@/components/components/ui/typography'
import authRoute from '@/authentication/authRoute'
import { createDecisionHubPost, getDecisionHubPost, getDecisionHubPostAdmin, getDecisionHubPostListing, getDecisionHubPostListingAdmin, getDecisionHubTopic } from '@/apis/decision-hub'
import { toast } from 'sonner'
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
import DecisionHubQuestionType from './create/decision-hub-question-type'
import DecisionHubYesOrNo from './create/decision-hub-yes-or-no'
import DecisionHubOpenEnded from './create/decision-hub-open-ended'
import DecisionHubTopics from './create/decision-hub-topics'
import DecisionHubDuration from './create/decision-hub-duration'
import DecisionHubSelectCrowd from './create/decision-hub-select-crowd'
import DecisionHubPostPreview from './create/decision-hub-post-review'
import { Dialog, DialogContent } from "@/components/components/ui/dialog"
import { Loader2 } from "lucide-react"
import DecisionHubPostTotalPreview from './create/decision-hub-post-review/view'
import type { DecisionCrowd, SelectedPerson } from './create/decision-hub-post-review/types'
import Loading from '@/components/loading'

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
  const orgId = Number(props.user.small_decision.organization_id)
  const navigate = useNavigate()

  const [pageLoading, setPageLoading] = useState(false)
  const [livePostList, setLivePostList] = useState<DecisionPost[]>([])
  const [closedPostList, setClosedPostList] = useState<DecisionPost[]>([])
  const [decisionTopics, setDecisionTopics] = useState<DecisionTopic[]>([])
  const [page, setPage] = useState(1)
  const postsPerPage = 12

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const [selectedCrowdPreview, setselectedCrowdPreview] = useState<string[]>([])
  const [selecteddecisionCrowds, setdecisionCrowds] = useState<DecisionCrowd[]>([])
  const [selectedPeopleReview, setSelectedPeopleReview] = useState<SelectedPerson[]>([])
  const [strengthReview, setStrengthReview] = useState('')

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [showCreateQuestion, setShowCreateQuestion] = useState<boolean>(false)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [questionData, setQuestionData] = useState<any>({
    question: '',
    description: '',
    questionType: '',
    options: [],
    medias: [],
    categoryId: null,
    duration: 0,
    organizationId: Number(orgId),
    invites: [],
    DecisionHubCrowd_invites: []
  })

  const setResetQuestionData = () => {
    setQuestionData({
      question: '',
      description: '',
      questionType: '',
      options: [],
      medias: [],
      categoryId: null,
      duration: 0,
      organizationId: 0,
      invites: [],
      DecisionHubCrowd_invites: []
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
    ranking: (<></>),
    open_ended: <DecisionHubOpenEnded />,
    yes_or_no: <DecisionHubYesOrNo selectedImage={selectedImage as File} setSelectedImage={setSelectedImage} questionData={questionData} setQuestionData={setQuestionData} />
  }

  const validateFormData = () => {
    const { question, description, questionType, categoryId, duration, invites, organizationId } = questionData
    const errors = []

    if (!question || question.trim() === '') errors.push('Question is required')
    if (!description || description.trim() === '') errors.push('Description is required')
    if (!questionType || questionType.trim() === '') errors.push('Question type is required')
    if (!categoryId || categoryId <= 0) errors.push('Category is required')
    if (!duration || duration <= 0) errors.push('Duration is required')
    if (!invites || invites.length === 0) errors.push('At least one invite is required')
    if (!organizationId || organizationId <= 0) errors.push('Organization ID is required')

    return errors
  }

  const resetFormData = () => {
    setQuestionData({
      question: '',
      description: '',
      questionType: '',
      categoryId: 0,
      medias: '',
      duration: 0,
      options: [],
      invites: [],
      DecisionHubCrowd_invites: [],
      organizationId: 0,
      visibility: 'decision_hub'
    })
    setActiveStep(0)
    setselectedCrowdPreview([])
    setdecisionCrowds([])
    setSelectedPeopleReview([])
    setSelectedImage(null)
    setStrengthReview('')
  }

  const submitFormDataToAPI = async () => {
    try {
      setIsSubmitting(true)
      // Validate form data before submission
      const validationErrors = validateFormData()
      if (validationErrors.length > 0) {
        console.error('Validation errors:', validationErrors)
        toast(`Validation failed: ${validationErrors.join(', ')}`, {
          description: 'Please check the errors and try again.',
          duration: 5000,
        })
        return
      }

      // Prepare the data for submission
      const submissionData = { ...questionData }

      // Clean up empty medias field
      if (submissionData['medias'] === '' || submissionData['medias'] === null || submissionData['medias'] === undefined || submissionData['medias'].length === 0) {
        delete submissionData['medias']
      }

      // Transform options to match API expectations
      if (submissionData.options && submissionData.options.length > 0) {
        submissionData.options = submissionData.options.map((option: any) => {
          const transformedOption: any = {
            text: option.text || ''
          }

          // Include mediaId only if it exists
          if (option.mediaId) {
            transformedOption.mediaId = option.mediaId
          }

          return transformedOption
        })
      }

      // Ensure options array exists even if empty
      if (!submissionData.options) {
        submissionData.options = []
      }

      const response = await createDecisionHubPost(submissionData)
      if (response?.post) {
        sessionStorage.removeItem('selectedMedia')
        sessionStorage.removeItem('selectedMembers')

        toast.success('Question posted successful!', {
          description: 'Your question has been successfully posted.',
          duration: 5000,
          action: {
            label: 'View Question',
            onClick: () => {
              resetFormData()
              navigate('/ask-new-question')
            }
          }
        })

        setPreviewDialogOpen(false)
      } else {
        console.error('API response does not contain post:', response)
        toast.error('Something went wrong...', {
          description: 'Please try again later.'
        })
        sessionStorage.removeItem('selectedMedia')
        sessionStorage.removeItem('selectedMembers')
      }
    } catch (error) {
      console.error('API error:', error)
      // Show more specific error message to user
      const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || 'Something went wrong...'
      toast.error(`Error: ${errorMessage}`, {
        description: 'Please try again later.',
      })
      sessionStorage.removeItem('selectedMedia')
      sessionStorage.removeItem('selectedMembers')
    } finally {
      setIsSubmitting(false)
    }
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
      case 3:
        return questionData.categoryId === null
      case 4:
        return questionData.duration === 0
      case 5:
        return questionData.invites.length === 0
      case 6:
        const baseValidation = questionData.question.trim() !== '' &&
          questionData.description.trim() !== '' &&
          questionData.questionType.trim() !== '' &&
          questionData.categoryId > 0 &&
          questionData.duration > 0 &&
          questionData.invites?.length > 0
        if (questionData.questionType === 'yes_or_no') {
          return baseValidation && questionData.medias && questionData.medias.length > 0
        }
        return baseValidation && questionData.options.length > 0
      default:
        return true
    }
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <DecisionHubQuestion questionData={questionData} setQuestionData={setQuestionData} />
      case 1:
        return <DecisionHubQuestionType questionData={questionData} setQuestionData={setQuestionData} />
      case 2:
        return componentMap[questionData.questionType as keyof typeof componentMap]
      case 3:
        return <DecisionHubTopics questionData={questionData} setQuestionData={setQuestionData} />
      case 4:
        return <DecisionHubDuration questionData={questionData} setQuestionData={setQuestionData} />
      case 5:
        return <DecisionHubSelectCrowd questionData={questionData} setQuestionData={setQuestionData} user={props.user} setselectedCrowdPreview={setselectedCrowdPreview} setdecisionCrowds={setdecisionCrowds} setSelectedPeopleReview={setSelectedPeopleReview} setStrengthReview={setStrengthReview} />
      case 6:
        return <DecisionHubPostPreview strengthReview={Number(strengthReview)} submitFormDataToAPI={submitFormDataToAPI} />
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
          <Loading />
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
                    currentPosts.map((item) => {
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
                    currentClosedPosts.map((item) => {
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
                <div className='flex flex-col gap-4 bg-[#D7D2E7] rounded-[10px] p-[30px]'>
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
              {activeStep !== 6 ? (
                <Button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className='rounded-[5px] w-24 h-10 font-semibold'
                  disabled={setDisabledNextBtn()}
                >
                  NEXT
                </Button>
              ) : (
                <Button
                  onClick={() => setPreviewDialogOpen(true)}
                  className='rounded-[5px] w-24 h-10 font-semibold'
                  disabled={!setDisabledNextBtn()}
                >
                  VIEW
                </Button>
              )}
            </div>
          </div>
        </div>
      </>}
      <Dialog open={isSubmitting}>
        <DialogContent className="flex items-center justify-center min-h-[200px] min-w-[300px]">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 mb-6 animate-spin" />
            <Typography variant="body1">Your study has been sent!</Typography>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DecisionHubPostTotalPreview
            strengthReview={Number(strengthReview)}
            previewData={questionData}
            decisionCrowds={selecteddecisionCrowds}
            selectedCrowdPreview={selectedCrowdPreview}
            selectedPeopleReview={selectedPeopleReview}
            selectedImage={selectedImage as File}
            setActiveStep={setActiveStep}
          />
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setPreviewDialogOpen(false)}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={submitFormDataToAPI}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default authRoute(Question)

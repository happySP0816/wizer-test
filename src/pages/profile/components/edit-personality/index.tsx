import React, { useEffect, useState } from 'react'
import {
  editPersonalityQuestionsAnswers,
  getAllPersonalityQuestions,
  getUserPersonalityQuestions
} from '@/apis/profile'
import { Button } from '@/components/components/ui/button'
import Loading from '@/components/loading'
import { Input } from '@/components/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/components/ui/radio-group'
import { toast } from "sonner"
import LoadingButton from '@/components/components/ui/loading-button'

interface PersonalityQuestion {
  question?: string
  answer?: string | null
}

const options = [
  { value: '0', label: 'Strongly Disagree' },
  { value: '25', label: 'Disagree' },
  { value: '50', label: 'Neutral' },
  { value: '75', label: 'Agree' },
  { value: '100', label: 'Strongly Agree' }
]

const EditPersonality: React.FC<any> = ({ expertiseData }) => {
  const [personalityQuestions, setPersonalityQuestions] = useState<PersonalityQuestion[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchPersonalityQuestions = async () => {
    setLoading(true)
    const response = await getUserPersonalityQuestions()
    if (response) {
      if (response.personalityQuestionsAnswers.length > 0) {
        setPersonalityQuestions(response.personalityQuestionsAnswers)
      } else {
        const res = await getAllPersonalityQuestions()
        if (res) {
          const questions = res.personalityQuestions.map((question: any) => ({
            question: question.text,
            answer: null
          }))
          setPersonalityQuestions(questions)
        }
      }
    } else {
      toast.error('Unable to Fetch Personality Questions')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPersonalityQuestions()
  }, [])

  useEffect(() => {
    expertiseData(personalityQuestions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalityQuestions])

  const handleRadioChange = (value: string, index: number) => {
    if (!personalityQuestions) return
    const questions = [...personalityQuestions]
    questions[index].answer = value
    setPersonalityQuestions(questions)
  }

  const isAnyAnswerNull =
    !personalityQuestions || personalityQuestions.some(item => item.answer === null)

  const savePersonality = async () => {
    if (isAnyAnswerNull) {
      toast.error('Please answer all questions')
    } else {
      setSubmitLoading(true)
      const sanitizedQuestions = personalityQuestions.map(q => ({
        ...q,
        answer: q.answer ?? ''
      }))
      const res = await editPersonalityQuestionsAnswers(sanitizedQuestions)
      if (res) {
        toast.success('Personality Edit Successful')
      } else {
        toast.error('Unable to Edit Personality')
      }
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }


  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-8">
      <div>
        <div className="flex flex-col gap-8 mb-10">
          {personalityQuestions &&
            personalityQuestions.map((question, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="font-bold mb-2 text-center">{question.question}</div>
                <div className="flex flex-row gap-4">
                  <RadioGroup
                    name={`question-${index}`}
                    value={question.answer ?? ''}
                    onValueChange={value => handleRadioChange(value, index)}
                    className="flex flex-row gap-4"
                  >
                    {options.map(option => (
                      <label key={option.value} className="flex flex-col items-center cursor-pointer w-[100px]">
                        <RadioGroupItem
                          value={option.value}
                          className="accent-primary w-5 h-5"
                        />
                        <span className="text-xs mt-1">{option.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            ))}
        </div>
        <LoadingButton
          className="w-full mt-6"
          onClick={savePersonality}
          loading={submitLoading}
          loadingText="Submitting..."
          disabled={loading || submitLoading}
        >
          Submit
        </LoadingButton>
      </div>
    </div>
  )
}

export default EditPersonality

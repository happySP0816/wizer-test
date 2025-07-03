import React, { useEffect, useState } from 'react'
import { Label } from '@/components/components/ui/label'

import { getAllPersonalityQuestions, getUserPersonalityQuestions } from '@/apis/profile'

interface PersonalityQuestion {
  question: string;
  answer: string | null;
}

interface BlankPersonalityProps {
  setPersonalityQuestions: (questions: PersonalityQuestion[]) => void;
  personalityQuestions: PersonalityQuestion[];
  setSeverity: (severity: string) => void;
  setSnackbarMessage: (msg: string) => void;
  setSnackbarOpen: (open: boolean) => void;
}

const BlankPersonality: React.FC<BlankPersonalityProps> = ({
  setPersonalityQuestions,
  personalityQuestions,
  setSeverity,
  setSnackbarMessage,
  setSnackbarOpen
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const fetchPersonalityQuestions = async () => {
    setLoading(true)
    const response = await getUserPersonalityQuestions()
    if (response) {
      if (response.personalityQuestionsAnswers.length > 0) {
        const unansweredQuestions = response.personalityQuestionsAnswers.filter((q: any) => q.answer === null)
        setPersonalityQuestions(unansweredQuestions.map((q: any) => ({ question: q.question, answer: null })))
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
      setSeverity('error')
      setSnackbarMessage('Unable to Fetch Personality Questions')
      setSnackbarOpen(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPersonalityQuestions()
    // eslint-disable-next-line
  }, [])

  const handleRadioChange = (value: string, index: number) => {
    const questions = [...personalityQuestions]
    questions[index].answer = value
    setPersonalityQuestions(questions)
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
        <div className="flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-8 w-full">
              {personalityQuestions &&
                personalityQuestions.map((question: PersonalityQuestion, index: number) => (
                  <div key={index} className="flex flex-col items-center w-full">
                    <Label className="font-bold mb-4 text-center text-lg" htmlFor={`radio-group-${index}`}>{question.question}</Label>
                    <div className="flex flex-row gap-4 w-full justify-center">
                      {[
                        { value: '0', label: 'Strongly Disagree' },
                        { value: '25', label: 'Disagree' },
                        { value: '50', label: 'Neutral' },
                        { value: '75', label: 'Agree' },
                        { value: '100', label: 'Strongly Agree' }
                      ].map(option => (
                        <label key={option.value} className="flex flex-col items-center cursor-pointer mx-2">
                          <input
                            type="radio"
                            name={`radio-group-${index}`}
                            value={option.value}
                            checked={question.answer === option.value}
                            onChange={e => handleRadioChange(e.target.value, index)}
                            className="accent-primary w-5 h-5 mb-1"
                          />
                          <span className="text-xs font-medium text-gray-700 text-center" style={{ minWidth: 70 }}>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlankPersonality

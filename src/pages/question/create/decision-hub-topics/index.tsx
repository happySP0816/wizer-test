import { type FC, Fragment, memo, useEffect, useState } from 'react'
import { getDecisionHubTopic } from '@/apis/decision-hub'
import { Typography } from '@/components/components/ui/typography'
import { Badge } from '@/components/components/ui/badge'

interface Topic {
  id: number
  title: string
  category?: {
    id: number
    title: string
  }
}

interface DecisionHubTopicsProps {
  questionData: {
    categoryId: number
  },
  setQuestionData: (questionData: any) => void
}

const DecisionHubTopics: FC<DecisionHubTopicsProps> = ({ questionData, setQuestionData }) => {
  const { categoryId } = questionData
  const [decisionHubTopics, setDecisionHubTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const handleDecisionHubTopic = async () => {
    setIsLoading(true)
    try {
      const response = await getDecisionHubTopic()
      setDecisionHubTopics(response.map((topic: Topic) => topic.category))
    } catch (error) {
      console.error('Error fetching decision hub topics:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    handleDecisionHubTopic()
  }, [])

  const handleTopicClick = (topic: Topic) => {
    setQuestionData({
      ...questionData,
      categoryId: topic.id
    })
  }

  const MemoizedChip = memo(Badge, (prevProps, nextProps) => {
    return prevProps.children === nextProps.children
  })

  return (
    <div className='flex flex-col gap-[18px] px-[49px]'>
      <Typography variant="h3" className="font-bold text-black">
        What experience is required for this decision?
      </Typography>
      <Typography variant="h6" className="text-black">
        This will help Wizer determine the best people to answer your question.
      </Typography>
      <div className='flex flex-wrap gap-2'>
        {isLoading ? (
          <div className="flex items-center justify-center w-full py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">Loading topics...</span>
          </div>
        ) : (
          decisionHubTopics.map(topic => (
            <MemoizedChip
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              variant={categoryId === topic.id ? 'default' : 'outline'}
              className="rounded-full px-4 py-1 text-sm cursor-pointer"
            >
              {topic.title}
            </MemoizedChip>
          ))
        )}
      </div>
    </div>
  )
}

export default DecisionHubTopics

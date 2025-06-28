import { Input } from "@/components/components/ui/input";
import { Textarea } from "@/components/components/ui/textarea";
import { Typography } from "@/components/components/ui/typography";
import type { Dispatch, FC, SetStateAction } from "react";

interface DecisionHubQuestionProps {
  questionData: {
    question: string
    description: string
  }
  setQuestionData: Dispatch<SetStateAction<{ question: string; description: string }>>
}

const DecisionHubQuestion: FC<DecisionHubQuestionProps> = ({ questionData, setQuestionData }) => {
  const { question, description } = questionData

  return (
    <div className="flex flex-col gap-4 px-20 pb-[75px]">
      <div className="flex flex-col gap-7.5">
        <Typography variant="h3" className="font-bold text-black">
          Ask a new question
        </Typography>
        <div className="flex flex-col gap-1">
          <Typography variant="h6" className="font-bold text-black">
            Question
          </Typography>
          <Input
            value={question}
            onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })}
            placeholder="Ask something..."
          />
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="h6" className="font-bold text-black">
            Add some details
          </Typography>
          <Textarea
            value={description}
            onChange={(e) => setQuestionData({ ...questionData, description: e.target.value })}
            placeholder="Give some extra context to your question..."
            rows={18}
            className="h-[100px]"
          />
        </div>
      </div>
    </div>
  )
}

export default DecisionHubQuestion

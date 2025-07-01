import { Button } from "@/components/components/ui/button"
import { Typography } from "@/components/components/ui/typography"

interface DecisionHubPostPreviewProps {
  strengthReview: number
  submitFormDataToAPI: () => void
}
const DecisionHubPostPreview = ({
  strengthReview,
  submitFormDataToAPI
}: DecisionHubPostPreviewProps) => {

  return (
    <div className='flex flex-col gap-[18px] px-[12px]'>
      <div className='grid lg:grid-cols-2 grid-cols-1 gap-4'>
        <div className='col-span-1'>
          <Typography variant="h3" className="font-bold text-black">
            Review & Pos
          </Typography>
          <Typography variant="h6" className="text-black">
            Review your question here and post when ready!
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
                left: `${strengthReview}%`,
              }}
            ></div>
            <div
              className={`pointer absolute ml-[-1px] top-2.5 w-0.5 h-3 bg-black`}
              style={{
                left: `${strengthReview}%`,
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
      <div className="flex w-full justify-center mt-2 gap-5">
        {/* <Button variant='outline'>
          Save
        </Button> */}
        <Button variant='default' onClick={submitFormDataToAPI}>
          Send
        </Button>
      </div>
    </div>
  )
}

export default DecisionHubPostPreview

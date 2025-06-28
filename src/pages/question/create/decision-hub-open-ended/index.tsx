import { Typography } from '@/components/components/ui/typography'
import { type FC } from 'react'

const DecisionHubOpenEnded: FC = () => {
    return (
        <div className='flex flex-col gap-[18px] px-[49px] items-center'>
            <Typography variant="h3" className="font-bold text-black">
                Media and options cannot be selected for open-ended questions
            </Typography>
        </div>
    )
}

export default DecisionHubOpenEnded

import { Avatar, AvatarFallback, AvatarImage } from "@/components/components/ui/avatar"
import { Badge } from "@/components/components/ui/badge"
import { Typography } from "@/components/components/ui/typography"
import { WizerAssignmentIcon } from "@/components/icons"
import { useMemo } from "react"
import { useNavigate } from 'react-router-dom'

const CompleteQuestion = ({
    owner,
    categoryTitle,
    createdAt,
    question,
    description,
    closingTime,
    postId,
    closed
}: {
    owner: any
    categoryTitle: string
    createdAt: number
    question: string
    description: string
    closingTime?: string | null
    postId?: number
    closed?: boolean
}) => {

    const navigate = useNavigate()

    const getUserImage = useMemo(() => {
        if (!owner || !owner.image) {
          return '/defaultImage.svg'
        }
        if (owner.image.includes('googleusercontent')) {
          return owner.image
        }
        return `https://api.wizer.life/api/users/${owner.image}`
    }, [owner])

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000)
        const day = date.getDate()
        const month = date.toLocaleString('default', { month: 'long' })
        const year = date.getFullYear()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const ampm = hours >= 12 ? 'pm' : 'am'
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

        return {
            formattedDate: `${day} ${month} ${year}`,
            formattedTime: `${formattedHours}:${formattedMinutes} ${ampm}`
        }
    }
    
    const formattedTimestamp = useMemo(() => formatTimestamp(createdAt), [createdAt])

    const handleIconClick = () => {
      if (postId && closed) {
        navigate(`/decision-report?postId=${postId}`)
      }
    }
    
    return (
        <div className='border border-gray-400 rounded p-4 max-w-[1590px] w-full flex flex-col gap-1.5'>
            <div className='flex items-start gap-2 justify-between' onClick={() => console.log(0)}>
            <div className='flex items-center gap-2'>
                <Avatar className='w-15 h-15'>
                    <AvatarImage src={getUserImage} />
                    <AvatarFallback>
                        {owner.username}
                    </AvatarFallback>
                </Avatar>
                <div className='flex flex-col items-start justify-start'>
                    <Typography variant='body2' className='font-bold'>POSTED BY</Typography>
                    <div className='flex items-center gap-2'>
                        <span className='font-bold'>
                            {owner.username}
                        </span>
                        <span>
                            <Badge className="rounded-full">
                                {categoryTitle}
                            </Badge>
                        </span>
                    </div>
                </div>
            </div>
            <div>
                {closingTime && (
                    <Typography className='font-bold text-black'>
                        Voting Closes in
                        <span className="text-primary uppercase"> {closingTime}</span>
                    </Typography>
                )}
            </div>
            <div className='w-40'>
                <Typography variant='body1' className='font-bold'>{formattedTimestamp.formattedDate}</Typography>
                <Typography variant='body1' className='text-gray-500'>{formattedTimestamp.formattedTime}</Typography>
            </div>
            </div>
            <div className='flex justify-between flex-col pl-1.5'>
                <Typography variant='h3' className='text-black'>{question}</Typography>
                <Typography variant='body2' className='text-gray-500'>{description}</Typography>
            </div>
            {closed && (
                <div className="ml-auto cursor-pointer" onClick={handleIconClick}>
                    <WizerAssignmentIcon />
                </div>
            )}
        </div>
    )
}

export default CompleteQuestion
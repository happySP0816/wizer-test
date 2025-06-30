import { type FC, useState, useEffect } from 'react'
import { Button } from '@/components/components/ui/button'
import { Typography } from '@/components/components/ui/typography'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/components/ui/dialog'
import { Input } from '@/components/components/ui/input'
interface ButtonData {
  label: string
  duration: number | string
}
interface Props {
  questionData: {
    duration: number
  },
  setQuestionData: (questionData: any) => void
}

const buttonData: ButtonData[] = [
  { label: '1 WEEK', duration: 604800 },
  { label: '1 DAY', duration: 86400 },
  { label: 'OTHER', duration: 'Other' }
]

const DecisionHubDuration: FC<Props> = ({ questionData, setQuestionData }) => {
  const [activeButton, setActiveButton] = useState<number | string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [durationValues, setDurationValues] = useState<{ [key: string]: string }>({
    HOURS: '',
    DAYS: '',
    WEEKS: ''
  })
  const [savedValue, setSavedValue] = useState<string>('')

  useEffect(() => {
    if (questionData.duration) {
      const selectedButton = buttonData.find(button => button.duration === questionData.duration)
      if (selectedButton) {
        setActiveButton(selectedButton.duration)
      } else {
        setActiveButton('Other')
        const weeks = Math.floor(questionData.duration / 604800);
        const days = Math.floor((questionData.duration % 604800) / 86400);
        const hours = Math.floor((questionData.duration % 86400) / 3600);

        const formattedDuration = [
          weeks > 0 ? `${weeks}W` : '',
          days > 0 ? `${days}D` : '',
          hours > 0 ? `${hours}H` : ''
        ].filter(Boolean).join(' ');

        setSavedValue(formattedDuration);
      }
    }
  }, [questionData.duration])

  const handleButtonClick = (duration: number | string) => {
    if (duration === 'Other') {
      setEditDialogOpen(true)
      if (questionData.duration > 0) {
        const weeks = Math.floor(questionData.duration / 604800)
        const remainingDays = Math.floor((questionData.duration % 604800) / 86400)
        const remainingHours = Math.floor((questionData.duration % 86400) / 3600)
        setDurationValues({
          WEEKS: weeks > 0 ? weeks.toString() : '',
          DAYS: remainingDays > 0 ? remainingDays.toString() : '',
          HOURS: remainingHours > 0 ? remainingHours.toString() : ''
        })
      } else {
        setDurationValues({ WEEKS: '', DAYS: '', HOURS: '' })
      }
    } else {
      setEditDialogOpen(false)
      if (typeof duration === 'number') {
        setActiveButton(duration)
        setQuestionData({
          ...questionData,
          duration: duration
        })
      }
    }
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>, duration: string) => {
    const inputValue = e.target.value
    if (/^\d{0,3}$/.test(inputValue)) {
      setDurationValues(prevValues => ({
        ...prevValues,
        [duration]: inputValue
      }))
    }
  }

  const handleSaveButtonClick = () => {
    setActiveButton('Other')
    const hours = parseInt(durationValues.HOURS) || 0
    const days = parseInt(durationValues.DAYS) || 0
    const weeks = parseInt(durationValues.WEEKS) || 0
    const totalSeconds = (hours * 3600) + (days * 86400) + (weeks * 604800)
    if (totalSeconds === 0) {
      return
    }
    let displayText = ''
    if (weeks > 0) displayText += `${weeks}W `
    if (days > 0) displayText += `${days}D `
    if (hours > 0) displayText += `${hours}H`
    displayText = displayText.trim()
    setSavedValue(displayText)
    setEditDialogOpen(false)
    setQuestionData({
      ...questionData,
      duration: totalSeconds
    })
  }

  const DialogButtonData: ButtonData[] = [
    { label: 'HOURS', duration: 'HOURS' },
    { label: 'DAYS', duration: 'DAYS' },
    { label: 'WEEKS', duration: 'WEEKS' }
  ]

  return (
    <div className='flex flex-col gap-[18px] px-[49px]'>
      <Typography variant="h3" className="font-bold text-black">
        When does your question expire?
      </Typography>
      <Typography variant="h6" className="text-black">
        Pick a date / time when voting will end.
      </Typography>
      <div className='flex flex-wrap gap-2'>
        {buttonData?.map(button => (
          <div
            key={button.duration}
            onClick={() => handleButtonClick(button.duration)}
            className={`flex flex-col items-center justify-center w-[96px] h-[115px] rounded-lg border-2 transition-all duration-200
              ${activeButton === button.duration ? 'bg-[#7B69AF] border-[#7B69AF] text-white shadow-lg cursor-pointer' :
                'bg-white border-gray-300 text-black cursor-pointer'}`}
          >
            {button.duration === 'Other' && savedValue ? savedValue : button.label}
          </div>
        ))}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img
                src='/backBtn.svg'
                onClick={() => setEditDialogOpen(false)}
                alt='back'
                className="cursor-pointer"
              />
              <Typography component='span' className='font-bold text-black'>Custom Duration</Typography>
            </DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2 items-center'>
              <Typography component='h2' className='font-bold text-black'>How long should your question be active?</Typography>
              <Typography component='span' className='text-gray-500'>You can select a number of hours, days, or weeks:</Typography>
            </div>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-wrap gap-4 justify-around'>
                {DialogButtonData.map(button => (
                  <div key={button.duration} className="flex flex-col gap-2 items-center">
                    <Typography component='span'>{button.label}</Typography>
                    <Input
                      type='number'
                      value={durationValues[button.duration as string] || ''}
                      onChange={(e: any) => handleDurationChange(e, button.duration as string)}
                      className="w-20 h-[35px] rounded-[10px] text-center"
                    />
                  </div>
                ))}
              </div>
              <Button variant='default' onClick={handleSaveButtonClick} className="px-5 py-2.5 rounded-4xl text-[16px] font-bold">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DecisionHubDuration

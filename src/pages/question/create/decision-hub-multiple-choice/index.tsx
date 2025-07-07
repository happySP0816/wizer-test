import React, { type FC, useEffect, useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { Card, CardContent } from '@/components/components/ui/card'
import { Typography } from '@/components/components/ui/typography'
import { Textarea } from '@/components/components/ui/textarea'
import { Loader2, X, Plus } from 'lucide-react'
import { toast } from 'sonner'

const MAX_OPTION_LENGTH = 256

interface OptionData {
  image: File | null
  text: string
  isLoading?: boolean
}

interface Props {
  questionData: any
  selectedImage: any
  onMediaSelect: (data: { image: File | null; text: string }, index: number, optionData: OptionData[]) => void
  setSnackbarOpen: (open: boolean) => void
  setSnackbarMessage: (message: string) => void
  setSeverity: (severity: string) => void
}

const initializeComponentState = (questionData: any, selectedImage: any) => {
  let initialOptionData: OptionData[] = []

  if (selectedImage && selectedImage.length > 0) {
    initialOptionData = selectedImage.map((imageData: any) => ({
      image: imageData.image,
      text: imageData.text
    }))
  } else if (questionData.options && questionData.options.length > 0) {
    initialOptionData = questionData.options.map((option: { text: string }) => ({ image: null, text: option.text }))
  } else {
    initialOptionData = [{ image: null, text: '' }]
  }

  return initialOptionData
}

const DecisionHubMultipleChoice: FC<Props> = ({ questionData, selectedImage, onMediaSelect }) => {
  const [optionData, setOptionData] = useState<OptionData[]>(
    questionData.options && questionData.options.length
      ? questionData.options.map((option: { text: string }) => ({ image: null, text: option?.text, isLoading: false }))
      : [{ image: null, text: '', isLoading: false }]
  )
  const [editMode, setEditMode] = useState<boolean[]>([false])
  const [deleteIconVisible, setDeleteIconVisible] = useState<boolean[]>([false])
  const initialFileSizeErrors: string[][] = optionData.map(() => [])
  const [fileSizeErrors, setFileSizeErrors] = useState<string[][]>(initialFileSizeErrors)

  const handleUploadImage = (index: number): void => {
    const fileSelector = document.createElement('input')
    fileSelector.type = 'file'
    fileSelector.accept = 'image/*'
    fileSelector.onchange = () => {
      const files = [...(fileSelector.files as FileList)]
      const updatedOptionData = [...optionData]
      const selectedFile = files[0]

      if (selectedFile) {
        const fileSizeInMB = selectedFile.size / (1024 * 1024)
        if (fileSizeInMB > 6) {
          const updatedFileSizeErrors = [...fileSizeErrors]
          updatedFileSizeErrors[index] = ['File size should not exceed 6MB']
          setFileSizeErrors(updatedFileSizeErrors)
          return
        } else {
          const updatedFileSizeErrors = [...fileSizeErrors]
          updatedFileSizeErrors[index] = []
          setFileSizeErrors(updatedFileSizeErrors)
        }
        
        updatedOptionData[index].image = selectedFile
        updatedOptionData[index].isLoading = true
        setOptionData(updatedOptionData)

        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          if (progress > 100) {
            clearInterval(interval)
            updatedOptionData[index].isLoading = false
            setOptionData(updatedOptionData)
            onMediaSelect({ image: selectedFile, text: updatedOptionData[index].text }, index, optionData)
            const updatedDeleteIconVisible = [...deleteIconVisible]
            updatedDeleteIconVisible[index] = true
            setDeleteIconVisible(updatedDeleteIconVisible)
            toast.success('Media uploaded successfully!')
          } else {
            setOptionData(updatedOptionData)
          }
        }, 200)
      }
    }
    fileSelector.click()
  }

  const handleDeleteImage = (index: number): void => {
    const updatedOptionData = [...optionData]
    updatedOptionData[index].image = null
    setOptionData(updatedOptionData)

    const updatedDeleteIconVisible = [...deleteIconVisible]
    updatedDeleteIconVisible[index] = false
    setDeleteIconVisible(updatedDeleteIconVisible)
  }

  const handleTextChange = (index: number, newText: string): void => {
    const updatedOptionData = [...optionData]
    newText = newText.replace(/"/g, '')

    if (newText.length > MAX_OPTION_LENGTH) {
      newText = newText.slice(0, MAX_OPTION_LENGTH)
    }
    updatedOptionData[index].text = newText

    setOptionData(updatedOptionData)
    onMediaSelect({ image: updatedOptionData[index].image, text: newText }, index, optionData)
  }

  const handleRemoveBox = (index: number): void => {
    const updatedOptionData = [...optionData]
    updatedOptionData.splice(index, 1)
    setOptionData(updatedOptionData)

    const updatedEditMode = [...editMode]
    updatedEditMode.splice(index, 1)
    setEditMode(updatedEditMode)

    const updatedDeleteIconVisible = [...deleteIconVisible]
    updatedDeleteIconVisible.splice(index, 1)
    setDeleteIconVisible(updatedDeleteIconVisible)

    const updatedFileSizeErrors = [...fileSizeErrors]
    updatedFileSizeErrors.splice(index, 1)
    setFileSizeErrors(updatedFileSizeErrors)
  }

  const handleAddOption = (index: number): void => {
    const currentOption = optionData[index]
    const updatedEditMode = [...editMode]
    updatedEditMode[index] = !updatedEditMode[index]
    onMediaSelect(
      { image: currentOption.image, text: currentOption.text },
      index,
      optionData
    )
    setEditMode(updatedEditMode)
  }

  useEffect(() => {
    setOptionData(initializeComponentState(questionData, selectedImage))
  }, [questionData, selectedImage])

  const optionBoxes = optionData.map((option, index) => (
    <Card key={index} className="w-full md:w-[calc(50%-1rem)] p-4">
      <CardContent className="p-0 space-y-4">
        {option.isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-16 w-16 animate-spin" />
          </div>
        ) : option.image ? (
          <div className="relative">
            <img 
              src={URL.createObjectURL(option.image as File)} 
              alt="Uploaded image" 
              className="w-full h-32 object-cover rounded"
            />
            {!editMode[index] && (
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                onClick={() => handleDeleteImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : null}

        <div className="space-y-2">
          <Typography variant="h6" className="font-semibold">Option text</Typography>
          <Textarea
            placeholder="Enter the option..."
            value={option.text}
            maxLength={MAX_OPTION_LENGTH}
            disabled={editMode[index]}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTextChange(index, e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <Typography variant="caption" className="text-muted-foreground">
            {option.text?.length}/{MAX_OPTION_LENGTH} characters
          </Typography>
          {fileSizeErrors[index] && fileSizeErrors[index].length > 0 && (
            <Typography variant="caption" className="text-destructive">
              {fileSizeErrors[index]}
            </Typography>
          )}
        </div>

        {!option.image && (
          <Button 
            variant="outline" 
            onClick={() => handleUploadImage(index)}
            className="w-full"
          >
            UPLOAD MEDIA
          </Button>
        )}

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleRemoveBox(index)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleAddOption(index)}
            className="flex-1"
          >
            {editMode[index] ? 'Edit' : 'Add'}
          </Button>
        </div>
      </CardContent>
    </Card>
  ))

  const AddAnotherOptionBox = (): React.ReactElement | null => {
    if (optionData.length < 4) {
      return (
        <Card 
          className="w-full md:w-[calc(50%-1rem)] p-4 border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => {
            setOptionData([...optionData, { image: null, text: '', isLoading: false }])
            setEditMode([...editMode, false])
            setDeleteIconVisible([...deleteIconVisible, false])
            setFileSizeErrors([...fileSizeErrors, []])
          }}
        >
          <CardContent className="p-0 flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-gray-500">
              <Plus className="h-6 w-6" />
              <Typography variant="body1">Add another option +</Typography>
            </div>
          </CardContent>
        </Card>
      )
    } else {
      return null
    }
  }

  return (
    <div className="flex flex-col gap-[18px] px-[49px]">
      <Typography variant="h3" className="font-bold text-black">
        Add your answer options
      </Typography>
      <Typography variant="h6" className="text-black">
        You can add up to 4 options!
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {optionBoxes}
        <AddAnotherOptionBox />
      </div>
    </div>
  )
}

export default DecisionHubMultipleChoice

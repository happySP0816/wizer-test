import React, { useState, useEffect } from 'react'
import { Button } from '@/components/components/ui/button'
import { Card, CardContent } from '@/components/components/ui/card'
import { toast } from 'sonner'
import { Typography } from '@/components/components/ui/typography'

interface DecisionHubYesOrNoProps {
  onMediaSelect: (file: File | null) => void
}

const DecisionHubYesOrNo: React.FC<DecisionHubYesOrNoProps> = ({ onMediaSelect }) => {
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null)
  const [selectedMediaFile, setSelectedMediaFile] = useState<string | null>(null)

  useEffect(() => {
    const savedMedia = sessionStorage.getItem('selectedMedia')
    if (savedMedia) {
      const { fileType, fileUrl } = JSON.parse(savedMedia)
      setSelectedMediaType(fileType)
      setSelectedMediaFile(fileUrl)
    }
  }, [])

  const handleMediaInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileType = file.type
      const fileUrl = URL.createObjectURL(file)

      if (fileType.startsWith('image')) {
        const img = new Image()
        img.onload = () => {
          setSelectedMediaType(fileType)
          setSelectedMediaFile(fileUrl)
          onMediaSelect(file)
          toast.success('Image uploaded successfully!')
          sessionStorage.setItem('selectedMedia', JSON.stringify({ fileType, fileUrl }))
        }
        img.onerror = () => {
          toast.error('Failed to upload image. Please try again.')
        }
        img.src = fileUrl
      } else if (fileType.startsWith('video')) {
        setSelectedMediaType(fileType)
        setSelectedMediaFile(fileUrl)
        onMediaSelect(file)
        toast.success('Video uploaded successfully!')
        sessionStorage.setItem('selectedMedia', JSON.stringify({ fileType, fileUrl }))
      }
    }
  }

  const handleClearMedia = () => {
    setSelectedMediaType(null)
    setSelectedMediaFile(null)
    onMediaSelect(null)
    sessionStorage.removeItem('selectedMedia')
  }

  const handleAddMedia = () => {
    if (selectedMediaFile && selectedMediaType) {
      const fileInput = document.getElementById('mediaInput') as HTMLInputElement
      const file = fileInput?.files?.[0]
      if (file) {
        onMediaSelect(file)
      }
    }
  }

  return (
    <div className='flex flex-col gap-[18px] px-[49px]'>
      <Typography variant="h3" className="font-bold text-black">
        Add your media below
      </Typography>
      <Typography variant="h6" className="text-black">
        Add an image or video to accompany your question if you like.
      </Typography>
      <Card className="border-2 border-dashed border-[#A9A9D9] bg-[#E9E3F6] p-4 rounded-lg max-w-[430px] ml-0">
        <CardContent className="p-0">
          {selectedMediaFile && (
            <div className="mb-4">
              {selectedMediaType?.startsWith('image') ? (
                <img
                  src={selectedMediaFile}
                  alt="Selected media"
                  className="w-full max-w-full h-auto mx-auto block rounded"
                />
              ) : (
                <video
                  src={selectedMediaFile}
                  controls
                  loop
                  autoPlay
                  className="w-full max-w-full h-auto mx-auto block rounded"
                />
              )}
            </div>
          )}
          <input
            type="file"
            id="mediaInput"
            accept="image/*, video/*"
            className="hidden"
            onChange={handleMediaInputChange}
          />
          <label
            htmlFor="mediaInput"
            className="block mb-4 cursor-pointer border border-dashed border-[#A9A9D9] p-2 text-center bg-[#F6F3FB] rounded hover:bg-[#E9E3F6] transition-colors"
          >
            UPLOAD MEDIA
          </label>
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleClearMedia}
              className="flex-1"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleAddMedia}
              disabled={!selectedMediaFile}
              className="flex-1"
            >
              ADD
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DecisionHubYesOrNo

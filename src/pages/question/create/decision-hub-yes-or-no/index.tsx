import { useState, useEffect, type FC } from 'react'
import { Typography } from '@/components/components/ui/typography'
import { uploadDecisionPostImage, uploadDecisionPostVideo } from '@/apis/decision-hub'
import { toast } from 'sonner'

interface Props {
  selectedImage: File | null
  setSelectedImage: (value: File | null) => void
  questionData: any
  setQuestionData: (value: any) => void
}

interface MediaData {
  fileType: string
  fileUrl: string
  fileName: string
}

const DecisionHubYesOrNo: FC<Props> = ({ selectedImage, setSelectedImage, questionData, setQuestionData }) => {
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null)
  const [selectedMediaFile, setSelectedMediaFile] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [isMediaSaved, setIsMediaSaved] = useState(false)

  useEffect(() => {
    const savedMedia = sessionStorage.getItem('selectedMedia')
    if (savedMedia) {
      const { fileType, fileUrl } = JSON.parse(savedMedia)
      setSelectedMediaType(fileType)
      setSelectedMediaFile(fileUrl)
    }
  }, [])

  useEffect(() => {
    const savedMedia = sessionStorage.getItem('selectedMedia')
    if (savedMedia) {
      const { fileType, fileUrl, fileName } = JSON.parse(savedMedia) as MediaData
      setSelectedMediaType(fileType)
      setSelectedMediaFile(fileUrl)
      setSelectedFileName(fileName)
      setIsMediaSaved(true)
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
          setSelectedImage(file)
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
        setSelectedImage(file)
        toast.success('Video uploaded successfully!')
        sessionStorage.setItem('selectedMedia', JSON.stringify({ fileType, fileUrl }))
      }
    }
  }

  const handleClearMedia = () => {
    setSelectedMediaType(null)
    setSelectedMediaFile(null)
    setSelectedImage(null)
    sessionStorage.removeItem('selectedMedia')
  }

  const handleAddMedia = () => {
    if (selectedMediaFile && selectedMediaType) {
      const fileInput = document.getElementById('mediaInput') as HTMLInputElement
      const file = fileInput && fileInput.files && fileInput.files[0]
      if (file) {
        setSelectedImage(file)
      }
    }
  }

  useEffect(() => {
    const uploadMedia = async () => {
      if (selectedImage) {
        try {
          let response
          if (selectedImage.type.includes('image')) {
            response = await uploadDecisionPostImage(selectedImage)
          } else {
            response = await uploadDecisionPostVideo(selectedImage)
          }
          if (response.id) {
            setQuestionData({
              ...questionData,
              medias: [
                {
                  id: response.id
                }
              ]
            })
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    uploadMedia()
  }, [selectedImage])

  const isImage = selectedMediaType?.startsWith('image')
  const isVideo = selectedMediaType?.startsWith('video')

  return (
    <div className='flex flex-col gap-[18px] px-[49px]'>
      <Typography variant="h3" className="font-bold text-black">
        Add your media below
      </Typography>
      <Typography variant="h6" className="text-black">
        Add an image or video to accompany your question if you like.
      </Typography>

      <div className="flex flex-col gap-4 mt-4">
        {/* File Upload Area */}
        <div className="relative">
          <input
            type='file'
            id='mediaInput'
            accept='image/*, video/*'
            className="hidden"
            onChange={handleMediaInputChange}
          />
          <label
            htmlFor='mediaInput'
            className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-lg font-medium text-gray-700">Upload Media</span>
              <span className="text-sm text-gray-500">Click to select image or video</span>
            </div>
          </label>
        </div>

        {/* Media Preview */}
        {selectedMediaFile && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Selected Media</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${isMediaSaved
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
                }`}>
                {isMediaSaved ? 'Added' : 'Not Added'}
              </span>
            </div>

            <div className="mb-4">
              {isImage && (
                <img
                  src={selectedMediaFile}
                  alt="Preview"
                  className="max-w-full h-auto max-h-64 rounded-lg object-contain"
                />
              )}
              {isVideo && (
                <video
                  src={selectedMediaFile}
                  controls
                  className="max-w-full h-auto max-h-64 rounded-lg"
                />
              )}
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p><strong>File:</strong> {selectedFileName}</p>
              <p><strong>Type:</strong> {selectedMediaType}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedMediaFile && (
          <div className="flex gap-4">
            <button
              onClick={handleClearMedia}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMedia}
              disabled={isMediaSaved}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${isMediaSaved
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {isMediaSaved ? 'Added' : 'Add Media'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DecisionHubYesOrNo

import * as React from 'react'
import type { FC } from 'react'

const MAX_OPTION_LENGTH = 256

interface OptionData {
  images: File[]
  text: string
  isLoading?: boolean
}

const DecisionHubMultipleChoice: FC<any> = ({
  selectedImage,
  setSelectedImage,
  questionData,
  setQuestionData,
  onMediaSelect,
}) => {
  const [optionData, setOptionData] = React.useState<OptionData[]>(
    questionData.options && questionData.options.length
      ? questionData.options.map((option: { text: string }) => ({
          images: [],
          text: option?.text,
          isLoading: false,
        }))
      : [{ images: [], text: '', isLoading: false }]
  )
  const [editMode, setEditMode] = React.useState<boolean[]>([false])
  const [fileSizeErrors, setFileSizeErrors] = React.useState<string[][]>(
    optionData.map(() => [])
  )

  const handleUploadImages = (index: number, files: FileList | null) => {
    if (!files) return
    const updatedOptionData = [...optionData]
    let newFiles: File[] = []
    let error = ''
    Array.from(files).forEach((file) => {
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > 6) {
        error = 'File size should not exceed 6MB'
      } else {
        newFiles.push(file)
      }
    })
    if (error) {
      const updatedFileSizeErrors = [...fileSizeErrors]
      updatedFileSizeErrors[index] = [error]
      setFileSizeErrors(updatedFileSizeErrors)
      return
    } else {
      const updatedFileSizeErrors = [...fileSizeErrors]
      updatedFileSizeErrors[index] = []
      setFileSizeErrors(updatedFileSizeErrors)
    }
    updatedOptionData[index].images = [
      ...(updatedOptionData[index].images || []),
      ...newFiles,
    ]
    setOptionData(updatedOptionData)
    onMediaSelect(
      { images: updatedOptionData[index].images, text: updatedOptionData[index].text },
      index,
      optionData
    )
  }

  const handleDeleteImage = (optionIdx: number, imgIdx: number) => {
    const updatedOptionData = [...optionData]
    updatedOptionData[optionIdx].images = updatedOptionData[optionIdx].images.filter(
      (_, i) => i !== imgIdx
    )
    setOptionData(updatedOptionData)
    onMediaSelect(
      { images: updatedOptionData[optionIdx].images, text: updatedOptionData[optionIdx].text },
      optionIdx,
      optionData
    )
  }

  const handleTextChange = (index: number, newText: string) => {
    const updatedOptionData = [...optionData]
    newText = newText.replace(/"/g, '')
    if (newText.length > MAX_OPTION_LENGTH) {
      newText = newText.slice(0, MAX_OPTION_LENGTH)
    }
    updatedOptionData[index].text = newText
    setOptionData(updatedOptionData)
    onMediaSelect(
      { images: updatedOptionData[index].images, text: newText },
      index,
      optionData
    )
  }

  const handleRemoveBox = (index: number) => {
    const updatedOptionData = [...optionData]
    updatedOptionData.splice(index, 1)
    setOptionData(updatedOptionData)
    setEditMode((prev) => prev.filter((_, i) => i !== index))
    setFileSizeErrors((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddOption = () => {
    setOptionData([...optionData, { images: [], text: '', isLoading: false }])
    setEditMode([...editMode, false])
    setFileSizeErrors([...fileSizeErrors, []])
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">Add your answer options</h2>
      <p className="mb-6 text-gray-600">You can add up to 4 options!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {optionData.map((option, index) => (
          <div key={index} className="bg-purple-100 rounded-lg p-4 shadow relative">
            <div className="flex flex-wrap gap-2 mb-2">
              {option.images.map((img, imgIdx) => (
                <div key={imgIdx} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Uploaded ${imgIdx}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:bg-opacity-100"
                    onClick={() => handleDeleteImage(index, imgIdx)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <label className="block mb-1 font-medium">Option text</label>
            <textarea
              className="w-full p-2 border rounded mb-1"
              rows={3}
              maxLength={MAX_OPTION_LENGTH}
              value={option.text}
              onChange={(e) => handleTextChange(index, e.target.value)}
              disabled={editMode[index]}
              placeholder="Enter the option..."
            />
            <div className="text-xs text-gray-500 mb-2">
              {option.text.length}/{MAX_OPTION_LENGTH} characters
            </div>
            {fileSizeErrors[index] && (
              <div className="text-xs text-red-500 mb-2">{fileSizeErrors[index]}</div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="mb-2"
              onChange={(e) => handleUploadImages(index, e.target.files)}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleRemoveBox(index)}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
        {optionData.length < 4 && (
          <button
            type="button"
            className="border-2 border-dashed border-purple-400 rounded-lg flex items-center justify-center p-8 text-purple-500 hover:bg-purple-50 transition"
            onClick={handleAddOption}
          >
            Add another option +
          </button>
        )}
      </div>
    </div>
  )
}

export default DecisionHubMultipleChoice

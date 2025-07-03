type StakeholderCardsProps = {
  data: (
    | {
        name: string
        title: string
        participation: number
        image: string
      }
    | {
        name: string
        participation: null
        image: null
        title?: undefined
      }
  )[]
}

const StakeholderCards = (props: StakeholderCardsProps) => {
  const getUserImageSrc = (image: string | null) => {
    if (!image) return null
    if (image.includes('googleusercontent')) {
      return image
    } else {
      return `https://api.wizer.life/api/users/${image}`
    }
  }

  const capitalizeName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <div className="p-8">
      <div className="text-2xl font-bold mb-6">Top Performers</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {props.data.map((stakeholder, index) => (
          <div
            key={index}
            className="border border-black rounded-lg p-6 flex flex-col items-center justify-center bg-white"
          >
            {stakeholder.name ? (
              <>
                {/* Profile Section */}
                <div className="flex flex-col items-center gap-2 mb-6 w-full">
                  {stakeholder.image ? (
                    <img
                      src={getUserImageSrc(stakeholder.image) || undefined}
                      alt={stakeholder.name}
                      className="w-10 h-10 rounded-full border-2 border-[#7B69AF] object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-[#7B69AF] bg-gray-200" />
                  )}
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-base">{capitalizeName(stakeholder.name)}</span>
                    {stakeholder.title && (
                      <span className="text-xs text-gray-500">{stakeholder.title}</span>
                    )}
                  </div>
                </div>

                {/* Circular Progress Section */}
                {typeof stakeholder.participation === 'number' && (
                  <div className="relative flex justify-center items-center w-20 h-20 mb-2">
                    <svg width="100%" height="100%" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#bcbcbb"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="white"
                        stroke="#A080FC"
                        strokeWidth="3"
                        strokeDasharray={`${stakeholder.participation}, 100`}
                        strokeDashoffset="0"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <span className="absolute text-lg font-bold text-gray-900">
                      {stakeholder.participation}%
                    </span>
                  </div>
                )}

                {/* Participation Label */}
                <span className="font-bold text-sm text-gray-500">Participation</span>
              </>
            ) : (
              <span className="text-lg font-bold">Employee Cards</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StakeholderCards
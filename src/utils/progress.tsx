import { useState, useEffect } from 'react'
import type { FC } from 'react'

interface ProgressProps {
  size: number
  value: number
  thickness: number
  color: string
}

const Progress: FC<ProgressProps> = ({ size, value, thickness, color }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(value)
  }, [value])

  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const offset = ((100 - progress) / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      <circle cx={size / 2} cy={size / 2} r={radius} fill='transparent' stroke='#BDBDBD' strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill='transparent'
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap='butt'
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
      />
      <text x='50%' y='50%' fontSize={size * 0.35} textAnchor='middle' dominantBaseline='middle' style={{ fontWeight: 900 }} className="fill-black">
        {progress}
      </text>
    </svg>
  )
}

export default Progress

// Simple fixed size for useResponsiveSize
export const useResponsiveSize = () => {
  return { size: 100, thickness: 10 }
}

export const getColor = (value: number) => {
  if (value <= 25) {
    return '#F72585'
  } else if (value <= 50) {
    return '#7c10a7'
  } else if (value <= 75) {
    return '#F7A325'
  } else if (value < 100) {
    return '#69AF92'
  } else if (value === 100) {
    return '#69AF92'
  }
  return 'black'
}

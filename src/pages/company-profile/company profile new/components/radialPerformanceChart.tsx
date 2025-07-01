import React, { useRef, useEffect, useState } from 'react'
import { calculateArcPath, calculateLabelPosition, splitText } from '../utils/chartUtils'
import { calculateBaseCirclePath, calculateStraightLineCoordinates } from '../utils/radialChartUtils'

type RadialPerformanceChartProps = {
  data: {
    label: string
    percentage: number
    votes: string
    color: string
    radius: number
  }[]
}

const RadialPerformanceChart: React.FC<RadialPerformanceChartProps> = ({ data }) => {
  const chartRef = useRef<SVGSVGElement | null>(null)
  const [chartSize, setChartSize] = useState(200)

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const width = chartRef.current.parentElement?.offsetWidth || 200
        setChartSize(width > 200 ? 200 : width)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const chartCenter = chartSize / 2
  const totalPercentage = 100

  const labelPositions = [
    { x: chartCenter + 130, y: chartCenter - 60 },
    { x: chartCenter + 130, y: chartCenter + 60 },
    { x: chartCenter - 130, y: chartCenter + 60 },
    { x: chartCenter - 130, y: chartCenter - 60 },
    { x: chartCenter + 130, y: chartCenter },
    { x: chartCenter, y: chartCenter - 130 },
  ]

  let cumulativeAngle = -Math.PI / 2

  const segments = data.map((segment, index) => {
    const startAngle = cumulativeAngle
    const angle = (segment.percentage / totalPercentage) * 2 * Math.PI
    const endAngle = startAngle + angle
    cumulativeAngle = endAngle

    let path
    if (segment.percentage === 100) {
      path = `
        M ${chartCenter} ${chartCenter - segment.radius}
        A ${segment.radius} ${segment.radius} 0 1 1 ${chartCenter} ${chartCenter + segment.radius}
        A ${segment.radius} ${segment.radius} 0 1 1 ${chartCenter} ${chartCenter - segment.radius}
      `
    } else {
      const arcPath = calculateArcPath(startAngle, endAngle, segment.radius, chartCenter, chartCenter)
      path = `
        M ${arcPath.startX} ${arcPath.startY}
        A ${segment.radius} ${segment.radius} 0 ${arcPath.largeArcFlag} 1 ${arcPath.endX} ${arcPath.endY}
      `
    }

    const midAngle = startAngle + (angle / 2)
    const connectionPoint = {
      x: chartCenter + Math.cos(midAngle) * segment.radius,
      y: chartCenter + Math.sin(midAngle) * segment.radius
    }

    let labelPosition;
    if (segment.percentage === 0) {
      const zeroIndex = data.filter((s) => s.percentage === 0).indexOf(segment);
      const totalZero = data.filter((s) => s.percentage === 0).length;
    
      const arcStart = -Math.PI  - (Math.PI / 4);
      const arcEnd = -Math.PI  + (Math.PI / 4);
    
      const angle = arcStart + (zeroIndex / (totalZero - 1)) * (arcEnd - arcStart);
    
      const zeroRadius = chartCenter + 40; 
    
      labelPosition = {
        x: chartCenter + Math.cos(angle) * zeroRadius,
        y: chartCenter + Math.sin(angle) * zeroRadius,
      };
    } else {
      const labelRadius = segment.radius + 40;
      labelPosition = {
        x: chartCenter + Math.cos(midAngle) * labelRadius,
        y: chartCenter + Math.sin(midAngle) * labelRadius,
      };
    }

    return {
      path,
      labelPosition,
      color: segment.color,
      label: segment.label,
      percentage: segment.percentage,
      votes: segment.votes,
      radius: segment.radius,
      connectionPoint,
      basePath: calculateBaseCirclePath(segment.radius, chartCenter),
      midAngle
    }
  })

  return (
    <div className="relative flex justify-center items-center w-full h-[100%]">
      <svg ref={chartRef} width="100%" height="100%" viewBox={`0 0 ${chartSize} ${chartSize}`} overflow="visible">
        {segments.map((segment, index) => (
          <path
            key={`base-${index}`}
            d={segment.basePath}
            stroke="#e0e0e0"
            strokeWidth="1"
            fill="none"
          />
        ))}

        {segments.map((segment, index) => (
          <path key={`segment-${index}`} d={segment.path} stroke={segment.color} strokeWidth="8" fill="none" />
        ))}

        <circle cx={chartCenter} cy={chartCenter} r="8" fill="#000" />

        {segments.map((segment, index) => {
          const { x: labelX, y: labelY } = segment.labelPosition
          const { x: connectionX, y: connectionY } = segment.connectionPoint
          const labelLines = splitText(segment.label, 10)
          
          const isLeftSide = labelX < chartCenter
          const isTopLabel = Math.abs(labelY - (chartCenter - 130)) < 10
          const extendedX = isLeftSide
            ? chartCenter - segment.radius - 10
            : chartCenter + segment.radius + 10
          const linePath = `
            M ${connectionX} ${connectionY}
            L ${labelX} ${labelY}
          `;

          return (
            <g key={`label-${index}`}>
              <path
                d={linePath}
                stroke="#000"
                strokeWidth="1"
                fill="none"
              />

              <text
                x={labelX}
                y={labelY}
                fontSize="12"
                textAnchor={labelX < chartCenter ? "end" : "start"}
                alignmentBaseline={labelY < chartCenter ? "baseline" : "hanging"}
                className="font-bold"
              >
                {labelLines.map((line, i) => (
                  <tspan key={i} x={labelX} dy={i === 0 ? '' : '1.2em'}>
                    {line}
                  </tspan>
                ))}
                <tspan> ({segment.percentage.toFixed(0)}%)</tspan>
              </text>

              <text
                x={labelX}
                y={labelY + labelLines.length * 14}
                fontSize="10"
                textAnchor={isTopLabel ? "start" : (isLeftSide ? "end" : "start")}
                alignmentBaseline="middle"
                fill="#555"
              >
                {segment.votes} people voted
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default RadialPerformanceChart
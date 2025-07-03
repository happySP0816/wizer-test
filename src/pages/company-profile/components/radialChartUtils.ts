export const calculateArcPath = (
  radius: number,
  percentage: number,
  chartCenter: number,
  startAngle: number = (-Math.PI * Math.random()) / 2 
): string => {
  if (percentage === 100) {

    return `
      M ${chartCenter} ${chartCenter - radius}
      A ${radius} ${radius} 0 1 1 ${chartCenter} ${chartCenter + radius}
      A ${radius} ${radius} 0 1 1 ${chartCenter} ${chartCenter - radius}
    `
  }

  const endAngle = startAngle + (percentage / 100) * 2 * Math.PI 
  const largeArcFlag = percentage > 50 ? 1 : 0

  const startX = chartCenter + radius * Math.cos(startAngle)
  const startY = chartCenter + radius * Math.sin(startAngle)
  const endX = chartCenter + radius * Math.cos(endAngle)
  const endY = chartCenter + radius * Math.sin(endAngle)

  return `
    M ${startX} ${startY}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
  `
}

export const calculateBaseCirclePath = (radius: number, chartCenter: number): string => {
  return `
    M ${chartCenter} ${chartCenter - radius}
    A ${radius} ${radius} 0 1 1 ${chartCenter} ${chartCenter + radius}
    A ${radius} ${radius} 0 1 1 ${chartCenter} ${chartCenter - radius}
  `
}

export const splitText = (text: string, maxChars: number): string[] => {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + word).length > maxChars) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine += (currentLine ? ' ' : '') + word
    }
  }

  lines.push(currentLine) 

  return lines
}

export const calculateMidpoint = (
  radius: number,
  percentage: number,
  chartCenter: number
): { x: number; y: number } => {
  const midAngle = -Math.PI / 2 + (percentage / 100) * Math.PI
  const x = chartCenter + radius * Math.cos(midAngle)
  const y = chartCenter + radius * Math.sin(midAngle)

  return { x, y }
}

export const calculateStraightLineCoordinates = (
  x1: number,
  y1: number,
  labelX: number,
  labelY: number
): { x2: number; y2: number } => {
  const isHorizontal = Math.abs(labelX - x1) > Math.abs(labelY - y1) 

  if (isHorizontal) {

    return { x2: labelX, y2: y1 }
  } else {

    return { x2: x1, y2: labelY }
  }
}

export const generateRadialPerformanceChartData = () => {
  const percentages = [33, 50, 100, 60, 87.5]

  return [
    {
      label: 'Admin',
      percentage: Math.random() > 0.5 ? percentages[0] + 1 : percentages[0] - 1,
      votes: '1/3',
      color: '#4dc9f0',
      radius: 70
    },
    {
      label: 'Accounting',
      percentage: Math.random() > 0.5 ? percentages[1] + 1 : percentages[1] - 1,
      votes: '1/2',
      color: '#68af92',
      radius: 55
    },
    {
      label: 'Design',
      percentage: Math.random() > 0.5 ? percentages[2] + 0 : percentages[2] - 1,
      votes: '1/1',
      color: '#a07ffc',
      radius: 40
    },
    {
      label: 'Customer Service',
      percentage: Math.random() > 0.5 ? percentages[3] + 0 : percentages[3] - 1,
      votes: '3/5',
      color: '#ffd420',
      radius: 85
    },
    {
      label: 'Sales',
      percentage: Math.random() > 0.5 ? percentages[4] + 0 : percentages[4] - 1,
      votes: '7/8',
      color: '#fc8dca',
      radius: 100
    }
  ]
}

export const calculateArcPath = (
  startAngle: number,
  endAngle: number,
  radius: number,
  centerX: number,
  centerY: number
) => {
  const startX = centerX + radius * Math.cos(startAngle)
  const startY = centerY + radius * Math.sin(startAngle)
  const endX = centerX + radius * Math.cos(endAngle)
  const endY = centerY + radius * Math.sin(endAngle)
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

  return {
    startX,
    startY,
    radius,
    largeArcFlag,
    endX,
    endY
  }
}

export const calculateLabelPosition = (angle: number, radius: number, centerX: number, centerY: number) => {
  const x = centerX + radius * Math.cos(angle)
  const y = centerY + radius * Math.sin(angle)

  return { x, y }
}

export const splitText = (text: string, maxChars: number): string[] => {
  const words = typeof text === 'string' ? text.split(' ') : text;
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

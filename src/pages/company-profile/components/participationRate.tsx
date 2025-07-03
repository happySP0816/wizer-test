import { calculateLabelPosition, splitText } from './chartUtils';

type ParticipationRateSegment = {
  label: string;
  value: number;
  total: number;
  color: string;
};

type ParticipationRateProps = {
  data: ParticipationRateSegment[];
};

const ParticipationRate = ({ data }: ParticipationRateProps) => {
  const total = data.reduce((sum: number, segment: ParticipationRateSegment) => sum + segment.total, 0);
  const filteredData = data.filter((segment: ParticipationRateSegment) => segment.value > 0);
  const calculatedTotal = filteredData.reduce((sum: number, segment: ParticipationRateSegment) => sum + segment.value, 0);
  const centerX = 200;
  const centerY = 200;
  const radius = 130;
  const innerRadius = 80;

  if (calculatedTotal === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <svg width="500" height="500" viewBox="-50 0 500 500">
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              fontSize="16"
              fill="#555"
            >
              No data to display
            </text>
          </svg>
        </div>
      </div>
    );
  }

  let cumulativeAngle = -Math.PI / 2;
  const segments = filteredData.map((segment: ParticipationRateSegment, index: number) => {
    let path;

    if (filteredData.length === 1) {
      path =
        `M ${centerX} ${centerY - radius}` +
        `A ${radius} ${radius} 0 1 1 ${centerX} ${centerY + radius}` +
        `A ${radius} ${radius} 0 1 1 ${centerX} ${centerY - radius}` +
        `L ${centerX} ${centerY - innerRadius}` +
        `A ${innerRadius} ${innerRadius} 0 1 0 ${centerX} ${centerY + innerRadius}` +
        `A ${innerRadius} ${innerRadius} 0 1 0 ${centerX} ${centerY - innerRadius} Z`;
    } else {
      const startAngle = cumulativeAngle;
      const angle = (segment.value / calculatedTotal) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      cumulativeAngle = endAngle;

      const arcStartX = centerX + radius * Math.cos(startAngle);
      const arcStartY = centerY + radius * Math.sin(startAngle);
      const arcEndX = centerX + radius * Math.cos(endAngle);
      const arcEndY = centerY + radius * Math.sin(endAngle);

      const innerStartX = centerX + innerRadius * Math.cos(endAngle);
      const innerStartY = centerY + innerRadius * Math.sin(endAngle);
      const innerEndX = centerX + innerRadius * Math.cos(startAngle);
      const innerEndY = centerY + innerRadius * Math.sin(startAngle);

      path = `M ${arcStartX} ${arcStartY}
        A ${radius} ${radius} 0 ${angle > Math.PI ? 1 : 0} 1 ${arcEndX} ${arcEndY}
        L ${innerStartX} ${innerStartY}
        A ${innerRadius} ${innerRadius} 0 ${angle > Math.PI ? 1 : 0} 0 ${innerEndX} ${innerEndY} Z`;
    }

    const midAngle = cumulativeAngle - (segment.value / calculatedTotal) * Math.PI;
    const labelPosition = calculateLabelPosition(midAngle, radius + 30, centerX, centerY);
    const linePosition = calculateLabelPosition(midAngle, radius, centerX, centerY);

    return {
      path,
      labelPosition,
      linePosition,
      color: segment.color,
      label: segment.label,
      value: segment.value,
    };
  });

  return (
    <div className="p-6">
      <div className="flex justify-center">
        <svg width="500" height="500" viewBox="-50 0 500 500">
          {segments.map((segment, index) => (
            <path key={index} d={segment.path} fill={segment.color} strokeWidth={2} />
          ))}
          {segments.map((segment, index) => {
            const { x } = segment.labelPosition;
            const { x: lineX, y: lineY } = segment.linePosition;
            const labelLines = splitText(segment.label, 10);

            return (
              <g key={index}>
                <line
                  x1={lineX < centerX ? lineX + 20 : lineX - 20}
                  y1={lineY}
                  x2={x > centerX ? x + 20 : x - 20}
                  y2={lineY}
                  stroke="#000"
                  strokeWidth="1"
                />
                <text
                  x={lineX < centerX ? lineX + 20 : lineX - 20}
                  y={lineY}
                  textAnchor={x > centerX ? 'start' : 'end'}
                  alignmentBaseline="middle"
                  fontSize={12}
                  fill="#555"
                >
                  <tspan x={x > centerX ? x + 25 : x - 25} fontWeight="bold" fontSize="19px" dy="0">
                    {segment.value}%
                  </tspan>
                  {labelLines.map((line: string, i: number) => (
                    <tspan key={i} x={x > centerX ? x + 25 : x - 25} dy="1.4em">
                      {line} Employees
                    </tspan>
                  ))}
                  <tspan key="engage" x={x > centerX ? x + 25 : x - 25} dy="1.4em">
                    Engaged
                  </tspan>
                </text>
              </g>
            );
          })}
          <text x={centerX} y={centerY - 10} fontSize="24" fontWeight="bold" textAnchor="middle">
            {total}
          </text>
          <text x={centerX} y={centerY + 15} fontSize="12" textAnchor="middle" fill="#555">
            Total People
          </text>
          <text x={centerX} y={centerY + 30} fontSize="12" textAnchor="middle" fill="#555">
            Engaged
          </text>
        </svg>
      </div>
    </div>
  );
};

export default ParticipationRate;

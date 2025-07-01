import React, { useRef, useState, useEffect } from 'react';

type StackedBarChartProps = {
  data: {
    group: string;
    values: number[];
    total: number;
    labels: string[];
  }[];
};

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  const colors = [
    '#4dc9f0','#7b69af', '#3edaa6', '#505db0','#5CD6E8', '#7B69AF', '#505DB0', '#FFD421', '#F72585', '#3EDAA6', 
    '#69AF92', '#F7A325', '#3357FF', '#FF33A1', '#FFCC00'
  ];
  const baseWidth = 700;
  const chartHeight = data.length * 50 + 50;
  const maxTotal = data.reduce((sum, d) => sum + d.total, 0) + 30;
  const tickInterval = 5;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setScale(width >= 1024 ? 1.0 : width / 1024);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const scaledWidth = baseWidth * scale;
  const barHeight = 20;
  const barSpacing = 50;

  return (
    <div className="p-6" ref={containerRef}>
      <div className="font-bold text-lg mb-4">Engagement at a Glance</div>
      <div className="relative flex flex-col items-center w-full min-h-[500px]">
        {/* Y-axis labels */}
        <div className="absolute left-5 top-[115px] flex flex-col items-start w-[215px] h-[calc(100%-40px)] pr-2 justify-between gap-2">
          <div className="text-left font-medium">GROUPS</div>
          {data.map((d, i) => (
            <div
              key={d.group}
              className="text-left h-[20px] flex items-center translate-y-1/2 text-sm text-gray-500"
            >
              {d.group}
            </div>
          ))}
        </div>

        <div className="flex justify-start items-start w-full">
          <svg width={scaledWidth} height={chartHeight}>
            {/* Bars */}
            {data.map((d, i) => {
              let xOffset = 120;

              return (
                <g key={d.group}>
                  {d.values.map((value, j) => {
                    const barWidth = (value / maxTotal) * scaledWidth;
                    const rect = (
                      <rect 
                        key={j} 
                        x={xOffset} 
                        y={i * 50 + 20} 
                        width={barWidth} 
                        height={barHeight} 
                        fill={colors[j]} 
                      />
                    );
                    xOffset += barWidth;
                    return rect;
                  })}
                  <text x={xOffset + 5} y={i * barSpacing + 35} fontSize="12" fill="#555">
                    {d.total}
                  </text>
                </g>
              );
            })}

            {/* X-axis */}
            <line 
              x1="120" 
              y1={chartHeight - 20} 
              x2={scaledWidth + 120} 
              y2={chartHeight - 20} 
              stroke="#000" 
            />
            {Array.from({ length: Math.ceil(maxTotal / tickInterval) + 1 }, (_, i) => {
              const value = i * tickInterval;
              const xPosition = 120 + (value / maxTotal) * scaledWidth;

              return (
                <g key={i}>
                  <line 
                    x1={xPosition} 
                    y1={chartHeight - 20} 
                    x2={xPosition} 
                    y2={chartHeight - 15} 
                    stroke="#000" 
                  />
                  <text 
                    x={xPosition} 
                    y={chartHeight - 5} 
                    fontSize="12" 
                    fill="#555" 
                    textAnchor="middle"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
            <line x1="120" y1="0" x2="120" y2={chartHeight - 20} stroke="#000" />
          </svg>
        </div>

        {/* Legend */}
        <div className="absolute right-0 top-0 flex flex-col gap-1">
          {data
            .flatMap((d) => d.labels)
            .filter((label, index, self) => label && self.indexOf(label) === index) // Remove duplicates
            .map((label, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-[15px] h-[15px]" style={{ backgroundColor: colors[i % colors.length] }} />
                <span className="text-sm">{label}</span>
              </div>
            ))}
        </div>

        <div className="flex justify-center items-center w-full mt-4">
          <span className="text-base font-normal">
            NUMBER OF QUESTIONS ASKED ({data.reduce((sum, d) => sum + d.total, 0)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default StackedBarChart;

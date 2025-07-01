import React, { useState, useRef, useEffect } from 'react'
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { splitText } from '../utils/chartUtils'

interface DiversityCardProps {
  data: any;
}

interface PieDataItem {
  name: string;
  percentage: number;
  color: string;
}

const DiversityCard = (data: DiversityCardProps) => {
  const [selectedView, setSelectedView] = useState<string>('Internal');
  const [selected, setSelected] = useState<string>('Diversity');
  const displayedPercentages = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    displayedPercentages.current.clear();
  }, [data, selectedView]);

  const handleButtonClick = (view: string) => {
    setSelectedView(view); 
  };

  const options = ['Diversity', 'Expertise'];
  const renderPieChart = (dataArr: PieDataItem[], title: string) => {
    if (!dataArr || dataArr.length === 0) {
      return (
        <div className="p-4 w-full sm:w-1/2">
          <div className="text-lg font-semibold mb-4">{title}</div>
          <div className="w-full h-[300px] flex items-center justify-center">
            <span className="text-gray-400 font-bold text-base">No Data Available</span>
          </div>
        </div>
      );
    }

    const formattedData = dataArr.map((item: PieDataItem) => ({
      ...item,
      percentage: parseFloat(item.percentage as any) || 0,
    }));

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, percentage, payload }: any) => {
      const roundedPercentage = Math.round(percentage);
      const key = `${roundedPercentage}-${title}`;
      if (displayedPercentages.current.has(key)) {
        return null;
      }
  
      const maxPercentage = Math.max(...dataArr.map((d: PieDataItem) => Math.round(d.percentage)));
      const minPercentage = Math.min(...dataArr.map((d: PieDataItem) => Math.round(d.percentage)));
      if (roundedPercentage !== maxPercentage && roundedPercentage !== minPercentage) {
        return null;
      }
      displayedPercentages.current.add(key);

      const RADIAN = Math.PI / 180;
      const radius = outerRadius + 30;
      
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
      const textRadius = radius + 10;
      const textX = cx + textRadius * Math.cos(-midAngle * RADIAN);
      const textY = cy + textRadius * Math.sin(-midAngle * RADIAN);
  
      const textAnchor = x > cx ? 'start' : 'end';
      const labelLines = splitText(name, 10)

      return (
        <g>
          {/* Line from pie to label */}
          <line
            x1={cx + (outerRadius + 5) * Math.cos(-midAngle * RADIAN)}
            y1={cy + (outerRadius + 5) * Math.sin(-midAngle * RADIAN)}
            x2={x}
            y2={y}
            stroke="#666"
            strokeWidth={1}
          />
          {/* Percentage text */}
          <text
            x={textX}
            y={textY - 10}
            textAnchor={textAnchor}
            fill="#323232"
            fontSize="19.86px"
            fontWeight="bold"
            dominantBaseline="middle"
          >
            {`${(percentage).toFixed(0)}%`}
          </text>
          {/* Label text */}
          <text
            x={textX}
            y={textY + 10}
            textAnchor={textAnchor}
            fill="#323232"
            fontSize="12px"
            dominantBaseline="middle"
          >
            {/* {truncatedLabel} */}
            {labelLines.map((line: string, i: number) => (
                  <tspan key={i} x={textX} dy={i === 0 ? '' : '1.2em'}>
                    {line}
                  </tspan>
                ))}
          </text>
        </g>
      );
    };

    return (
      <div className="p-4 w-full sm:w-1/2">
        <div className="text-lg font-semibold mb-4">{title}</div>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
              <Pie
                data={formattedData}
                cx="40%"
                cy="50%"
                innerRadius={70}
                outerRadius={140}
                fill="#8884d8"
                dataKey="percentage"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {formattedData.map((entry: PieDataItem, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="top"
                height={380}
                wrapperStyle={{
                  overflow: 'hidden', 
                  whiteSpace: 'pre-wrap', 
                  width: '250px', 
                }}
                formatter={(value: string) => {
                  const item = formattedData.find((d: PieDataItem) => d.name === value);
                  return <span style={{ color: '#000', fontSize: '12px' }}>{`${value} (${item ? Math.round(item.percentage) : 0}%)`}</span>;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-8">
      <div className="pl-11 pb-8 flex justify-start gap-2">
        {options.map((option: string, index: number) => (
          <span
            key={option}
            className={`cursor-pointer text-base ${selected === option ? 'underline font-bold' : ''} text-primary`}
            onClick={() => setSelected(option)}
          >
            {option}
            {index < options.length - 1 && <span className="pl-2">|</span>}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-start pl-11 pb-[70px]">
        <div className="w-full md:w-1/2 mt-2">
          <div className="text-base mt-2">
            Displayed below is a comprehensive analysis showcasing the diversity and expertise of your staff.
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <div className="text-center w-full">
            <div className="text-lg font-bold text-black">YOUR DIVERSITY SCORE</div>
            <div className="flex justify-center gap-1 mt-1">
              {[0, 25, 50, 75, 85].map((threshold: number, idx: number) => (
                <span
                  key={idx}
                  className="inline-block rounded"
                  style={{
                    width: '38.61px',
                    height: '19.31px',
                    backgroundColor: data.data[selectedView].diversityScore >= threshold ? '#F7A325' : '#BDBDBD'
                  }}
                />
              ))}
            </div>
            <div className="italic text-xs mt-1">
              {data.data[selectedView].diversityScore >= 50 
                ? (data.data[selectedView].diversityScore >= 75 ? 'excellent' : 'good') 
                : 'poor'
              }
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2 px-11">
        <span className="text-base">Select view:</span>
        <div className="flex gap-1">
          {['Internal', 'External', 'All'].map((view: string) => (
            <button
              key={view}
              className={`px-3 py-1 rounded text-sm font-medium ${selectedView === view ? 'bg-[#7B69AF] text-white' : 'bg-[#E9E9E9] text-[#767676]'} hover:bg-[#6A5A9F] transition`}
              onClick={() => handleButtonClick(view)}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
      <div className="border-b border-black mx-11 mb-3" />
      {selected.includes('Diversity') && (
        <div className="flex flex-wrap justify-center max-w-full mx-auto">
          {renderPieChart(data.data[selectedView].genderData, "Gender")}
          {renderPieChart(data.data[selectedView].ethnicityData, "Ethnicity")}
          {renderPieChart(data.data[selectedView].educationData, "Education")}
          {renderPieChart(data.data[selectedView].professionData, "Profession")}
        </div>
      )}
      {selected.includes('Expertise') && (
        <div className="flex flex-wrap px-11">
          {renderPieChart(data.data[selectedView].expertiseData, "Expertise")}
        </div>
      )}
    </div>
  )
}

export default DiversityCard
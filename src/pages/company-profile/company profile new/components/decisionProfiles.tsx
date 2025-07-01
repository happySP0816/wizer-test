import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { profileDescriptions } from '../utils/profileDescriptions'

interface DecisionProfilesDashboardProps {
  data: any[];
}

const DecisionProfilesDashboard = ({ data }: DecisionProfilesDashboardProps) => {
  const RADIAN = Math.PI / 180;

  const formattedData = data.map(item => ({
    ...item,
    percentage: parseFloat(item.percentage) || 0,
  }));
  const hasData = formattedData.some(item => item.percentage > 0);
  data = data.sort((a, b) => b.percentage - a.percentage);

  const renderCustomLabelLine = (props: any) => {
    const { payload } = props;
    const largestSlice = formattedData.reduce((max, item) =>
      item.percentage > max.percentage ? item : max,
      formattedData[0]
    );
    if (payload.name !== largestSlice.name) {
      return <g />;
    }
    return <line {...props} stroke="none" />;
  };

  const renderLargestSliceLabel = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, payload } = props;
    const midAngle = (startAngle + endAngle) / 2;
    const midAngleRad = RADIAN * midAngle;
    const largestSlice = formattedData.reduce((max, item) =>
      item.percentage > max.percentage ? item : max,
      formattedData[0]
    );
    if (payload.name !== largestSlice.name) {
      return <g />;
    }
    const labelRadius = outerRadius * 1.4;
    const x = cx + labelRadius * Math.cos(-midAngleRad);
    const y = cy + labelRadius * Math.sin(-midAngleRad);
    return (
      <g>
        <line
          x1={cx + outerRadius * Math.cos(-midAngleRad)}
          y1={cy + outerRadius * Math.sin(-midAngleRad)}
          x2={x}
          y2={y}
          stroke="#666"
          strokeWidth={1}
        />
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          style={{ fontSize: '14px' }}
        >
          ({payload.percentage.toFixed(0)}%) {payload.name}
        </text>
      </g>
    );
  };

  if (!hasData) {
    // Render placeholder if no data
    return (
      <div>
        <div className="flex flex-wrap gap-8">
          {/* Left side - Profile List */}
          <div className="w-full md:w-1/2 pl-9 pb-4">
            <div className="pl-9 text-lg font-bold">Decision Profiles of your People (by percentage of total count)</div>
            <div className="flex flex-row pt-6 pl-9 mt-10 gap-4">
              <div className="flex-1 flex flex-col gap-6">
                {data.slice(0, 4).map((item, index) => (
                  <div key={`left-${index}`} className="flex flex-col mt-6 first:mt-0">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full" style={{ backgroundColor: item.color, width: 20, height: 20 }} />
                      <span className="text-[20px] font-bold text-[#323232]">The {item.name}</span>
                      <span className="text-[17px] text-black">{item.percentage != null ? `${item.percentage.toFixed(0)}%` : 'N/A'} ({item.value ?? 0} people)</span>
                    </div>
                    <span className="text-[14px] leading-[21px] text-[#2d3648] mt-2">{profileDescriptions[item.name]}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-6">
                {data.slice(4).map((item, index) => (
                  <div key={`right-${index}`} className="flex flex-col mt-6 first:mt-0">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full" style={{ backgroundColor: item.color, width: 20, height: 20 }} />
                      <span className="text-[20px] font-bold text-[#323232]">The {item.name}</span>
                      <span className="text-[17px] text-black">{item.percentage != null ? `${item.percentage.toFixed(0)}%` : 'N/A'} ({item.value ?? 0} people)</span>
                    </div>
                    <span className="text-[14px] leading-[21px] text-[#2d3648] mt-2">{profileDescriptions[item.name]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right side - Donut Chart */}
          <div className="w-full md:w-1/2 mt-10">
            <div className="relative h-full flex items-center justify-center">
              <div className="w-full h-[100px] flex items-center justify-center text-center rounded-lg">
                <span className="text-lg text-gray-500">No data for the selected time period</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const largestSlice = formattedData.reduce((max, item) =>
    item.percentage > max.percentage ? item : max,
    formattedData[0]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-8">
        {/* Left side - Profile List */}
        <div className="w-full md:w-1/2 pl-9 pb-4">
          <div className="pl-9 text-lg font-bold">Decision Profiles of your People (by percentage of total count)</div>
          <div className="flex flex-row pt-6 pl-9 mt-10 gap-4">
            <div className="flex-1 flex flex-col gap-6">
              {data.slice(0, 4).map((item, index) => (
                <div key={`left-${index}`} className="flex flex-col mt-6 first:mt-0">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full" style={{ backgroundColor: item.color, width: 20, height: 20 }} />
                    <span className="text-[20px] font-bold text-[#323232]">The {item.name}</span>
                    <span className="text-[17px] text-black">{item.percentage.toFixed(0)}% ({item.value} people)</span>
                  </div>
                  <span className="text-[14px] leading-[21px] text-[#2d3648] mt-2">{profileDescriptions[item.name]}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-6">
              {data.slice(4).map((item, index) => (
                <div key={`right-${index}`} className="flex flex-col mt-6 first:mt-0">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full" style={{ backgroundColor: item.color, width: 20, height: 20 }} />
                    <span className="text-[20px] font-bold text-[#323232]">The {item.name}</span>
                    <span className="text-[17px] text-black">{item.percentage.toFixed(0)}% ({item.value} people)</span>
                  </div>
                  <span className="text-[14px] leading-[21px] text-[#2d3648] mt-2">{profileDescriptions[item.name]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right side - Donut Chart */}
        <div className="w-full md:w-1/2 mt-10">
          <div className="relative h-full flex items-center justify-center">
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="dshadow" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="3" />
                      <feOffset dx="3" dy="3" result="shadow" />
                      <feFlood floodColor="black" floodOpacity="0.75" />
                      <feComposite operator="in" in2="shadow" />
                      <feComposite operator="over" in="SourceGraphic" />
                    </filter>
                  </defs>
                  <Pie
                    data={formattedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={120}
                    outerRadius={200}
                    fill="#8884d8"
                    dataKey="percentage"
                    startAngle={-90}
                    endAngle={270}
                    label={renderLargestSliceLabel}
                    labelLine={renderCustomLabelLine}
                  >
                    {data.map((entry, index) => {
                      const largestSlice = data.reduce((max, item) => 
                        (item.percentage > max.percentage) ? item : max
                      , data[0]);
                      const isLargestSlice = entry.name === largestSlice.name;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          filter={isLargestSlice ? 'url(#dshadow)' : 'none'}
                        />
                      );
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionProfilesDashboard;
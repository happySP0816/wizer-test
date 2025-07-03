import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { profileDescriptions } from './profileDescriptions';
import { Typography } from '@/components/components/ui/typography';
import React from 'react';

interface DecisionProfileData {
  name: string;
  color: string;
  percentage: number;
  value: number;
}

interface DecisionProfilesDashboardProps {
  data: DecisionProfileData[];
  insights: any;
}

const DecisionProfilesDashboard: React.FC<DecisionProfilesDashboardProps> = ({ data, insights }) => {
  const RADIAN = Math.PI / 180;

  const formattedData = data.map((item) => ({
    ...item,
    percentage: parseFloat(String(item.percentage)) || 0,
  }));
  const hasData = formattedData.some((item) => item.percentage > 0);
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  const renderCustomLabelLine = (props: any) => {
    const { payload } = props;
    const largestSlice = formattedData.reduce((max, item) =>
      item.percentage > max.percentage ? item : max,
      formattedData[0]
    );
    if (payload.name !== largestSlice.name) {
      return <></>;
    }
    return <line {...props} stroke="none" />;
  };

  const renderLargestSliceLabel = (props: any) => {
    const { cx, cy, outerRadius, startAngle, endAngle, payload } = props;
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

  return (
    <div className="flex flex-col xl:flex-row gap-8 pt-10 pb-2.5">
      <div className="w-full xl:w-2/3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
          {sortedData.map((item, index) => (
            <div key={`profile-${index}`} className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="rounded-full" style={{ backgroundColor: item.color, width: 20, height: 20 }} />
                <Typography variant="h5" className="font-bold text-gray-800">The {item.name}</Typography>
                <Typography variant="body2" className="text-black">{item.percentage.toFixed(0)}% ({item.value} people)</Typography>
              </div>
              <Typography variant="caption" className="mt-2 text-gray-700">{profileDescriptions[item.name]}</Typography>
            </div>
          ))}
        </div>
        <div className="bg-[#d7d2e7] flex items-center px-4 py-6 mt-10 rounded-md">
          <Typography variant="body1" className="text-black">
            <strong>INSIGHTS:</strong> {insights?.decisions ?? 'Unable to generate insights'}
          </Typography>
        </div>
      </div>
      {/* Right side - Donut Chart */}
      <div className="w-full xl:w-1/3 flex items-start justify-center mt-10">
        {hasData ?
          <div className='flex flex-col'>
            <Typography className='text-start px-10 text-black font-semibold mb-2'>
              Makeup of all  the Stakeholders Decision Profiles at an Organizational level
            </Typography>
            <div className="w-full h-[400px] relative flex items-center justify-center">
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
                    {sortedData.map((entry, index) => {
                      const largestSlice = sortedData.reduce((max, item) =>
                        item.percentage > max.percentage ? item : max,
                        sortedData[0]
                      );
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
              {/* Center label overlay */}
              {(() => {
                const largest = sortedData[0];
                if (!largest) return null;
                // Get abbreviation (first 3 uppercase letters of name, e.g. GUARDIAN -> GUA)
                const abbr = largest.name.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase();
                return (
                  <div
                    className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center"
                    style={{
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                      width: 260,
                      height: 260,
                      background: 'white',
                      borderRadius: '50%',
                      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)',
                      border: '8px solid white',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: 2, color: '#222', marginBottom: 4, textAlign: 'center' }}>
                      THE {largest.name.toUpperCase()}
                    </span>
                    <span style={{ fontWeight: 900, fontSize: 56, color: '#ffb32c', letterSpacing: 2, lineHeight: 1, marginBottom: 4 }}>
                      {abbr}
                    </span>
                    <span style={{ fontWeight: 500, fontSize: 14, color: '#222', letterSpacing: 2, marginBottom: 8, textAlign: 'center' }}>
                      DECISION PROFILE
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 20, color: '#222', marginTop: 8, textAlign: 'center' }}>
                      {largest.percentage.toFixed(0)}% Guardians<br />
                      <span style={{ fontWeight: 400, fontSize: 16, color: '#222' }}>{largest.value} people</span>
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
          :
          <Typography variant="body1" className="text-gray-500">No data for the selected time period</Typography>
        }
      </div>
    </div>
  );
};

export default DecisionProfilesDashboard;
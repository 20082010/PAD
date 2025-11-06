// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

// @ts-ignore;
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
export function PADVisualization({
  currentPAD,
  matchedEmotion
}) {
  // 准备雷达图数据
  const radarData = [{
    dimension: '愉悦度(P)',
    您的得分: currentPAD.P,
    匹配情感: matchedEmotion.P,
    fullMark: 3
  }, {
    dimension: '激活度(A)',
    您的得分: currentPAD.A,
    匹配情感: matchedEmotion.A,
    fullMark: 3
  }, {
    dimension: '支配度(D)',
    您的得分: currentPAD.D,
    匹配情感: matchedEmotion.D,
    fullMark: 3
  }];
  const CustomTooltip = ({
    active,
    payload,
    label
  }) => {
    if (active && payload && payload.length) {
      return <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => <p key={index} style={{
          color: entry.color
        }} className="text-sm">
              {entry.name}: {entry.value}
            </p>)}
        </div>;
    }
    return null;
  };
  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">PAD三维度可视化结果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}>
              <PolarGrid gridType="polygon" className="stroke-gray-200" />
              <PolarAngleAxis dataKey="dimension" tick={{
              fontSize: 12,
              fill: '#6b7280'
            }} />
              <PolarRadiusAxis angle={90} domain={[-3, 3]} tick={{
              fontSize: 10,
              fill: '#9ca3af'
            }} />
              <Radar name="您的得分" dataKey="您的得分" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} strokeWidth={2} />
              <Radar name="匹配情感" dataKey="匹配情感" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
              <Legend wrapperStyle={{
              paddingTop: '20px'
            }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>;
}
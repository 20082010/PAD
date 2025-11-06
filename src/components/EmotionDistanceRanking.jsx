// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { ChevronDown, ChevronUp } from 'lucide-react';

export function EmotionDistanceRanking({
  currentPAD,
  emotions = []
}) {
  const [isOpen, setIsOpen] = useState(false);
  // 计算所有情感的距离并排序
  const calculateDistance = (pad, emotion) => {
    return Math.sqrt(Math.pow(pad.P - emotion.P, 2) + Math.pow(pad.A - emotion.A, 2) + Math.pow(pad.D - emotion.D, 2));
  };
  const rankedEmotions = emotions.map(emotion => ({
    ...emotion,
    distance: calculateDistance(currentPAD, emotion)
  })).sort((a, b) => a.distance - b.distance);
  return <Card className="w-full">
      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">情感距离排名</CardTitle>
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </div>
      </CardHeader>
      {isOpen && <CardContent>
          <div className="space-y-2">
            {rankedEmotions.map((emotion, index) => <div key={emotion.name} className={`flex justify-between items-center p-3 rounded-lg ${index === 0 ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{emotion.name}</div>
                    <div className="text-xs text-gray-500">
                      P: {emotion.P} A: {emotion.A} D: {emotion.D}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {emotion.distance.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    匹配度: {(100 - emotion.distance * 10).toFixed(1)}%
                  </div>
                </div>
              </div>)}
          </div>
        </CardContent>}
    </Card>;
}
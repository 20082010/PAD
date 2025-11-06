// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Badge } from '@/components/ui';

export function QuestionHistory({
  answers,
  questions = []
}) {
  // 确保questions和answers都有值
  if (!questions.length || !answers || Object.keys(answers).length === 0) {
    return null;
  }
  return <div className="space-y-3">
      {questions.map((q, index) => {
      const value = answers[q.key];
      const absValue = Math.abs(value || 0);
      const isLeft = value < 0;
      const isRight = value > 0;
      const isNeutral = value === 0;
      return <div key={q.key} className="border rounded-lg p-3">
            <div className="text-sm font-medium text-gray-700 mb-2">
              问题 {index + 1}: {q.left} ↔ {q.right}
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded ${isLeft ? 'bg-red-100 text-red-700' : isRight ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {isLeft ? q.left : isRight ? q.right : '中立'}
              </span>
              <Badge variant={isNeutral ? "secondary" : isRight ? "default" : "destructive"} className="text-sm">
                评分: {value || 0}
              </Badge>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${isLeft ? 'bg-red-500' : isRight ? 'bg-green-500' : 'bg-gray-500'}`} style={{
              width: `${absValue / 4 * 100}%`,
              marginLeft: isLeft ? 'auto' : '0',
              marginRight: isRight ? 'auto' : '0'
            }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>-4 ({q.left})</span>
                <span>0</span>
                <span>4 ({q.right})</span>
              </div>
            </div>
          </div>;
    })}
    </div>;
}
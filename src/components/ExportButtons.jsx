// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Download } from 'lucide-react';

export function ExportButtons({
  data,
  type = 'single',
  showCSV = true
}) {
  const exportJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {
      type: 'application/json;charset=utf-8;'
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pad-emotion-${type}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const exportCSV = () => {
    let csvContent = '\ufeff'; // UTF-8 BOM 解决中文乱码
    if (type === 'single') {
      // 单条记录CSV
      csvContent += '姓名,手机号,年龄,性别,愉悦度(P),激活度(A),支配度(D),匹配情感,匹配距离,测试时间\n';
      csvContent += `${data.name},${data.phone},${data.age},${data.gender},${data.pad.P},${data.pad.A},${data.pad.D},${data.match.emotion.name},${data.match.distance},${data.timestamp}`;
    } else {
      // 多条记录CSV
      csvContent += '姓名,手机号,年龄,性别,愉悦度(P),激活度(A),支配度(D),匹配情感,匹配距离,测试时间\n';
      data.forEach(item => {
        csvContent += `${item.name},${item.phone},${item.age},${item.gender},${item.pad.P},${item.pad.A},${item.pad.D},${item.match.emotion.name},${item.match.distance},${item.timestamp}\n`;
      });
    }
    const dataBlob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pad-emotion-${type}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return <div className="flex gap-2 justify-center">
      <Button onClick={exportJSON} variant="outline" size="sm" className="flex items-center">
        <Download className="w-4 h-4 mr-1" />
        JSON
      </Button>
      {showCSV && <Button onClick={exportCSV} variant="outline" size="sm" className="flex items-center">
          <Download className="w-4 h-4 mr-1" />
          CSV
        </Button>}
    </div>;
}
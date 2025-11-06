// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { ChevronDown, ChevronUp } from 'lucide-react';

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return <Card className="w-full">
      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </div>
      </CardHeader>
      {isOpen && <CardContent>{children}</CardContent>}
    </Card>;
}
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../../lib/utils';

interface ScrollTableProps {
  columns: { title: string; key: string; width?: string; render?: (val: any, record: any) => React.ReactNode }[];
  data: any[];
  height?: string;
  scrollInterval?: number;
}

export const ScrollTable: React.FC<ScrollTableProps> = ({ 
  columns, 
  data, 
  height = '200px',
  scrollInterval = 3000
}) => {
  const [list, setList] = useState(data);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.length <= 5) return;
    
    const timer = setInterval(() => {
      setList(prev => {
        const first = prev[0];
        return [...prev.slice(1), first];
      });
    }, scrollInterval);

    return () => clearInterval(timer);
  }, [data, scrollInterval]);

  return (
    <div className="w-full flex flex-col overflow-hidden" style={{ height }}>
      {/* Header */}
      <div className="flex bg-[#0d3a6e]/40 py-2 border-b border-[#0d3a6e]/50">
        {columns.map((col, idx) => (
          <div 
            key={idx} 
            className="text-[10px] font-bold text-[#00c8ff] uppercase tracking-widest px-2 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
          >
            {col.title}
          </div>
        ))}
      </div>
      
      {/* Body */}
      <div className="flex-1 overflow-hidden relative">
        <div className="flex flex-col">
          {list.map((row, rowIdx) => (
            <div 
              key={`${rowIdx}-${row.id || rowIdx}`}
              className={cn(
                "flex items-center py-2 border-b border-[#0d3a6e]/20 transition-colors hover:bg-white/5",
                rowIdx % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
              )}
            >
              {columns.map((col, colIdx) => (
                <div 
                  key={colIdx} 
                  className="text-[11px] text-[#c8e6ff] px-2 overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

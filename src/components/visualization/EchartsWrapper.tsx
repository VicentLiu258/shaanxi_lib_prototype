import React, { useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface EchartsWrapperProps {
  option: any;
  height?: string;
  className?: string;
  onEvents?: Record<string, Function>;
}

export const EchartsWrapper: React.FC<EchartsWrapperProps> = ({ 
  option, 
  height = '240px', 
  className,
  onEvents 
}) => {
  const chartRef = useRef<any>(null);

  return (
    <div className={className} style={{ height }}>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '100%', width: '100%' }}
        theme="dark"
        notMerge={true}
        lazyUpdate={true}
        onEvents={onEvents}
      />
    </div>
  );
};

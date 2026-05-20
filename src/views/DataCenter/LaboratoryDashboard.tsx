import React from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowRight,
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { ChartCard } from '../../components/visualization/ChartCard';
import { EchartsWrapper } from '../../components/visualization/EchartsWrapper';
import { ScrollTable } from '../../components/visualization/ScrollTable';
import { DigitalBackground } from '../../components/visualization/DigitalBackground';
import { cn } from '../../lib/utils';

export const LaboratoryDashboard: React.FC = () => {
  // Chart options
  const teacherCoursesOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: '30px', left: '60px', right: '40px', bottom: '30px' },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#c8e6ff', fontSize: 10 },
      splitLine: { lineStyle: { color: '#0d3a6e', type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: ['李明', '张华', '王利', '陈刚', '赵强', '孙悦', '周杰'],
      axisLine: { lineStyle: { color: '#0d3a6e' } },
      axisLabel: { color: '#c8e6ff', fontSize: 10 }
    },
    series: [{
      name: '数量',
      data: [45, 52, 38, 41, 33, 48, 29],
      type: 'bar',
      barWidth: 12,
      itemStyle: {
        borderRadius: [0, 6, 6, 0],
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: 'rgba(0, 200, 255, 0.1)' },
            { offset: 1, color: '#00c8ff' }
          ]
        }
      }
    }]
  };

  const labStatsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: { color: '#c8e6ff', fontSize: 12 },
      icon: 'circle'
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: '{d}%',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
      },
      emphasis: {
        label: { show: true, fontSize: 24 }
      },
      data: [
        { value: 456, name: '已开课题', itemStyle: { color: '#e84c4c' } },
        { value: 124, name: '未开课题', itemStyle: { color: '#f5a623' } }
      ]
    }]
  };

  const teacherTrendOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { 
      top: '0', 
      textStyle: { color: '#c8e6ff', fontSize: 10 },
      icon: 'rect'
    },
    grid: { top: '40px', left: '40px', right: '40px', bottom: '40px' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLine: { lineStyle: { color: '#0d3a6e' } },
      axisLabel: { color: '#c8e6ff', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#0d3a6e' } },
      splitLine: { lineStyle: { color: '#0d3a6e', type: 'dashed' } },
      axisLabel: { color: '#c8e6ff', fontSize: 10 }
    },
    series: [
      {
        name: '张华',
        type: 'line',
        smooth: true,
        data: [12, 15, 8, 20, 25, 18],
        itemStyle: { color: '#00c8ff' }
      },
      {
        name: '王利',
        type: 'line',
        smooth: true,
        data: [10, 8, 15, 12, 18, 22],
        itemStyle: { color: '#f5a623' }
      },
      {
        name: '李明',
        type: 'line',
        smooth: true,
        data: [15, 20, 12, 18, 14, 16],
        itemStyle: { color: '#7ed321' }
      }
    ]
  };

  const rankingData = [
    { rank: 1, class: '高三(1)班', total: 48, actual: 47, rate: 97.9 },
    { rank: 2, class: '高二(3)班', total: 42, actual: 40, rate: 95.2 },
    { rank: 3, class: '高一(5)班', total: 50, actual: 46, rate: 92.0 },
    { rank: 4, class: '初三(2)班', total: 36, actual: 33, rate: 91.7 },
    { rank: 5, class: '高二(8)班', total: 44, actual: 40, rate: 90.9 },
    { rank: 6, class: '初二(1)班', total: 40, actual: 36, rate: 90.0 },
  ];

  return (
    <div className="min-h-full p-6 relative overflow-hidden flex flex-col gap-6">
      <DigitalBackground />
      
      {/* Top Filter Area */}
      <div className="relative z-10 flex items-center justify-between bg-[#0a1a3c]/60 backdrop-blur-md px-6 py-4 rounded-xl border border-[#0d3a6e]/50">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">学年:</span>
             <select className="bg-[#050e24] border border-[#0d3a6e] rounded px-3 py-1 text-xs text-[#00c8ff] focus:outline-none focus:border-[#00c8ff]">
               <option>2025-2026</option>
               <option>2024-2025</option>
             </select>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">学期:</span>
             <select className="bg-[#050e24] border border-[#0d3a6e] rounded px-3 py-1 text-xs text-[#00c8ff] focus:outline-none focus:border-[#00c8ff]">
               <option>第一学期</option>
               <option>第二学期</option>
             </select>
           </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="快速搜索实验室..." 
              className="bg-[#050e24]/50 border border-[#0d3a6e]/50 rounded-full pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#00c8ff] w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#00c8ff]/10 border border-[#00c8ff]/30 text-[#00c8ff] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#00c8ff]/20 transition-all">
            <Filter size={14} /> 更多筛选
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-6 flex-1 relative z-10">
        <ChartCard title="全年实验开出率排行" className="h-full">
          <ScrollTable 
            height="100%"
            columns={[
              { title: '序号', key: 'rank', width: '10%' },
              { title: '班级', key: 'class', width: '25%' },
              { title: '应开课程数', key: 'total', width: '20%' },
              { title: '实开课程数', key: 'actual', width: '20%' },
              { 
                title: '开出率', 
                key: 'rate', 
                width: '25%',
                render: (val) => (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 h-1.5 bg-[#0d3a6e] rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all", val > 95 ? "bg-emerald-500" : "bg-[#00c8ff]")} 
                        style={{ width: `${val}%` }} 
                      />
                    </div>
                    <span className="font-bold font-mono">{val}%</span>
                  </div>
                )
              }
            ]}
            data={rankingData}
          />
        </ChartCard>

        <ChartCard title="教师已开课次数" className="h-full">
          <EchartsWrapper option={teacherCoursesOption} height="100%" />
        </ChartCard>

        <ChartCard title="实验室开课数统计图" className="h-full">
          <EchartsWrapper option={labStatsOption} height="100%" />
        </ChartCard>

        <ChartCard title="教师开课走势图" className="h-full">
          <EchartsWrapper option={teacherTrendOption} height="100%" />
        </ChartCard>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 italic uppercase tracking-[0.4em] pointer-events-none">
        Laboratory Service Management Platform . Visualization Engine 5.0
      </div>
    </div>
  );
};

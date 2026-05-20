import React from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  FlaskConical, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen,
  ChevronUp,
  ChevronDown,
  Activity,
  Box,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from 'lucide-react';
import { ChartCard } from '../../components/visualization/ChartCard';
import { MetricItem } from '../../components/visualization/MetricItem';
import { EchartsWrapper } from '../../components/visualization/EchartsWrapper';
import { ScrollTable } from '../../components/visualization/ScrollTable';
import { DigitalBackground } from '../../components/visualization/DigitalBackground';
import { cn } from '../../lib/utils';
import * as echarts from 'echarts';

export const SchoolDashboard: React.FC = () => {
  // Chart options
  const courseTrendOption = {
    backgroundColor: 'transparent',
    grid: { top: '30px', left: '40px', right: '20px', bottom: '30px' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月'],
      axisLine: { lineStyle: { color: '#0d3a6e' } },
      axisLabel: { color: '#c8e6ff', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#0d3a6e' } },
      splitLine: { lineStyle: { color: '#0d3a6e', type: 'dashed' } },
      axisLabel: { color: '#c8e6ff', fontSize: 10 }
    },
    series: [{
      name: '总量',
      data: [120, 150, 80, 260, 320, 290, 310, 140, 200, 350, 420, 480],
      type: 'line',
      smooth: true,
      showSymbol: false,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 200, 255, 0.5)' },
            { offset: 1, color: 'rgba(0, 200, 255, 0)' }
          ]
        }
      },
      lineStyle: { width: 3, color: '#00c8ff' }
    }]
  };

  const statusDonutOption = (data: any[], title: string, subTitle: string) => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: false } },
        itemStyle: {
          borderRadius: 4,
          borderColor: '#0a1a3c',
          borderWidth: 2
        },
        data
      }
    ],
    legend: {
      orient: 'vertical',
      right: '0%',
      top: 'center',
      textStyle: { color: '#c8e6ff', fontSize: 10 },
      icon: 'circle'
    },
    graphic: {
      elements: [
        {
          type: 'text',
          left: '30%',
          top: '42%',
          style: { text: title, fill: '#fff', fontSize: 14, fontWeight: 'bold' }
        },
        {
          type: 'text',
          left: '25%',
          top: '55%',
          style: { text: subTitle, fill: '#00c8ff', fontSize: 10 }
        }
      ]
    }
  });

  const categoryBarOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { top: '20px', left: '100px', right: '40px', bottom: '20px' },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: ['数学器具', '物理器具', '教学设备', '橱柜', '玻璃仪器', '试剂'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#c8e6ff', fontSize: 10 }
    },
    series: [{
      data: [420, 580, 490, 320, 650, 410],
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        borderRadius: 5,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: 'rgba(0, 200, 255, 0.2)' },
          { offset: 1, color: '#00c8ff' }
        ])
      }
    }]
  };

  const realTimeCourses = [
    { name: '电学基础入门', class: '高一(3)班', teacher: '张华', location: '物理实验室 302' },
    { name: '酸碱中和反应', class: '高二(1)班', teacher: '王利', location: '化学实验室 105' },
    { name: '细胞有丝分裂观察', class: '初三(4)班', teacher: '李明', location: '生物实验室 201' },
    { name: '牛顿运动定律验证', class: '高一(8)班', teacher: '陈刚', location: '物理实验室 304' },
    { name: '有机化合物合成', class: '高三(2)班', teacher: '赵强', location: '化学实验室 108' },
    { name: '光学干涉实验', class: '高二(5)班', teacher: '孙悦', location: '物理实验室 301' },
  ];

  const rateRanking = [
    { rank: 1, class: '高二(1)班', rate: 98 },
    { rank: 2, class: '高一(3)班', rate: 95 },
    { rank: 3, class: '初三(4)班', rate: 92 },
    { rank: 4, class: '高三(2)班', rate: 89 },
    { rank: 5, class: '高二(5)班', rate: 88 },
  ];

  return (
    <div className="min-h-full p-6 relative overflow-hidden flex flex-col gap-6">
      <DigitalBackground />
      
      {/* Page Title Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-20 bg-gradient-to-b from-[#00c8ff]/10 to-transparent flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] absolute top-0 bg-gradient-to-r from-transparent via-[#00c8ff] to-transparent animate-pulse" />
        <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase italic drop-shadow-[0_0_15px_rgba(0,200,255,0.5)]">
          咸阳实验中学数字化实验室教学服务管理平台
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-16 flex-1">
        
        {/* Left Column */}
        <div className="col-span-3 flex flex-col gap-6">
          <ChartCard title="实验室实时状态">
            <div className="grid grid-cols-3 gap-3">
              <MetricItem 
                label="总量" 
                value={12} 
                icon={<FlaskConical size={16} />} 
                className="col-span-1"
              />
              <MetricItem 
                label="空闲中" 
                value={4} 
                color="text-emerald-400" 
                icon={<Clock size={16} />}
              />
              <MetricItem 
                label="使用中" 
                value={8} 
                color="text-orange-400" 
                icon={<Activity size={16} />}
              />
            </div>
          </ChartCard>

          <ChartCard title="实验开课实时状态" className="flex-1">
            <ScrollTable 
              height="280px"
              columns={[
                { title: '实验名', key: 'name', width: '35%' },
                { title: '班级', key: 'class', width: '25%' },
                { title: '教师', key: 'teacher', width: '15%' },
                { title: '地点', key: 'location', width: '25%' },
              ]}
              data={realTimeCourses}
            />
          </ChartCard>

          <ChartCard 
            title="实验开出率排行" 
            extra={
              <div className="flex gap-2">
                <button className="p-1 rounded bg-[#0d3a6e]/50 text-slate-400 hover:text-white"><ChevronUp size={14}/></button>
                <button className="p-1 rounded bg-[#0d3a6e]/50 text-slate-400 hover:text-white"><ChevronDown size={14}/></button>
              </div>
            }
          >
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 shrink-0">
                {['汇总', '物理', '化学', '生物'].map(tab => (
                  <button key={tab} className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded transition-all",
                    tab === '汇总' ? "bg-[#00c8ff] text-[#0a1a3c]" : "bg-[#0d3a6e]/50 text-slate-400"
                  )}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex-1">
                <ScrollTable 
                  height="180px"
                  columns={[
                    { title: '序号', key: 'rank', width: '20%' },
                    { title: '班级', key: 'class', width: '40%' },
                    { 
                      title: '开出率', 
                      key: 'rate', 
                      width: '40%',
                      render: (val) => (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-[#0d3a6e] rounded-full overflow-hidden">
                            <div className="h-full bg-[#00c8ff]" style={{ width: `${val}%` }} />
                          </div>
                          <span>{val}%</span>
                        </div>
                      )
                    }
                  ]}
                  data={rateRanking}
                />
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Center Column */}
        <div className="col-span-6 flex flex-col gap-6">
          <div className="flex-1 relative flex flex-col items-center justify-center">
            {/* 3D Decorating Area */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#00c8ff]/10 rounded-full animate-[spin_30s_linear_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-[#00c8ff]/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-transparent via-[#00c8ff]/5 to-transparent blur-3xl animate-pulse" />
              
              {/* Hexagon Pattern */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg width="400" height="400" viewBox="0 0 400 400" className="opacity-20 animate-pulse">
                  <path d="M200,50 L330,125 L330,275 L200,350 L70,275 L70,125 Z" fill="none" stroke="#00c8ff" strokeWidth="2" />
                  <path d="M200,80 L300,140 L300,260 L200,320 L100,260 L100,140 Z" fill="none" stroke="#00c8ff" strokeWidth="1" strokeDasharray="5,5" />
                </svg>
              </div>
            </div>

            <div className="relative z-10 text-center">
               <motion.div
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="mb-8"
               >
                 <div className="text-[10px] font-bold text-[#00c8ff] uppercase tracking-[0.5em] mb-2 opacity-70">
                   Instrument Total Count
                 </div>
                 <h3 className="text-7xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(0,200,255,0.8)]">
                    12,548
                 </h3>
               </motion.div>

               <div className="bg-[#0d3a6e]/20 backdrop-blur-md px-12 py-6 rounded-2xl border border-[#00c8ff]/20 shadow-[0_0_30px_rgba(0,180,255,0.1)]">
                 <h2 className="text-2xl font-black text-[#00c8ff] italic tracking-widest">咸阳市实验中学</h2>
                 <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-[0.3em]">Excellence Through Innovation</p>
               </div>
            </div>
          </div>

          <ChartCard title="实验开课数走势图" className="h-[320px]">
            <EchartsWrapper option={courseTrendOption} height="280px" />
          </ChartCard>
        </div>

        {/* Right Column */}
        <div className="col-span-3 flex flex-col gap-6">
          <ChartCard title="仪器概况-数量">
            <EchartsWrapper 
              option={statusDonutOption(
                [
                  { value: 8540, name: '闲置', itemStyle: { color: '#7ed321' } },
                  { value: 3120, name: '已借用', itemStyle: { color: '#3b82f6' } },
                  { value: 450, name: '待处置', itemStyle: { color: '#f5a623' } },
                  { value: 438, name: '已报废', itemStyle: { color: '#e84c4c' } }
                ],
                '12548',
                '仪器总数'
              )} 
              height="200px" 
            />
          </ChartCard>

          <ChartCard title="仪器概况-金额">
            <EchartsWrapper 
              option={statusDonutOption(
                [
                  { value: 850, name: '闲置', itemStyle: { color: '#7ed321' } },
                  { value: 420, name: '已借用', itemStyle: { color: '#e84c4c' } }, // Note: user spec said specific colors for labels
                  { value: 120, name: '待处置', itemStyle: { color: '#f5a623' } },
                  { value: 156, name: '已报废', itemStyle: { color: '#3b82f6' } }
                ],
                '1546',
                '总金额(万元)'
              )} 
              height="200px" 
            />
          </ChartCard>

          <ChartCard 
            title="仪器分类统计" 
            className="flex-1"
            extra={
              <div className="flex bg-[#0d3a6e]/50 p-1 rounded">
                <button className="px-2 py-0.5 text-[9px] bg-[#00c8ff] text-[#0a1a3c] rounded-sm font-bold">数量</button>
                <button className="px-2 py-0.5 text-[9px] text-slate-400 rounded-sm font-bold">金额</button>
              </div>
            }
          >
            <EchartsWrapper option={categoryBarOption} height="300px" />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

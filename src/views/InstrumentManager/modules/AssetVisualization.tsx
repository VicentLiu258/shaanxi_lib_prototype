import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Box, 
  Users, 
  Activity,
  ArrowUpRight,
  Monitor
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const COLORS = ['#1B6BE5', '#52C41A', '#FAAD14', '#FF4D4F', '#722ED1', '#13C2C2'];

const categoryData = [
  { name: '通用仪器', value: 450 },
  { name: '测量分析', value: 300 },
  { name: '教学模型', value: 200 },
  { name: '生物耗材', value: 600 },
  { name: '物理元件', value: 500 },
];

const trendData = [
  { name: '1月', val: 400 },
  { name: '2月', val: 300 },
  { name: '3月', val: 600 },
  { name: '4月', val: 800 },
  { name: '5月', val: 500 },
  { name: '6月', val: 900 },
];

export const AssetVisualization: React.FC = () => {
  return (
    <div className="min-h-full bg-slate-950 p-8 text-white space-y-8 overflow-y-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Monitor size={24} />
           </div>
           <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">全局仪器数据可视化中心</h2>
              <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase">Global Instrumentation Real-time Analysis Dashboard</p>
           </div>
        </div>
        <div className="flex items-center gap-8">
           <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">系统更新时间</p>
              <p className="text-sm font-mono font-bold text-blue-400">2026-05-19 14:32:00</p>
           </div>
           <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">在线同步中</span>
           </div>
        </div>
      </div>

      {/* Top 4 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: '资产总估值', val: '¥ 12,485,000', change: '+2.4%', icon: TrendingUp },
           { label: '在库仪器总量', val: '4,285', sub: '台/套', icon: Box },
           { label: '活跃借用频率', val: '86', sub: '次/日', icon: Activity },
           { label: '累计服务人次', val: '124,500', sub: '人次', icon: Users },
         ].map((stat, i) => (
           <div key={i} className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                 <stat.icon size={80} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                 <h3 className="text-2xl font-black font-mono">{stat.val}</h3>
                 {stat.change && <span className="text-xs font-bold text-emerald-500 flex items-center"><ArrowUpRight size={12} /> {stat.change}</span>}
                 {stat.sub && <span className="text-[10px] font-bold text-slate-500">{stat.sub}</span>}
              </div>
           </div>
         ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
         {/* 仪器分类统计 (条形图) */}
         <div className="col-span-12 lg:col-span-4 bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> 仪器分类分布统计
            </h4>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" stroke="none" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} width={80} />
                     <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                     <Bar dataKey="value" fill="#1B6BE5" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* 仪器状态分布 (环形图) */}
         <div className="col-span-12 lg:col-span-4 bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> 资产状态即时概览
            </h4>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={[{ name: '闲置', value: 40 }, { name: '借出', value: 30 }, { name: '维修', value: 15 }, { name: '处置', value: 15 }]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {categoryData.map((_, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                     <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* 使用趋势图 (折线图) */}
         <div className="col-span-12 lg:col-span-4 bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 资产运营活跃趋势
            </h4>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                     <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#1B6BE5" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#1B6BE5" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="name" stroke="#334155" tick={{ fontSize: 10, fill: '#64748b' }} />
                     <YAxis stroke="#334155" tick={{ fontSize: 10, fill: '#64748b' }} />
                     <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                     <Area type="monotone" dataKey="val" stroke="#1B6BE5" fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Row 3 - Additional info */}
      <div className="grid grid-cols-12 gap-6 pb-8">
         <div className="col-span-12 lg:col-span-6 bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-[300px]">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">重点科室仪器持有排名</h4>
            <div className="space-y-4">
               {[
                 { name: '高能物理实验室', count: 124, progress: 85 },
                 { name: '分子生物中心', count: 98, progress: 70 },
                 { name: '现代教育技术科', count: 76, progress: 60 },
                 { name: '化学分析一室', count: 54, progress: 45 },
               ].map((dept, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span>{dept.name}</span>
                       <span className="text-blue-400">{dept.count} 台</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${dept.progress}%` }} className="h-full bg-blue-500 rounded-full" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="col-span-12 lg:col-span-6 bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-[300px] flex flex-col justify-center items-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
               <Activity size={32} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-2">系统运行状态良好</h3>
            <p className="text-slate-500 text-xs text-center max-w-sm italic">
               咸阳市实验中学 · 数字化实验室仪器与耗材管理平台<br/>
               当前已接入 12 个独立核算单位，3,285 台精密仪器，数据同步延迟 &lt; 50ms
            </p>
         </div>
      </div>
    </div>
  );
};

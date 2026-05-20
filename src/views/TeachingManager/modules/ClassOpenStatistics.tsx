import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Loader2, 
  GraduationCap, 
  TrendingUp, 
  Calendar,
  Layers
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const MOCK_CLASS_DATA = [
  { class: '高一(1)班', count: 18, target: 20 },
  { class: '高一(2)班', count: 15, target: 20 },
  { class: '高一(3)班', count: 20, target: 20 },
  { class: '高一(4)班', count: 12, target: 20 },
  { class: '高一(5)班', count: 22, target: 20 },
];

export const ClassOpenStatistics: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">正在加载班级实验汇算数据...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#f1f5f9] min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <GraduationCap size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">班级实验开出完成度</h2>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Classroom Activity Index</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-6 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">平均完成率</span>
                 <span className="text-xl font-black text-emerald-600">92.4%</span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">活跃度</span>
                 <span className="text-xl font-black text-blue-600">正常</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">各班级实验次数对比</h3>
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" /> <span>实际完成</span>
                  <div className="w-2 h-2 bg-slate-200 rounded-full ml-2" /> <span>教学目标</span>
               </div>
            </div>
            <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_CLASS_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#64748b'}} />
                    <YAxis dataKey="class" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#64748b'}} width={80} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="target" fill="#f1f5f9" radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">学期开课趋势</h3>
               <div className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500 uppercase tracking-widest">Weekly Report</div>
            </div>
            <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    {week: 'W1', val: 40}, {week: 'W2', val: 55}, {week: 'W3', val: 48}, {week: 'W4', val: 70}, {week: 'W5', val: 85}, {week: 'W6', val: 75}
                  ]}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600, fill: '#64748b'}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: '高一', value: '92%', sub: '完成度', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: '高二', value: '88%', sub: '完成度', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: '高三', value: '45%', sub: '复习阶段', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: '综合', value: 'A+', sub: '活跃等级', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:-translate-y-1 transition-all pointer-events-auto cursor-pointer">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", stat.bg, stat.color)}>
                 <stat.icon size={24} />
              </div>
              <div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                 <div className="flex items-baseline gap-2">
                    <span className={cn("text-2xl font-black font-mono", stat.color)}>{stat.value}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{stat.sub}</span>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

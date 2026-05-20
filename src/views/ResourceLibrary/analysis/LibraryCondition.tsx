import React from 'react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Users, 
  TrendingUp,
  LayoutGrid,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PIE_DATA = [
  { name: '教案', value: 400 },
  { name: '视频', value: 300 },
  { name: '课件', value: 300 },
  { name: '习题', value: 200 },
];

const COLORS = ['#2563eb', '#6366f1', '#a855f7', '#ec4899'];

const BAR_DATA = [
  { name: '物理', value: 2400 },
  { name: '化学', value: 1398 },
  { name: '生物', value: 9800 },
  { name: '科学', value: 3908 },
];

const LibraryCondition: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>资源分析</span>
        <span>&gt;</span>
        <span className="text-slate-800 dark:text-slate-300 font-medium">资源库情况</span>
      </div>

      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">学校资源库情况</h1>
         <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest">
            <TrendingUp size={16} /> Real-time Data
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Resource Type Distribution */}
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <PieChartIcon size={20} />
               </div>
               <div>
                  <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">资源类型分布</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource Type Distribution</p>
               </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
               {PIE_DATA.length > 0 ? (
                 <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                       <Pie
                        data={PIE_DATA}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                       >
                         {PIE_DATA.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip />
                       <Legend />
                    </PieChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="flex flex-col items-center justify-center text-slate-300 italic">
                    <LayoutGrid size={48} className="mb-4 opacity-10" />
                    <p className="text-sm font-bold">暂无数据分布分析</p>
                 </div>
               )}
            </div>
         </div>

         {/* Resource Library Distribution */}
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                  <BarChart3 size={20} />
               </div>
               <div>
                  <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">资源库分布</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Library Volume Distribution</p>
               </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
               {BAR_DATA.length > 0 ? (
                 <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={BAR_DATA}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                       <Tooltip cursor={{ fill: 'transparent' }} />
                       <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="flex flex-col items-center justify-center text-slate-300 italic">
                    <LayoutGrid size={48} className="mb-4 opacity-10" />
                    <p className="text-sm font-bold">暂无库容分布分析</p>
                 </div>
               )}
            </div>
         </div>

         {/* Teacher Resource Distribution */}
         <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm min-h-[300px]">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                   <Users size={20} />
                </div>
                <div>
                   <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">教师资源量分布</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teacher Contribution Distribution</p>
                </div>
             </div>
             
             <div className="flex flex-col items-center justify-center h-48 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-700">
                <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl mb-4 shadow-sm">
                   <Info size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">数据精细化处理中，暂无可显示图表</p>
             </div>
         </div>
      </div>
    </div>
  );
};

export default LibraryCondition;

import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { 
  Building2, 
  ChevronRight,
  TrendingDown,
  Activity,
  Layers,
  ArrowDownLeft,
  Search
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const COLORS = ['#1B6BE5', '#52C41A', '#FAAD14', '#FF4D4F', '#722ED1', '#13C2C2'];

const deptData = [
  { name: '物理科组', total: 450, used: 320, idle: 130 },
  { name: '化学科组', total: 380, used: 210, idle: 170 },
  { name: '生物科组', total: 520, used: 450, idle: 70 },
  { name: '电教中心', total: 240, used: 180, idle: 60 },
  { name: '艺体办公室', total: 120, used: 40, idle: 80 },
];

const radialData = [
  { name: '正常使用', uv: 85, fill: '#1B6BE5' },
  { name: '维修待命', uv: 10, fill: '#FAAD14' },
  { name: '损耗处置', uv: 5, fill: '#FF4D4F' },
];

export const SubjectAssetVisualization: React.FC = () => {
  return (
    <div className="min-h-full bg-slate-950 p-8 text-white space-y-8 overflow-y-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <Building2 size={24} className="text-blue-400" />
           </div>
           <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">部门仪器数据大屏</h2>
              <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase">Departmental Asset Distribution & Performance Dashboard</p>
           </div>
        </div>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-white/5 mx-auto">
           {['物理', '化学', '生物', '通用'].map((t, idx) => (
             <button key={idx} className={cn(
               "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
               idx === 0 ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"
             )}>{t}组</button>
           ))}
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
           <Search size={14} className="text-slate-500" />
           <input type="text" placeholder="定位科室资产..." className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-32 placeholder:text-slate-600" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Left Side: Distribution by Dept */}
         <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">科组资产持有量明细</h4>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">已用</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-700 rounded-full" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">闲置</span>
                     </div>
                  </div>
               </div>
               <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={deptData} barGap={12}>
                        <XAxis dataKey="name" stroke="none" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                        <YAxis stroke="none" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip 
                           cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                           contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                        />
                        <Bar dataKey="used" fill="#1B6BE5" radius={[4, 4, 0, 0]} barSize={40} />
                        <Bar dataKey="idle" fill="#334155" radius={[4, 4, 0, 0]} barSize={40} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-6">活跃资产性能占比</h4>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={15} data={radialData}>
                          <RadialBar background dataKey="uv" />
                          <Legend iconSize={10} verticalAlign="bottom" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                       </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                     <Activity size={160} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400 mb-6 font-sans">科室运营负荷指数</h4>
                  <div className="space-y-6">
                     {[
                       { label: '平均日负荷', val: '72%', status: 'Normal' },
                       { label: '借调周转率', val: '0.85', status: 'High' },
                       { label: '年均折旧率', val: '4.2%', status: 'Low' },
                     ].map((l, i) => (
                       <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                          <div>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{l.label}</p>
                             <h5 className="text-xl font-black font-mono">{l.val}</h5>
                          </div>
                          <span className={cn(
                            "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border",
                            l.status === 'High' ? "border-emerald-500 text-emerald-500 bg-emerald-500/10" :
                            l.status === 'Low' ? "border-blue-500 text-blue-500 bg-blue-500/10" : "border-slate-500 text-slate-500 bg-slate-500/10"
                          )}>{l.status}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Right Side: Key Indicators */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-[#1B6BE5] rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-blue-500/20">
               <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-3xl" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">Total Subject Value</p>
               <h2 className="text-4xl font-black font-mono tracking-tighter">¥ 8,452.2M</h2>
               <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <span className="text-[10px] font-black uppercase tracking-widest group-hover:mr-2 transition-all">查看估值明细</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                     <Layers size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">A-Block 数据库</span>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 space-y-6">
               <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-4">科室动态摘要</h4>
               {[
                 { title: '物理科组入库了 14 件新设备', time: '2h ago', icon: ArrowDownLeft, color: 'text-blue-400' },
                 { title: '化学试剂库存低于 20% 预警', time: '5h ago', icon: TrendingDown, color: 'text-amber-400' },
                 { title: '生物实验室年度盘点完成', time: '1d ago', icon: Activity, color: 'text-emerald-400' },
                 { title: '电教中心申请了处置报废', time: '2d ago', icon: Layers, color: 'text-red-400' },
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className={cn("w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5", item.color)}>
                       <item.icon size={18} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-300 leading-tight">{item.title}</p>
                       <p className="text-[10px] font-bold text-slate-600 uppercase mt-1 tracking-widest">{item.time}</p>
                    </div>
                 </div>
               ))}
               <button className="w-full py-4 mt-4 bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 rounded-2xl hover:bg-white/10 hover:text-slate-300 transition-all">More Subject Insights</button>
            </div>
         </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  Download,
  Search,
  RotateCcw,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '../../../../lib/utils';

export const DeptStatistics: React.FC = () => {
  const [metric, setMetric] = useState<'qty' | 'amount'>('qty');

  const data = [
    { name: '物理科组', qty: 156, amount: 45.2 },
    { name: '化学科组', qty: 245, amount: 82.5 },
    { name: '生物科组', qty: 189, amount: 65.4 },
    { name: '信息技术科', qty: 850, amount: 520.0 },
    { name: '校务部', qty: 45, amount: 12.0 },
    { name: '体育处', qty: 120, amount: 15.5 },
    { name: '图书馆', qty: 35, amount: 8.2 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
               <Building size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">科室/部门资产统计</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">departmental Asset Allocation & Valuation Overview</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
               <button 
                  onClick={() => setMetric('qty')}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    metric === 'qty' ? "bg-white text-blue-700 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
               >
                  按数量
               </button>
               <button 
                  onClick={() => setMetric('amount')}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    metric === 'amount' ? "bg-white text-blue-700 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
               >
                  按金额
               </button>
            </div>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
               <Download size={14} /> 导出报表
            </button>
         </div>
      </div>

      <section className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm">
         <div className="mb-10 flex items-center justify-between">
            <div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">业务组织分布图例</h3>
               <p className="text-[10px] font-bold text-slate-400 mt-1">Comparing asset values across different educational departments</p>
            </div>
            <BarChart2 className="text-slate-200" size={32} />
         </div>
         
         <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data} margin={{ top: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }} 
                     dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: '#94A3B8' }} />
                  <Tooltip 
                     cursor={{ fill: 'transparent' }}
                     content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                           return (
                              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 scale-110">
                                 <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">{payload[0].payload.name}</p>
                                 <p className="text-sm font-black tracking-tight">{payload[0].value.toLocaleString()} <span className="text-[10px] text-white/50">{metric === 'qty' ? 'Units' : 'W-RMB'}</span></p>
                              </div>
                           );
                        }
                        return null;
                     }}
                  />
                  <Bar dataKey={metric} radius={[12, 12, 0, 0]} barSize={48}>
                     {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1B6BE5' : '#475569'} />
                     ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>
      </section>

      <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse font-sans italic">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-100 not-italic">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">所属组织 (部门)</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">仪器数量</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">资产价值 (万元)</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">占比 (价值)</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 not-italic">
               {data.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-5">
                       <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{r.name}</span>
                    </td>
                    <td className="px-10 py-5 text-center">
                       <span className="text-xs font-mono font-black text-slate-500">{r.qty}</span>
                    </td>
                    <td className="px-10 py-5 text-right font-mono font-black text-blue-600">¥ {r.amount.toFixed(1)}</td>
                    <td className="px-10 py-5 text-right">
                       <div className="flex items-center justify-end gap-2 text-[10px] font-mono font-bold text-slate-400">
                          {((r.amount / data.reduce((a, b) => a + b.amount, 0)) * 100).toFixed(1)}%
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-600" style={{ width: `${(r.amount / data.reduce((a, b) => a + b.amount, 0)) * 100}%` }} />
                          </div>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart as LineChartIcon, 
  Download,
  Calendar,
  RotateCcw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '../../../../lib/utils';

export const AssetBorrowReport: React.FC = () => {
  const data = [
    { name: '一月', borrowQty: 45, returnQty: 38, borrowAmount: 12.5, returnAmount: 10.2 },
    { name: '二月', borrowQty: 52, returnQty: 48, borrowAmount: 15.0, returnAmount: 14.5 },
    { name: '三月', borrowQty: 85, returnQty: 72, borrowAmount: 25.5, returnAmount: 20.0 },
    { name: '四月', borrowQty: 65, returnQty: 68, borrowAmount: 18.2, returnAmount: 19.5 },
    { name: '五月', borrowQty: 95, returnQty: 85, borrowAmount: 32.0, returnAmount: 28.5 },
    { name: '六月', borrowQty: 78, returnQty: 70, borrowAmount: 22.4, returnAmount: 21.0 },
    { name: '七月', borrowQty: 25, returnQty: 45, borrowAmount: 5.0, returnAmount: 12.0 },
    { name: '八月', borrowQty: 30, returnQty: 35, borrowAmount: 8.5, returnAmount: 9.2 },
    { name: '九月', borrowQty: 110, returnQty: 95, borrowAmount: 45.0, returnAmount: 38.5 },
    { name: '十月', borrowQty: 92, returnQty: 88, borrowAmount: 28.5, returnAmount: 27.2 },
    { name: '十一月', borrowQty: 88, returnQty: 82, borrowAmount: 25.0, returnAmount: 24.5 },
    { name: '十二月', borrowQty: 75, returnQty: 80, borrowAmount: 21.5, returnAmount: 22.0 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
               <LineChartIcon size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">年度仪器借还趋势分析</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Monthly Borrowing & Returning Metrics (Y2024)</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl">
               <Calendar size={14} className="text-slate-400" />
               <select className="text-xs font-black bg-transparent outline-none uppercase tracking-widest">
                  <option>2024 年度</option>
                  <option>2023 年度</option>
               </select>
            </div>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
               <Download size={14} /> 导出分析表
            </button>
         </div>
      </div>

      <section className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600" />
         
         <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }}
                     dy={10}
                  />
                  <YAxis 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 10, fontMono: true, fontWeight: 700, fill: '#94A3B8' }}
                  />
                  <Tooltip 
                     contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                     itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  />
                  <Legend 
                     verticalAlign="top" 
                     align="right" 
                     iconType="circle"
                     wrapperStyle={{ paddingBottom: '40px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  <Line 
                     type="monotone" 
                     dataKey="borrowQty" 
                     name="借出数量" 
                     stroke="#1B6BE5" 
                     strokeWidth={4} 
                     dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                     activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                  <Line 
                     type="monotone" 
                     dataKey="returnQty" 
                     name="归还数量" 
                     stroke="#10B981" 
                     strokeWidth={4} 
                     strokeDasharray="8 6"
                     dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                     activeDot={{ r: 8, strokeWidth: 0 }}
                  />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">月份</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">借用数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">借用金额(万元)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">归还数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">归还金额(万元)</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {data.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-xs font-black text-slate-800">{r.name}</td>
                    <td className="px-8 py-4 text-center font-mono font-black text-blue-600 bg-blue-50/30">{r.borrowQty}</td>
                    <td className="px-8 py-4 text-right font-mono font-black text-slate-400">¥ {r.borrowAmount.toFixed(2)}</td>
                    <td className="px-8 py-4 text-center font-mono font-black text-emerald-600 bg-emerald-50/30">{r.returnQty}</td>
                    <td className="px-8 py-4 text-right font-mono font-black text-slate-400">¥ {r.returnAmount.toFixed(2)}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Download,
  Layers,
  ArrowUpDown
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

export const AssetClassReport: React.FC = () => {
  const [metric, setMetric] = useState<'qty' | 'amount'>('qty');

  const data = [
    { type: '一般教学仪器设备', qty: 450, amount: 125.5 },
    { type: '测量专用设备', qty: 120, amount: 80.2 },
    { type: '学科专用仪器设备', qty: 380, amount: 210.8 },
    { type: '模型', qty: 85, amount: 12.5 },
    { type: '标本', qty: 240, amount: 45.0 },
    { type: '玻璃仪器', qty: 1200, amount: 5.2 },
    { type: '试剂', qty: 650, amount: 8.4 },
    { type: '器材', qty: 320, amount: 15.6 },
    { type: '其他', qty: 95, amount: 10.2 },
  ];

  const totalQty = data.reduce((acc, curr) => acc + curr.qty, 0);
  const totalAmount = data.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1B6BE5] rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
               <Layers size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">仪器分类分布统计</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Asset Classification & Valuation Analysis</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
               <button 
                  onClick={() => setMetric('qty')}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    metric === 'qty' ? "bg-white text-[#1B6BE5] shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
               >
                  按数量
               </button>
               <button 
                  onClick={() => setMetric('amount')}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    metric === 'amount' ? "bg-white text-[#1B6BE5] shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
               >
                  按金额 (万元)
               </button>
            </div>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
               <Download size={14} /> 导出报表
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <section className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                     <XAxis type="number" hide />
                     <YAxis 
                        dataKey="type" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }}
                        width={120}
                     />
                     <Tooltip 
                        cursor={{ fill: '#F8FAFC' }}
                        content={({ active, payload }) => {
                           if (active && payload && payload.length) {
                              return (
                                 <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.type}</p>
                                    <p className="text-sm font-black tracking-tight">
                                       {metric === 'qty' ? payload[0].value.toLocaleString() + ' 件' : '¥' + payload[0].value.toLocaleString() + ' 万元'}
                                    </p>
                                 </div>
                              );
                           }
                           return null;
                        }}
                     />
                     <Bar 
                        dataKey={metric} 
                        radius={[0, 8, 8, 0]} 
                        barSize={20}
                     >
                        {data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1B6BE5' : '#6366F1'} fillOpacity={0.8} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </section>

         <section className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <BarChart3 size={100} />
               </div>
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-6">全量仪器资产汇总</h4>
                  <div className="space-y-6">
                     <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">设备总量</p>
                        <p className="text-4xl font-black tracking-tight">{totalQty.toLocaleString()} <span className="text-xs text-white/30 ml-1 font-bold">Units</span></p>
                     </div>
                     <div className="h-px bg-white/10 w-full" />
                     <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">资产估值</p>
                        <p className="text-4xl font-black tracking-tight">¥ {totalAmount.toFixed(1)} <span className="text-xs text-white/30 ml-1 font-bold">W-RMB</span></p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex-1">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">数据明细清单</span>
                  <ArrowUpDown size={14} className="text-slate-300" />
               </div>

               <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left">
                     <tbody>
                        {data.map((r, i) => (
                           <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                              <td className="py-4 px-6 text-[10px] font-black text-slate-600 uppercase tracking-tight">{r.type}</td>
                              <td className="py-4 px-6 text-right font-mono font-black text-xs text-slate-400">{metric === 'qty' ? r.qty : '¥' + r.amount}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </section>
      </div>
    </motion.div>
  );
};

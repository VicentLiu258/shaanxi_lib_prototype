import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Download,
  Search,
  RotateCcw
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export const AreaStatusReport: React.FC = () => {
  const data = [
    { area: '物理实验室 A101', idle: { qty: 25, val: 8.5 }, borrowed: { qty: 5, val: 2.1 }, disposed: { qty: 0, val: 0 }, total: { qty: 30, val: 10.6 } },
    { area: '物理实验室 A102', idle: { qty: 15, val: 12.0 }, borrowed: { qty: 10, val: 8.4 }, disposed: { qty: 2, val: 0.5 }, total: { qty: 27, val: 20.9 } },
    { area: '化学实验室 B201', idle: { qty: 85, val: 32.5 }, borrowed: { qty: 20, val: 8.2 }, disposed: { qty: 5, val: 1.0 }, total: { qty: 110, val: 41.7 } },
    { area: '生物实验室 C301', idle: { qty: 65, val: 78.0 }, borrowed: { qty: 2, val: 1.5 }, disposed: { qty: 1, val: 0.2 }, total: { qty: 68, val: 79.7 } },
    { area: '阶梯教室 1', idle: { qty: 12, val: 5.2 }, borrowed: { qty: 45, val: 15.0 }, disposed: { qty: 0, val: 0 }, total: { qty: 57, val: 20.2 } },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
               <MapPin size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">区域存量-状态分布报表</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Location-based Asset Inventory & Status Analytics</p>
            </div>
         </div>
         <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <Download size={14} /> 导出报表
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 max-w-md">
           <input type="text" placeholder="搜索存放位置..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           <button className="px-6 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">查询</button>
           <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"><RotateCcw size={18} /></button>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200/60 font-sans">
                  <th rowSpan={2} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">存放位置（区域）</th>
                  <th colSpan={2} className="px-8 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center border-r border-slate-100 bg-slate-100/30">闲置</th>
                  <th colSpan={2} className="px-8 py-3 text-[10px] font-black text-blue-500 uppercase tracking-widest text-center border-r border-slate-100 bg-blue-50/30">已借用</th>
                  <th colSpan={2} className="px-8 py-3 text-[10px] font-black text-rose-500 uppercase tracking-widest text-center border-r border-slate-100 bg-rose-50/30">已处置</th>
                  <th colSpan={2} className="px-8 py-3 text-[10px] font-black text-slate-800 uppercase tracking-widest text-center bg-slate-100/50">总计</th>
               </tr>
               <tr className="bg-slate-50 border-b border-slate-200/60">
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-100">数量</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-100">金额(万元)</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-100">数量</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-100">金额(万元)</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-100">数量</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-100">金额(万元)</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-100">数量</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">金额(万元)</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {data.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-4 text-xs font-black text-slate-800 border-r border-slate-100">{r.area}</td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-xs text-slate-600 border-r border-slate-100">{r.idle.qty}</td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-xs text-slate-400 border-r border-slate-100">{r.idle.val}</td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-xs text-slate-600 border-r border-slate-100">{r.borrowed.qty}</td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-xs text-slate-400 border-r border-slate-100">{r.borrowed.val}</td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-xs text-slate-600 border-r border-slate-100">{r.disposed.qty}</td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-xs text-slate-400 border-r border-slate-100">{r.disposed.val}</td>
                    <td className="px-4 py-4 text-center font-mono font-black text-xs text-slate-900 border-r border-slate-100 bg-slate-50/50">{r.total.qty}</td>
                    <td className="px-4 py-4 text-center font-mono font-black text-xs text-emerald-600 bg-slate-50/50">{r.total.val}</td>
                 </tr>
               ))}
               <tr className="bg-slate-900 text-white font-sans uppercase">
                  <td className="px-8 py-4 text-[10px] font-black tracking-widest">校内区域统计合计</td>
                  <td className="px-4 py-4 text-center font-mono font-black text-xs">202</td>
                  <td className="px-4 py-4 text-center font-mono font-black text-xs">136.2</td>
                  <td className="px-4 py-4 text-center font-mono font-black text-xs">82</td>
                  <td className="px-4 py-4 text-center font-mono font-black text-xs">35.2</td>
                  <td className="px-4 py-4 text-center font-mono font-black text-xs">8</td>
                  <td className="px-4 py-4 text-center font-mono font-black text-xs">1.7</td>
                  <td className="px-4 py-4 text-center font-mono font-black text-xs">292</td>
                  <td className="px-4 py-4 text-center font-mono font-black text-xs">173.1</td>
               </tr>
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Download, 
  TrendingUp,
  TrendingDown,
  Box,
  AlertTriangle,
  History,
  Info
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ConsumableStock: React.FC = () => {
  const stockItems = [
    { name: '烧杯 (500ml)', spec: 'GG-17 高硼硅', qty: 124, amount: 2480, unit: '个', safe: 50, status: '正常' },
    { name: '试管 (15x150mm)', spec: '普通玻璃', qty: 1200, amount: 600, unit: '支', safe: 200, status: '正常' },
    { name: '无水乙醇 (AR)', spec: '500ml/瓶', qty: 12, amount: 180, unit: '瓶', safe: 20, status: '预警' },
    { name: '定性滤纸 (12.5cm)', spec: '100张/盒', qty: 45, amount: 450, unit: '盒', safe: 10, status: '正常' },
    { name: '氢氧化钠 (AR)', spec: '500g/瓶', qty: 8, amount: 120, unit: '瓶', safe: 15, status: '预警' },
    { name: '胶头滴管', spec: '12cm 玻璃', qty: 85, amount: 170, unit: '个', safe: 30, status: '正常' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: '库存总金额', val: '¥ 12,480.00', sub: '实时价值', icon: Box, color: 'text-blue-500', bg: 'bg-blue-50' },
           { label: '总数量', val: '2,485', sub: '在库总量', icon: Info, color: 'text-slate-500', bg: 'bg-slate-100' },
           { label: '预警耗材', val: '08', sub: '低于安全水位', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: '入库频率', val: '周均 4 次', sub: '近一月数据', icon: History, color: 'text-emerald-500', bg: 'bg-emerald-50' },
         ].map((item, i) => (
            <div key={i} className="pro-card p-6 flex flex-col group hover:border-blue-200 transition-all">
               <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110", item.bg, item.color)}>
                  <item.icon size={20} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{item.label}</p>
               <h3 className="text-2xl font-black font-mono text-slate-800">{item.val}</h3>
               <p className="text-[10px] font-bold text-slate-400 mt-2">{item.sub}</p>
            </div>
         ))}
      </div>

      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex-1 min-w-[240px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 gap-3">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="搜索耗材名称..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
           </div>
           <div className="min-w-[150px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 gap-3">
              <input type="text" placeholder="规格型号" className="bg-transparent border-none outline-none text-sm font-medium w-full" />
           </div>
           <button className="px-6 py-2 bg-[#1B6BE5] text-white rounded-xl font-black text-xs">查询</button>
           <button className="px-6 py-2 bg-slate-100 text-slate-500 rounded-xl font-black text-xs">重置</button>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">耗材名称</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">规格型号</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">库存数量</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">库存金额</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">单位</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">安全库存</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">当前状态</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {stockItems.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-6 py-5">
                        <span className="text-sm font-bold text-slate-800">{item.name}</span>
                     </td>
                     <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-500">{item.spec}</span>
                     </td>
                     <td className="px-6 py-5 text-right font-black font-mono">{item.qty}</td>
                     <td className="px-6 py-5 text-right font-black font-mono text-[#1B6BE5]">¥ {item.amount.toLocaleString()}</td>
                     <td className="px-6 py-5 text-center text-xs font-bold text-slate-400">{item.unit}</td>
                     <td className="px-6 py-5 text-right font-black font-mono text-slate-400">{item.safe}</td>
                     <td className="px-6 py-5 text-center">
                        <span className={cn(
                           "px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase",
                           item.status === '正常' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse"
                        )}>
                           {item.status}
                        </span>
                     </td>
                     <td className="px-6 py-5 text-right">
                        <button className="text-xs font-black text-[#1B6BE5] hover:underline">入库记录</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Download,
  Package,
  AlertTriangle,
  History,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ConsumableStandard: React.FC = () => {
  const records = [
    { name: '一次性乳胶手套', model: 'M号/100只', type: '防护用品', category: '耗材', brand: '3M', unit: '盒', price: 45, threshold: 20, time: '2024-05-19 14:32' },
    { name: '电子级无水乙醇', model: '500ml/瓶', type: '化学试剂', category: '耗材', brand: '阿拉丁', unit: '瓶', price: 120, threshold: 5, time: '2024-05-18 10:20' },
    { name: '多孔培养板', model: '96孔/平底', type: '生物实验', category: '耗材', brand: 'NEST', unit: '个', price: 15, threshold: 50, time: '2024-05-15 16:45' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-xl">
               <Package size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">耗材标准品库</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Consumable Standard Catalog & Inventory Thresholds</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20">
            <Plus size={16} /> 新增
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">耗材名称</label>
              <input type="text" placeholder="输入名称..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">耗材类型</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部类型</option>
                 <option>化学试剂</option>
                 <option>防护用品</option>
              </select>
           </div>
           <div className="flex items-end gap-2 lg:col-span-2">
              <button className="flex-1 h-[43px] bg-[#1B6BE5] text-white rounded-xl font-black text-xs uppercase tracking-widest">查询</button>
              <button className="px-6 py-2 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 flex items-center gap-2"><Download size={14} /> 导出标准</button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">耗材名称</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">规格型号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">耗材类型</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">单位</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">预估单价</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">预警阈值</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">更新时间</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <span className="text-sm font-black text-slate-800 italic">{r.name}</span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{r.model}</td>
                    <td className="px-8 py-6">
                       <span className="px-2 py-0.5 rounded bg-amber-50 text-[10px] font-black text-amber-600 uppercase tracking-widest border border-amber-100">{r.type}</span>
                    </td>
                    <td className="px-8 py-6 text-center text-xs font-bold text-slate-500">{r.unit}</td>
                    <td className="px-8 py-6 text-right font-mono font-black text-amber-600">¥ {r.price.toLocaleString()}</td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex items-center justify-center gap-1">
                          <AlertTriangle size={10} className="text-amber-500" />
                          <span className="text-xs font-black font-mono text-amber-500">{r.threshold}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.time}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                          <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
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

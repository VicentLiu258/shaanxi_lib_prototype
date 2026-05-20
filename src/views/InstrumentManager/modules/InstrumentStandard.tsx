import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Download,
  BookOpen,
  Tag,
  Clock,
  ChevronRight,
  Settings
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentStandard: React.FC = () => {
  const records = [
    { name: '激光多参数分析仪', model: 'LP-3000', type: '分析仪器', category: '物理', brand: 'Leica', unit: '台', price: 124500, time: '2024-05-19 14:32' },
    { name: '精密电子天平', model: 'BT-224S', type: '计量器具', category: '通用', brand: 'Sartorius', unit: '台', price: 4500, time: '2024-05-18 10:20' },
    { name: '高倍光学显微镜', model: 'NX-51', type: '观测仪器', category: '生物', brand: 'Nikon', unit: '台', price: 32000, time: '2024-05-15 16:45' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl">
               <BookOpen size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">仪器标准品库</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Instrument Standard Catalog & Specifications</p>
            </div>
         </div>
         <button 
           onClick={() => alert('请填写新增标准品规格：\n名称、规格型号、分类、品牌、计量单位、预估单价等')}
           className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
         >
            <Plus size={16} /> 新增
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">仪器名称</label>
              <input type="text" placeholder="输入名称..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">仪器类型</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部类型</option>
                 <option>分析仪器</option>
                 <option>观测仪器</option>
              </select>
           </div>
           <div className="flex items-end gap-2 lg:col-span-2">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">查询</button>
              <button className="px-6 py-2 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 flex items-center gap-2"><Download size={14} /> 导出标准</button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">标准品名称</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">规格型号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">仪器类型</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">资产分类</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">品牌厂商</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">预估单价</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">更新时间</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <span className="text-sm font-black text-slate-800 leading-tight block underline decoration-slate-200 underline-offset-4">{r.name}</span>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{r.model}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <Tag size={12} className="text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{r.type}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.category}</span>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-black text-slate-600">{r.brand}</span>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-black text-[#1B6BE5]">¥ {r.price.toLocaleString()}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.time}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 pr-8">
                           <button 
                            onClick={() => alert('已进入仪器标准品编辑模式')}
                            className="p-1 px-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded hover:bg-[#1B6BE5] hover:text-white transition-all uppercase tracking-widest"
                           >
                            编辑
                           </button>
                           <button 
                            onClick={() => confirm('确定从标准库移除此条目？')}
                            className="p-1 px-2 border border-slate-200 text-slate-400 text-[10px] font-black rounded hover:text-red-500 hover:border-red-200 transition-all uppercase tracking-widest"
                           >
                            删除
                           </button>
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

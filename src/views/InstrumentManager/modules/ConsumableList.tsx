import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Download,
  Printer,
  Edit2,
  Trash2,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ConsumableList: React.FC = () => {
  const [showMoreFilters, setShowMoreFilters] = React.useState(false);
  const records = [
    { id: 'C001', sn: 'HC-20240519-01', name: '一次性乳胶手套', model: 'M号/100只', type: '防护用品' },
    { id: 'C002', sn: 'HC-20240519-02', name: '电子级无水乙醇', model: '500ml/瓶', type: '化学试剂' },
    { id: 'C003', sn: 'HC-20240519-03', name: '多孔培养板', model: '96孔/平底', type: '生物实验' },
    { id: 'C004', sn: 'HC-20240519-04', name: '离心管', model: '15ml/50个', type: '生物实验' },
    { id: 'C005', sn: 'HC-20240519-05', name: '显微镜盖玻片', model: '24x24mm', type: '观测耗材' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">耗材清单</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Consumable Master List & Assets Identification</p>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
               <Printer size={16} /> 标签打印
            </button>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2">
               <Plus size={16} /> 录入新耗材
            </button>
         </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
               <Package size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">耗材SKU总量</p>
               <h3 className="text-3xl font-black text-slate-800 font-mono italic">1,245 <span className="text-sm font-bold text-slate-300 not-italic uppercase ml-1">Items</span></h3>
            </div>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
               <Layers size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">耗材估值总计</p>
               <h3 className="text-3xl font-black text-slate-800 font-mono italic">¥ 124.8K <span className="text-sm font-bold text-slate-300 not-italic uppercase ml-1">CNY</span></h3>
            </div>
         </div>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="搜索耗材名称、规格..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" />
           </div>
           <button className="px-6 py-3 bg-[#1B6BE5] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all">查询</button>
           <button 
             onClick={() => setShowMoreFilters(!showMoreFilters)}
             className={cn(
               "p-3 rounded-2xl transition-all border",
               showMoreFilters ? "bg-slate-900 text-white border-slate-900" : "bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200"
             )}
           >
             <Filter size={20} />
           </button>
           <div className="h-8 w-px bg-slate-100 mx-2" />
           <button className="px-6 py-3 border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
              <Download size={16} /> 导出
           </button>
        </div>
        {showMoreFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-6 pt-6 border-t border-dashed border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">耗材编号</label>
                <input type="text" placeholder="HC-XXXXXX" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">标签编码</label>
                <input type="text" placeholder="SN-XXXXXX" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">耗材类型</label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none">
                   <option>全部类型</option>
                   <option>化学试剂</option>
                   <option>防护用品</option>
                   <option>生物实验</option>
                </select>
             </div>
          </motion.div>
        )}
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-sans">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">序号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">耗材编号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">标签编码</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">耗材名称</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">规格型号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">耗材类型</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">{r.id}</td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{r.sn}</td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-mono font-bold text-slate-300">SN-XXXXXXXX</span>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-sm font-black text-slate-800 italic block">{r.name}</span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{r.model}</td>
                    <td className="px-8 py-6">
                       <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.type}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1.5">
                             <Edit2 size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">修改</span>
                          </button>
                          <button className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1.5">
                             <Trash2 size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">删除</span>
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
         <div className="h-16 bg-slate-50/50 px-8 flex items-center justify-between border-t border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Listing page 1 of 42 results</p>
            <div className="flex items-center gap-1">
               <button className="p-2 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:bg-white rounded-lg transition-all"><ChevronLeft size={20} /></button>
               <div className="flex items-center gap-1">
                  {[1, 2, 3].map(p => (
                    <button key={p} className={cn(
                      "w-8 h-8 rounded-lg text-xs font-black transition-all",
                      p === 1 ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "text-slate-400 hover:bg-white"
                    )}>{p}</button>
                  ))}
               </div>
               <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><ChevronRight size={20} /></button>
            </div>
         </div>
      </section>
    </motion.div>
  );
};

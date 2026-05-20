import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Undo2,
  Clock,
  User,
  Plus,
  ChevronRight,
  Filter,
  Download,
  CheckSquare,
  FileSearch
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ConsumableRevert: React.FC = () => {
  const [showMoreFilters, setShowMoreFilters] = React.useState(false);
  const records = [
    { status: '已退还', id: 'TH-240519001', user: '李向东', qty: 5, date: '2024-05-19', creator: '管理员' },
    { status: '待审批', id: 'TH-240518004', user: '王美丽', qty: 2, date: '2024-05-18', creator: '王美丽' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
               <Undo2 size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight font-sans italic">耗材余料退还</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Consumable Material Return & Re-entry</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> 退还
         </button>
      </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="搜索退还单号、退还人..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none" />
           </div>
           <button className="px-8 py-3 bg-[#1B6BE5] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all">查询</button>
           <button 
             onClick={() => setShowMoreFilters(!showMoreFilters)}
             className={cn(
               "p-3 rounded-2xl transition-all border",
               showMoreFilters ? "bg-slate-900 text-white border-slate-900" : "bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200"
             )}
           >
             <Filter size={20} />
           </button>
           <div className="h-8 w-px bg-slate-100 mx-1" />
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">审批状态</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none">
                   <option>全部</option>
                   <option>待审批</option>
                   <option>已退还</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">退还单号</label>
                <input type="text" placeholder="TH-XXXXXXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none font-mono" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">退还日期</label>
                <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none" />
             </div>
          </motion.div>
        )}

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">退还单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">退还人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">退还时间</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">创建人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 text-center">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                         r.status === '已退还' ? "text-emerald-500 bg-emerald-50 border-emerald-100" : "text-amber-500 bg-amber-50 border-amber-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{r.id}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-300" />
                          <span className="text-xs font-black text-slate-600">{r.user}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center font-mono font-black">{r.qty}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400 uppercase">{r.date}</td>
                    <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.creator}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 text-indigo-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1.5">
                             <FileSearch size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">详情</span>
                          </button>
                          {r.status === '待审批' && (
                             <button className="px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-1.5">
                                <CheckSquare size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">审批</span>
                             </button>
                          )}
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

import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  ArrowRightLeft,
  ChevronRight,
  User,
  MapPin,
  Clock,
  Plus,
  Filter,
  Download,
  CheckSquare,
  FileSearch
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ConsumableMigration: React.FC = () => {
  const [showMoreFilters, setShowMoreFilters] = React.useState(false);
  const records = [
    { status: '已完成', id: 'ZY-240519001', date: '2024-05-19', qty: 10, targetOrg: '高一物理组', targetPos: '物理楼 302', creator: '管理员' },
    { status: '待审批', id: 'ZY-240518004', date: '2024-05-18', qty: 1, targetOrg: '电教中心', targetPos: '行政楼 201', creator: '李华' },
    { status: '已驳回', id: 'ZY-240515012', date: '2024-05-15', qty: 5, targetOrg: '化学实验室', targetPos: '实验楼 105', creator: '王五' },
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
               <ArrowRightLeft size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">耗材转移调度</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Consumable Asset Migration & Location Transfer</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> 转移
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="flex items-center gap-4">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                 type="text" 
                 placeholder="搜索转移单号、目标组织..." 
                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none"
              />
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">转移单号</label>
                <input type="text" placeholder="ZY-XXXXXXXX" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none font-mono" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">转移出/入组织</label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none">
                   <option>全部组织</option>
                   <option>教务处</option>
                   <option>档案室</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">转移日期</label>
                <input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
             </div>
          </motion.div>
        )}
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">审批状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">转移单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">转移日期</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                         r.status === '已完成' ? "text-emerald-500 bg-emerald-50 border-emerald-100" :
                         r.status === '待审批' ? "text-blue-500 bg-blue-50 border-blue-100" : "text-rose-500 bg-rose-50 border-rose-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{r.id}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.date}</td>
                    <td className="px-8 py-6 text-center font-mono font-black">{r.qty}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex items-center gap-1.5">
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

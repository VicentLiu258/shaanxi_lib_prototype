import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  ClipboardCheck,
  User,
  Clock,
  Briefcase,
  ChevronRight,
  Filter,
  Download,
  CheckSquare,
  FileSearch
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ConsumableReceipt: React.FC = () => {
  const [showMoreFilters, setShowMoreFilters] = React.useState(false);
  const records = [
    { status: '已领用', id: 'LY-240519001', org: '高一物理组', user: '李向东', date: '2024-05-19', qty: 50, creator: '管理员' },
    { status: '待审批', id: 'LY-240518004', org: '生物实验室', user: '王美丽', date: '2024-05-18', qty: 20, creator: '王美丽' },
    { status: '审批中', id: 'LY-240517012', org: '电教中心', user: '张文明', date: '2024-05-17', qty: 5, creator: '张文明' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
               <ClipboardCheck size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">耗材领用申请</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Consumable Receipt & Usage Requests</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> 领用
         </button>
      </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="搜索领用单号、领用人..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none" />
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
                   <option>已领用</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">所属组织</label>
                <input type="text" placeholder="搜索部门..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">领用日期</label>
                <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none" />
             </div>
          </motion.div>
        )}

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">审批状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">领用单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">所属部门</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">领用人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">领用总量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">申领日期</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">创建人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                         r.status === '已领用' ? "text-emerald-500 bg-emerald-50 border-emerald-100" :
                         r.status === '审批中' ? "text-blue-500 bg-blue-50 border-blue-100" : "text-amber-500 bg-amber-50 border-amber-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{r.id}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <Briefcase size={12} className="text-slate-300" />
                          <span className="text-xs font-bold text-slate-700">{r.org}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-300" />
                          <span className="text-xs font-black text-slate-600">{r.user}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-black">{r.qty}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.date}</td>
                    <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.creator}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1.5">
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

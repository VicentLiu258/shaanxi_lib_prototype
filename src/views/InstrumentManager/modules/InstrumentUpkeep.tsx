import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Plus, 
  CheckCircle,
  Clock,
  User,
  ClipboardList,
  Eye,
  Settings
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentUpkeep: React.FC = () => {
  const records = [
    { status: '已完成', id: 'MT-240519001', date: '2024-05-19', nextDate: '2024-08-19', user: '张伟', qty: 5, operator: '系统', time: '2024-05-19 09:00' },
    { status: '进行中', id: 'MT-240518004', date: '2024-05-18', nextDate: '2024-08-18', user: '李娜', qty: 2, operator: '管理员', time: '2024-05-18 14:30' },
    { status: '待开始', id: 'MT-240520010', date: '2024-05-20', nextDate: '2024-08-20', user: '王超', qty: 1, operator: '管理员', time: '2024-05-19 16:20' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
               <ClipboardList size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">保养实施记录</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Instrument Maintenance Execution Logs</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2">
            <Plus size={16} /> 录入保养日志
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="space-y-2 lg:col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">作业状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部</option>
                 <option>进行中</option>
                 <option>已完成</option>
              </select>
           </div>
           <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">保养单号 / 负责人</label>
              <input type="text" placeholder="搜索单号或姓名..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2 lg:col-span-2 flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">保养时间区间</label>
                <div className="flex items-center gap-2">
                   <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold w-full" />
                   <span className="text-slate-300">~</span>
                   <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold w-full" />
                </div>
              </div>
              <button className="h-[43px] px-6 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">查询</button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">保养单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">本次保养日</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">下次预期日</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">保养人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">创建时间</th>
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
                         r.status === '进行中' ? "text-blue-500 bg-blue-50 border-blue-100" : "text-amber-500 bg-amber-50 border-amber-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400">{r.id}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-500 uppercase">{r.date}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-300 uppercase">{r.nextDate}</td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-black text-slate-700">{r.user}</span>
                    </td>
                    <td className="px-8 py-6 text-center font-mono font-black text-sm">{r.qty}</td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">{r.time}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Eye size={18} /></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

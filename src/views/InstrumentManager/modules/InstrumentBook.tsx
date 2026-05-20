import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
  MoreVertical
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentBook: React.FC = () => {
  const records = [
    { status: '预约中', id: 'YY-240519001', purpose: '高二一班 物理实验', qty: 15, user: '张伟', start: '2024-05-20 09:00', end: '2024-05-20 10:30' },
    { status: '已取消', id: 'YY-240518004', purpose: '化学兴趣小组', qty: 5, user: '李娜', start: '2024-05-21 14:00', end: '2024-05-21 16:00' },
    { status: '已生效', id: 'YY-240517012', purpose: '课题研究', qty: 1, user: '王超', start: '2024-05-19 14:30', end: '2024-05-19 17:00' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
               <Calendar size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">仪器预约大厅</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Instrument Reservation & Booking Schedule</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-sky-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-sky-500/20 transition-all flex items-center gap-2">
            <Plus size={16} /> 立即发起预约
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">预约人</label>
              <input type="text" placeholder="输入姓名" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部预约</option>
                 <option>预约中</option>
                 <option>已生效</option>
                 <option>已取消</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">预约日期</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold w-full outline-none" />
           </div>
           <div className="flex items-end gap-2">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">检索预约单</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">预约单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">用途说明</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">预约总数</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">预约人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">有效期</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                         r.status === '已生效' ? "text-emerald-500 bg-emerald-50 border-emerald-100" :
                         r.status === '预约中' ? "text-sky-500 bg-sky-50 border-sky-100" : "text-rose-500 bg-rose-50 border-rose-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-sky-600 transition-colors uppercase tracking-widest">{r.id}</td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-black text-slate-700">{r.purpose}</span>
                    </td>
                    <td className="px-8 py-6 text-center font-mono font-black text-sm">{r.qty}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-300" />
                          <span className="text-xs font-black text-slate-600">{r.user}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-400 uppercase">
                          <div className="flex items-center gap-1"><Clock size={10} /> {r.start}</div>
                          <div className="flex items-center gap-1"><Clock size={10} /> {r.end}</div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={18} /></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

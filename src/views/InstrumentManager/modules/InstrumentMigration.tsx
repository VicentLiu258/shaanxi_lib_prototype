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
  Plus
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentMigration: React.FC = () => {
  const records = [
    { status: '已完成', id: 'ZY-240519001', date: '2024-05-19', qty: 10, targetOrg: '高一物理组', targetPos: '物理楼 302', creator: '管理员' },
    { status: '审批中', id: 'ZY-240518004', date: '2024-05-18', qty: 1, targetOrg: '电教中心', targetPos: '行政楼 201', creator: '李华' },
    { status: '已驳回', id: 'ZY-240515012', date: '2024-05-15', qty: 5, targetOrg: '化学实验室', targetPos: '实验楼 105', creator: '王五' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">仪器转移调度</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Instrument Asset Migration & Location Transfer</p>
         </div>
         <button className="px-8 py-3 bg-[#1B6BE5] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> 创建转移任务
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">审批状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部</option>
                 <option>审批中</option>
                 <option>已完成</option>
                 <option>已驳回</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">转移日期</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">转移单号</label>
              <input type="text" placeholder="ZY-XXXXXXXX" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full font-mono outline-none" />
           </div>
           <div className="flex items-end gap-2">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">检索记录</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">审批状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">转移单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">转移日期</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">转移数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">目标组织</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">目标存放位置</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">申请人</th>
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
                         r.status === '审批中' ? "text-blue-500 bg-blue-50 border-blue-100" : "text-rose-500 bg-rose-50 border-rose-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{r.id}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.date}</td>
                    <td className="px-8 py-6 text-center font-mono font-black text-sm">{r.qty}</td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-black text-slate-800">{r.targetOrg}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{r.targetPos}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{r.creator}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 text-slate-300 hover:text-blue-500 transition-colors"><ChevronRight size={20} /></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

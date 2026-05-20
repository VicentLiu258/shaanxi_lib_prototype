import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Download,
  Filter,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Camera,
  ArchiveRestore
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentReturn: React.FC = () => {
  const records = [
    { status: '待归还', id: 'GH-240519001', user: '李向东', date: '2024-05-19', qty: 3, creator: '管理员' },
    { status: '已归还', id: 'GH-240518004', user: '王美丽', date: '2024-05-18', qty: 1, creator: '管理员' },
    { status: '待归还', id: 'GH-240517012', user: '张文明', date: '2024-05-17', qty: 2, creator: '管理员' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">仪器归还作业中心</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Instrument Return Processing & Verification</p>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('正在导出归还记录清单...')}
              className="px-6 py-2.5 border border-slate-200 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
               <Download size={16} /> 导出
            </button>
            <button 
              onClick={() => alert('请选择已借出的仪器单据进行归还登记')}
              className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
            >
               <ArchiveRestore size={16} /> 归还
            </button>
         </div>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">归还人</label>
              <input type="text" placeholder="输入归还人姓名" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">归还单号 / ID</label>
              <input type="text" placeholder="GH-XXXXXXXX" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full font-mono outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">归还日期范围</label>
              <div className="flex items-center gap-2">
                 <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold w-full" />
                 <span className="text-slate-300">~</span>
                 <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold w-full" />
              </div>
           </div>
           <div className="flex items-end gap-2">
              <button className="flex-1 h-[43px] bg-[#1B6BE5] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all">查询</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">归还单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">归还人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">归还日期</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                         r.status === '已归还' ? "text-emerald-500 bg-emerald-50 border-emerald-100" : "text-amber-500 bg-amber-50 border-amber-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-black font-mono text-slate-400 group-hover:text-blue-600 transition-colors">{r.id}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-300" />
                          <span className="text-xs font-black text-slate-600">{r.user}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono text-sm font-black">{r.qty}</td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-mono font-bold text-slate-400">{r.date}</span>
                    </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           {r.status === '待归还' ? (
                             <>
                               <button 
                                onClick={() => alert('请对该项归还申请进行审批（判定损耗、通过或拒绝）')}
                                className="text-[10px] font-black text-[#1B6BE5] uppercase tracking-widest hover:underline"
                               >
                                 审批
                               </button>
                               <button 
                                onClick={() => alert('正在办理归还登记...')}
                                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                               >
                                  <ArchiveRestore size={12} /> 归还
                               </button>
                             </>
                           ) : (
                             <button 
                              onClick={() => alert('查看归还单据与凭证照片')}
                              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                             >
                              详情
                             </button>
                           )}
                           <button className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
                              <Camera size={14} />
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

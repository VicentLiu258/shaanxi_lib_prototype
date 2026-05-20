import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Briefcase
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentBorrow: React.FC = () => {
  const records = [
    { status: '借用中', id: 'BR-240519001', org: '物理一组', user: '李向东', start: '2024-05-19', end: '2024-05-26', qty: 3, creator: '管理员' },
    { status: '待审批', id: 'BR-240519002', org: '化学二科', user: '王美丽', start: '2024-05-20', end: '2024-05-22', qty: 1, creator: '王美丽' },
    { status: '已拒绝', id: 'BR-240518015', org: '生物竞赛组', user: '孙志平', start: '2024-05-18', end: '2024-05-18', qty: 5, creator: '管理员' },
    { status: '借用中', id: 'BR-240515008', org: '电教中心', user: '赵伟', start: '2024-05-15', end: '2024-05-30', qty: 2, creator: '赵伟' },
  ];

  const statusMap = {
    '借用中': 'text-blue-500 bg-blue-50 border-blue-100',
    '待审批': 'text-amber-500 bg-amber-50 border-amber-100',
    '已拒绝': 'text-rose-500 bg-rose-50 border-rose-100',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">仪器借用申请</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Instrument Borrowing Requests & Records</p>
         </div>
         <button 
           onClick={() => alert('请选择仪器并填写：使用人、借用日期、归还日期')}
           className="px-8 py-3 bg-[#1B6BE5] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
         >
            <Plus size={16} /> 借用
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">审批状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none focus:ring-2 focus:ring-blue-500/10">
                 <option>全部</option>
                 <option>待审批</option>
                 <option>借用中</option>
                 <option>已归还</option>
                 <option>已拒绝</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">所属组织</label>
              <input type="text" placeholder="搜索部门..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">使用人</label>
              <input type="text" placeholder="搜索姓名..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="flex items-end gap-2">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">查询</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"><Filter size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">审批状态</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">借用单号</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">所属部门</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">使用人</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">借用周期</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">借用总量</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">创建时间</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {records.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-8 py-6 whitespace-nowrap">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                            statusMap[r.status as keyof typeof statusMap]
                          )}>
                             {r.status}
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-xs font-black font-mono text-slate-400 group-hover:text-blue-600 transition-colors">{r.id}</span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <Briefcase size={12} className="text-slate-300" />
                             <span className="text-xs font-bold text-slate-700">{r.org}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {r.user[0]}
                             </div>
                             <span className="text-xs font-black text-slate-600">{r.user}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <Calendar size={10} /> {r.start} ~ {r.end}
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <span className="text-sm font-black font-mono text-[#1B6BE5]">{r.qty}</span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-[10px] font-mono font-bold text-slate-400">2024-05-19 10:24</span>
                       </td>
                       <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => alert('正在加载借用申请详情...')}
                                className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors"
                              >
                                详情
                              </button>
                              <button 
                                onClick={() => alert('请审批此项借用申请：[通过] 或 [拒绝]')}
                                className="text-xs font-black text-[#1B6BE5] uppercase tracking-widest hover:underline"
                              >
                                审批
                              </button>
                           </div>
                        </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="h-16 bg-slate-50/50 border-t border-slate-200 px-8 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-sans animate-pulse">Total 128 borrowing sessions tracked</p>
            <div className="flex items-center gap-1">
               <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><ChevronLeft size={18} /></button>
               <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><ChevronRight size={18} /></button>
            </div>
         </div>
      </section>
    </motion.div>
  );
};

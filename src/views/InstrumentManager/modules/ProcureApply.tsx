import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  RotateCcw, 
  Download,
  ShoppingCart,
  User,
  Briefcase,
  ChevronRight,
  Clock,
  CheckSquare,
  Undo2,
  FileSearch
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ProcureApply: React.FC = () => {
  const records = [
    { id: 'SQ-20240519001', qty: 45, amount: 12500, org: '物理教研室', user: '李向东', date: '2024-05-19', creator: '管理员', status: '审批中' },
    { id: 'SQ-20240518005', qty: 10, amount: 450, org: '实验管理中心', user: '王美丽', date: '2024-05-18', creator: '王美丽', status: '草稿' },
    { id: 'SQ-20240510002', qty: 2, amount: 8000, org: '信息科', user: '张文明', date: '2024-05-10', creator: '张文明', status: '已通过' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
               <ShoppingCart size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">采购需求申请</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Procurement Requisition & Acquisition Requests</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                <Download size={16} /> 导出</button>
             <button className="px-8 py-3 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
                <Plus size={16} /> 新增
             </button>
         </div>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">采购单号</label>
              <input type="text" placeholder="SQ-XXXXXXXX" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full font-mono outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">申请组织</label>
              <input type="text" placeholder="搜索部门..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部</option>
                 <option>草稿</option>
                 <option>审批中</option>
                 <option>已通过</option>
                 <option>已拒绝</option>
                 <option>已关闭</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">申请日期</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold w-full outline-none" />
           </div>
           <div className="flex items-end gap-2 text-center">
              <button className="flex-1 h-[43px] bg-[#1B6BE5] text-white rounded-xl font-black text-xs uppercase tracking-widest">查询</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">采购单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">总金额(元)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">申请组织</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">申请人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">申请日期</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-orange-600 transition-colors tracking-widest">{r.id}</td>
                    <td className="px-8 py-6 text-center font-mono font-black">{r.qty}</td>
                    <td className="px-8 py-6 text-right font-mono font-black text-orange-600">¥ {r.amount.toLocaleString()}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <Briefcase size={12} className="text-slate-300" />
                          <span className="text-xs font-bold text-slate-700">{r.org}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-300" />
                          <span className="text-xs font-black text-slate-600 uppercase">{r.user}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                         r.status === '已通过' ? "text-emerald-500 bg-emerald-50 border-emerald-100" :
                         r.status === '审批中' ? "text-orange-500 bg-orange-50 border-orange-100" :
                         r.status === '草稿' ? "text-slate-400 bg-slate-50 border-slate-200" : "text-rose-500 bg-rose-50 border-rose-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.date}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 text-[#1B6BE5] hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1.5" title="详情">
                             <FileSearch size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">详情</span>
                          </button>
                          {r.status === '审批中' && (
                             <>
                               <button className="px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-1.5" title="审批">
                                  <CheckSquare size={14} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">审批</span>
                               </button>
                               <button className="px-3 py-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-all flex items-center gap-1.5" title="撤回">
                                  <Undo2 size={14} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">撤回</span>
                               </button>
                             </>
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

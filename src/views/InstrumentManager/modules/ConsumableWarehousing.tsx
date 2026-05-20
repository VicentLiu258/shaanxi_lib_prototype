import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Database,
  Plus,
  CheckCircle2,
  Clock,
  Ban,
  ChevronRight,
  Download,
  Save,
  FileSearch,
  CheckSquare
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ConsumableWarehousing: React.FC = () => {
  const records = [
    { status: '已审批', id: 'CRK-240519001', type: '采购入库', user: '张伟', qty: 100, amount: 2450, date: '2024-05-19' },
    { status: '待审批', id: 'CRK-240518005', type: '申请领用', user: '李三', qty: 200, amount: 1200, date: '2024-05-18' },
    { status: '已驳回', id: 'CRK-240515012', type: '调拨入库', user: '王五', qty: 50, amount: 450, date: '2024-05-15' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
               <Database size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">耗材入库流水</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Consumable Inbound Logistics & Inventory Records</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
               导入
            </button>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
               <Download size={16} /> 导出
            </button>
            <button className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20">
               <Plus size={16} /> 办理入库
            </button>
         </div>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">审批状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部</option>
                 <option>已审批</option>
                 <option>待审批</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">入库人</label>
              <input type="text" placeholder="输入姓名" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">批次号</label>
              <input type="text" placeholder="CRK-XXXXXXXX" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full font-mono outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">日期区间</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold w-full outline-none" />
           </div>
           <div className="flex items-end gap-2">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">查询</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">批次号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">入库类型</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">办理人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">入库数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">入库金额</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">日期</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                         r.status === '已审批' ? "text-emerald-500 bg-emerald-50 border-emerald-100" :
                         r.status === '待审批' ? "text-amber-500 bg-amber-50 border-amber-100" : "text-rose-500 bg-rose-50 border-rose-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-amber-600 transition-colors uppercase tracking-widest">{r.id}</td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-700">{r.type}</td>
                    <td className="px-8 py-6 text-xs font-black text-slate-600">{r.user}</td>
                    <td className="px-8 py-6 text-right font-mono font-black">{r.qty}</td>
                    <td className="px-8 py-6 text-right font-mono font-black text-emerald-600">¥ {r.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.date}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 text-[#1B6BE5] hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1.5">
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

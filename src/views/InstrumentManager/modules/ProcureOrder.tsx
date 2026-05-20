import React from 'react';
import { motion } from 'motion/react';
import { 
  RotateCcw, 
  Download,
  ScrollText,
  User,
  Truck,
  ChevronRight,
  ClipboardCheck,
  Ban,
  Database,
  FileSearch
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ProcureOrder: React.FC = () => {
  const records = [
    { id: 'PO-20240519001', qty: 100, entryQty: 85, entryAmount: 85000, date: '2024-05-19', vendor: '咸阳教学仪器有限公司', org: '实验室中心', executor: '李向东', status: '部分入库' },
    { id: 'PO-20240518005', qty: 10, entryQty: 10, entryAmount: 4500, date: '2024-05-18', vendor: '晨光文具', org: '校务处', executor: '管理员', status: '已全部入库' },
    { id: 'PO-20240510002', qty: 5, entryQty: 0, entryAmount: 0, date: '2024-05-10', vendor: '戴尔(中国)', org: '信息科', executor: '张文明', status: '待入库' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
               <ScrollText size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">采购订单实施管理</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Purchase Order Monitoring & Fulfillment</p>
            </div>
         </div>
         <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download size={16} /> 导出
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">订单状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部</option>
                 <option>待入库</option>
                 <option>部分入库</option>
                 <option>已全部入库</option>
                 <option>已关闭</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">单号检索</label>
              <input type="text" placeholder="PO-XXXXXXXX" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full font-mono outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">采购组织</label>
              <input type="text" placeholder="搜索部门" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">采购日期</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold w-full outline-none" />
           </div>
           <div className="flex items-end gap-2 text-center">
              <button className="flex-1 h-[43px] bg-[#1B6BE5] text-white rounded-xl font-black text-xs uppercase tracking-widest">查询</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">供应商信息</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">需求/入库</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">入库金额</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">执行人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="text-xs font-mono font-black text-slate-400 group-hover:text-blue-800 transition-colors uppercase tracking-widest">{r.id}</div>
                       <div className="text-[10px] font-bold text-slate-300 mt-1 uppercase">{r.date}</div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <Truck size={14} className="text-slate-300" />
                          <div>
                            <div className="text-xs font-black text-slate-700">{r.vendor}</div>
                            <div className="text-[10px] font-bold text-slate-400">{r.org}</div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex flex-col gap-1 items-center justify-center">
                          <span className="text-xs font-black text-slate-800">{r.entryQty} <span className="text-slate-300">/ {r.qty}</span></span>
                          <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: `${(r.entryQty / r.qty) * 100}%` }} />
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-black text-blue-600">¥ {r.entryAmount.toLocaleString()}</td>
                    <td className="px-8 py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                         r.status === '已全部入库' ? "text-emerald-500 bg-emerald-50 border-emerald-100" :
                         r.status === '部分入库' ? "text-blue-500 bg-blue-50 border-blue-100" : "text-amber-500 bg-amber-50 border-amber-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-300" />
                          <span className="text-xs font-black text-slate-600 uppercase">{r.executor}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 text-[#1B6BE5] hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1.5" title="详情">
                             <FileSearch size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">详情</span>
                          </button>
                          {(r.status === '部分入库' || r.status === '待入库') && (
                             <button className="px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-1.5" title="入库">
                                <Database size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">入库</span>
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

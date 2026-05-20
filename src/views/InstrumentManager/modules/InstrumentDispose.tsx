import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Trash2,
  AlertTriangle,
  Receipt,
  Clock,
  MoreHorizontal,
  Plus,
  Download
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentDispose: React.FC = () => {
  const records = [
    { status: '已审批', id: 'CZ-240519001', date: '2024-05-19', user: '管理员', qty: 2, amount: 450, creator: '张三' },
    { status: '待审批', id: 'CZ-240518005', date: '2024-05-18', user: '管理员', qty: 1, amount: 0, creator: '李四' },
    { status: '审批中', id: 'CZ-240517012', date: '2024-05-17', user: '管理员', qty: 5, amount: 1200, creator: '王五' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">仪器资产处置</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Instrument Asset Disposal & Scrapping</p>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('请选择文件导入批量处置数据')}
              className="px-6 py-3 border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
               <Plus size={16} /> 导入
            </button>
            <button 
              onClick={() => alert('正在导出处置记录报表...')}
              className="px-6 py-3 border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
               <Download size={16} /> 导出
            </button>
            <button 
              onClick={() => alert('请选择待处置仪器，并填写处置方式（报废/变卖/转让）、处置金额、日期')}
              className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-2"
            >
               <Trash2 size={16} /> 处置
            </button>
         </div>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">审批状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部</option>
                 <option>待审批</option>
                 <option>已审批</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">处置单号</label>
              <input type="text" placeholder="CZ-XXXXXXXX" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">处置人</label>
              <input type="text" placeholder="输入姓名" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">处置日期</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold w-full" />
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
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">处置单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">处置日期</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">处置人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">处置数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">处置估金额</th>
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
                         r.status === '已审批' ? "text-emerald-500 bg-emerald-50 border-emerald-100" :
                         r.status === '审批中' ? "text-blue-500 bg-blue-50 border-blue-100" : "text-amber-500 bg-amber-50 border-amber-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400">{r.id}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.date}</td>
                    <td className="px-8 py-6 text-xs font-black text-slate-600">{r.user}</td>
                    <td className="px-8 py-6 text-right font-mono font-black">{r.qty}</td>
                    <td className="px-8 py-6 text-right font-mono font-black text-red-600">¥ {r.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.creator}</td>
                     <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                            onClick={() => alert('查看资产处置流程详情')}
                            className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors"
                           >
                            详情
                           </button>
                           <button 
                            onClick={() => alert('正在审批处置申请... [同意/驳回]')}
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
      </section>
    </motion.div>
  );
};

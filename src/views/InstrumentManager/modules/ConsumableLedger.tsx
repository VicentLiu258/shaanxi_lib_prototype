import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  History,
  Download,
  User,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  MapPin
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ConsumableLedger: React.FC = () => {
  const records = [
    { code: 'HC001', sn: 'SN99231', name: '一次性乳胶手套', model: 'M号', user: '张伟', time: '2024-05-19 14:30', type: '入库', qty: '+100', pos: '主仓库 A1' },
    { code: 'HC002', sn: 'SN99235', name: '无皮电子天平秤', model: '2kg', user: '李娜', time: '2024-05-19 11:20', type: '领用', qty: '-1', pos: '物理实验室' },
    { code: 'HC003', sn: 'SN99240', name: '试管架', model: '24孔', user: '王超', time: '2024-05-18 16:45', type: '处置', qty: '-5', pos: '化学储备室' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl">
               <History size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">耗材台账明细</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Consumable General Ledger & Transaction History</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
            <Download size={16} /> 导出
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">耗材名称</label>
              <input type="text" placeholder="输入名称..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">操作类型</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部类型</option>
                 <option>入库</option>
                 <option>领用</option>
                 <option>退还</option>
                 <option>处置</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">操作人</label>
              <input type="text" placeholder="搜索姓名..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">日期范围</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold w-full outline-none" />
           </div>
           <div className="flex items-end gap-2 text-center">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">全局检索</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">耗材编号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">耗材名称</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">规格型号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">操作类型</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">变动数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">存放位置</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">操作人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">操作时间</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 uppercase tracking-widest">{r.code}</td>
                    <td className="px-8 py-6">
                       <span className="text-sm font-black text-slate-800 leading-tight">{r.name}</span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{r.model}</td>
                    <td className="px-8 py-6">
                       <div className={cn(
                         "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                         r.type === '入库' ? "text-emerald-500" : r.type === '领用' ? "text-blue-500" : "text-rose-500"
                       )}>
                          {r.type === '入库' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                          {r.type}
                       </div>
                    </td>
                    <td className={cn(
                       "px-8 py-6 text-right font-mono font-black",
                       r.qty.startsWith('+') ? "text-emerald-600" : "text-rose-600"
                    )}>{r.qty}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{r.pos}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest">
                          <User size={12} className="text-slate-300" /> {r.user}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.time}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

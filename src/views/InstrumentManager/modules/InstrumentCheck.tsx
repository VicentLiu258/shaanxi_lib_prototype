import React from 'react';
import { motion } from 'motion/react';
import { 
  RotateCcw, 
  Download,
  AlertCircle,
  ClipboardList,
  User,
  Clock,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentCheck: React.FC = () => {
  const records = [
    { id: 'LS-240519001', executor: '管理员', type: '仪器盘点', range: '阶梯教室', total: 45, error: 0, status: '记录中', time: '2024-05-19 10:00' },
    { id: 'LS-240518002', executor: '李向东', type: '耗材盘点', range: '物理实验室', total: 120, error: 2, status: '已提交', time: '2024-05-18 15:20' },
    { id: 'LS-240517003', executor: '王美丽', type: '混合盘点', range: '生物标本室', total: 80, error: 5, status: '处理中', time: '2024-05-17 09:15' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
               <ClipboardList size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">日常随机盘点</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">On-demand & Random Inventory Checks</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                <Download size={14} /> 常常导出
             </button>
             <button className="px-8 py-3 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
                <Download size={16} /> 导出
             </button>
         </div>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">盘点范围</label>
              <input type="text" placeholder="搜索区域..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">执行人</label>
              <input type="text" placeholder="输入姓名" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">时间区间</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">盘点类型</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部类型</option>
                 <option>仪器</option>
                 <option>耗材</option>
              </select>
           </div>
           <div className="flex items-end gap-2 text-center">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">查询</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 w-10">
                     <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                  </th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">盘点单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">执行人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">类型</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">盘点范围</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">盘点总数</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center text-rose-500">异常数量</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">盘点时间</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">

               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                    </td>
                    <td className="px-4 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-teal-600 transition-colors uppercase tracking-widest">{r.id}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-300" />
                          <span className="text-xs font-black text-slate-600">{r.executor}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500">{r.type}</td>
                    <td className="px-8 py-6 text-xs font-black text-slate-700">{r.range}</td>
                    <td className="px-8 py-6 text-center font-mono font-black">{r.total}</td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex items-center justify-center gap-1 font-mono font-black text-rose-600 bg-rose-50 rounded px-2 py-0.5 w-max mx-auto">
                          {r.error > 0 && <TrendingDown size={10} />}
                          {r.error}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border",
                          r.status === '已提交' ? 'border-teal-100 text-teal-600 bg-teal-50' : 'border-slate-100 text-slate-500 bg-slate-50'
                       )}>{r.status}</span>
                    </td>
                    <td className="px-8 py-6 text-right text-[10px] font-mono font-bold text-slate-400 uppercase">{r.time}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

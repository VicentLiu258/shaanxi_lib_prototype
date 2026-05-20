import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Download,
  Calendar,
  User,
  ClipboardCheck,
  ChevronRight,
  Play,
  Trash2,
  FileText
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InventoryTask: React.FC = () => {
  const records = [
    { id: 'PD-20240519001', type: '仪器盘点', range: '物理实验室 A101', executor: '李向东', planDate: '2024-05-30', creator: '管理员', createTime: '2024-05-19', status: '进行中' },
    { id: 'PD-20240518005', type: '耗材盘点', range: '化学储藏室', executor: '王美丽', planDate: '2024-05-25', creator: '王美丽', createTime: '2024-05-18', status: '未开始' },
    { id: 'PD-20240510002', type: '全局盘点', range: '全校范围', executor: '张文明', planDate: '2024-05-15', creator: '管理员', createTime: '2024-05-10', completionTime: '2024-05-15 16:30', status: '已完成' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
               <ClipboardCheck size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">盘点计划中心</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Inventory Planning & Scheduling</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                <Download size={16} /> 导出计划
             </button>
             <button className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
                <Plus size={16} /> 新增盘点计划
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">计划日期</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold outline-none" />
                <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold outline-none" />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">任务状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部</option>
                 <option>未开始</option>
                 <option>进行中</option>
                 <option>已完成</option>
                 <option>已超时</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">盘点类型</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部类型</option>
                 <option>仪器盘点</option>
                 <option>耗材盘点</option>
                 <option>全盘</option>
              </select>
           </div>
           <div className="flex items-end gap-2 text-center">
              <button className="flex-1 h-[43px] bg-[#1B6BE5] text-white rounded-xl font-black text-xs uppercase tracking-widest">查询</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">盘点计划号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">类型</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">盘点范围</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">执行人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">计划完成日</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">盘点完成时间</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">{r.id}</td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-bold text-slate-700">{r.type}</span>
                    </td>
                    <td className="px-8 py-6 text-xs font-black text-slate-600 italic underline decoration-emerald-100 decoration-2 underline-offset-4">{r.range}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-300" />
                          <span className="text-xs font-black text-slate-600">{r.executor}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.planDate}</td>
                    <td className="px-8 py-6 text-center">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                         r.status === '已完成' ? "text-emerald-500 bg-emerald-50 border-emerald-100" :
                         r.status === '进行中' ? "text-blue-500 bg-blue-50 border-blue-100" : "text-slate-400 bg-slate-50 border-slate-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.completionTime || '--'}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="详情"><FileText size={16} /></button>
                          {r.status === '未开始' && (
                            <>
                              <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="执行"><Play size={16} /></button>
                              <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="删除"><Trash2 size={16} /></button>
                            </>
                          )}
                          {r.status === '进行中' && (
                            <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="执行"><Play size={16} /></button>
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

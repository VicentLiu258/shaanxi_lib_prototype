import React from 'react';
import { motion } from 'motion/react';
import { 
  RotateCcw, 
  Download,
  Target,
  User,
  Clock,
  ChevronRight,
  Activity,
  CheckCircle2,
  FileSearch
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InventoryTaskExecute: React.FC = () => {
  const records = [
    { id: 'PD-20240519001', type: '仪器盘点', range: '物理实验室 A101', executor: '李向东', planDate: '2024-05-30', progress: 65, creator: '管理员', createTime: '2024-05-19', status: '进行中' },
    { id: 'PD-20240518005', type: '耗材盘点', range: '化学储藏室', executor: '王美丽', planDate: '2024-05-25', progress: 0, creator: '王美丽', createTime: '2024-05-18', status: '未开始' },
    { id: 'PD-20240510002', type: '全局盘点', range: '全校范围', executor: '张文明', planDate: '2024-05-15', progress: 100, creator: '管理员', createTime: '2024-05-10', completionTime: '2024-05-15 16:30', status: '已完成' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-sky-500/20">
               <Target size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">盘点任务执行监控</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Inventory Task Execution & Progress Tracking</p>
            </div>
         </div>
         <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download size={16} /> 导出
         </button>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">盘点范围</label>
              <input type="text" placeholder="搜索区域..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">任务状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部</option>
                 <option>未开始</option>
                 <option>进行中</option>
                 <option>已完成</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">日期区间</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold w-full outline-none" />
           </div>
           <div className="flex items-end gap-2 text-center">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">查询</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {records.map((r, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               {r.status === '已完成' && (
                 <div className="absolute top-0 right-0 p-4 text-emerald-100 rotate-12 group-hover:text-emerald-200 transition-colors">
                    <CheckCircle2 size={120} />
                 </div>
               )}
               
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 uppercase tracking-widest">{r.type}</span>
                     <span className={cn(
                       "text-[10px] font-black uppercase tracking-widest",
                       r.status === '已完成' ? "text-emerald-500" : r.status === '进行中' ? "text-blue-500" : "text-slate-400"
                     )}>{r.status}</span>
                  </div>
                  
                  <div>
                     <h4 className="text-sm font-black text-slate-800 line-clamp-1">{r.range}</h4>
                     <p className="text-[10px] font-mono font-bold text-slate-400 mt-1">{r.id}</p>
                  </div>

                  <div className="space-y-1.5">
                     <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">执行进度</span>
                        <span className="text-sky-600 font-mono">{r.progress}%</span>
                     </div>
                     <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${r.progress}%` }}
                           className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              r.progress === 100 ? "bg-emerald-500" : "bg-sky-500"
                           )}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="space-y-1">
                        <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">执行人</div>
                        <div className="flex items-center gap-1.5">
                           <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{r.executor[0]}</div>
                           <span className="text-[10px] font-black text-slate-700">{r.executor}</span>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">截止日期</div>
                        <div className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
                           <Clock size={10} className="text-slate-300" /> {r.planDate}
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                     <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-sky-600 border border-sky-100 rounded-xl hover:bg-sky-50 transition-all flex items-center justify-center gap-2">
                        <Activity size={12} /> 执行
                     </button>
                     <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        <FileSearch size={12} /> 详情
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </motion.div>
  );
};

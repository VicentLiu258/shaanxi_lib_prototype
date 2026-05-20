import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Settings2,
  Trash2,
  CalendarCheck,
  MapPin,
  User,
  Plus
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentMainPlan: React.FC = () => {
  const records = [
    { status: '运行中', code: 'INS-001', sn: 'SN2024001', name: '全自动生化分析仪', model: 'AU5800', pos: '生物实验室 A1', user: '李向东', owner: '王建设' },
    { status: '闲置', code: 'INS-002', sn: 'SN2024002', name: '激光位移传感器', model: 'LK-G5000', pos: '物理实验室 B3', user: '王美丽', owner: '陈工' },
    { status: '运行中', code: 'INS-003', sn: 'SN2024003', name: '高分辨质谱仪', model: 'Orbitrap', pos: '中心测试室 101', user: '张文明', owner: '赵主任' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
               <CalendarCheck size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">仪器保养计划管理</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Instrument Routine Maintenance Planning</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
               <Settings2 size={16} /> 批量设置
            </button>
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2">
               <Plus size={16} /> 新增保养项
            </button>
         </div>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部状态</option>
                 <option>运行中</option>
                 <option>闲置</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">仪器名称 / 编号</label>
              <input type="text" placeholder="输入关键字..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">存放位置</label>
              <input type="text" placeholder="搜索科室..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="flex items-end gap-2 lg:col-span-2">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">查询资产</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">仪器状态</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">仪器编号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">标签编码</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">仪器名称</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">规格型号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">存放位置</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">使用人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase",
                         r.status === '运行中' ? "text-emerald-500 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400">{r.code}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-300 group-hover:text-amber-500 transition-colors uppercase tracking-widest">{r.sn}</td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-black text-slate-800 leading-tight block">{r.name}</span>
                    </td>
                    <td className="px-8 py-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       {r.model}
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{r.pos}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-300" />
                          <span className="text-xs font-black text-slate-600">{r.user}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors">Setup Plan</button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

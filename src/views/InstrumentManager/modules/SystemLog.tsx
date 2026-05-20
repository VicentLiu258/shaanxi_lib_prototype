import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Activity,
  User,
  Clock,
  Globe,
  Database,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const SystemLog: React.FC = () => {
  const records = [
    { user: '管理员', role: '超级管理员', org: '信息中心', type: '登录', time: '2024-05-19 14:32:10', content: '登入系统控制台' },
    { user: '李向东', role: '资产管理员', org: '物理一组', type: '数据入库', time: '2024-05-19 14:20:05', content: '完成了 RK-20240519-01 批次的入库审核' },
    { user: '王美丽', role: '普通教师', org: '生物组', type: '申请借用', time: '2024-05-19 11:15:32', content: '提交了 BR-240519002 的仪器借用申请' },
    { user: '系统进程', role: 'Daemon', org: 'Core', type: '自动备份', time: '2024-05-19 04:00:00', content: '完成了全量数据库快照备份' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
               <Activity size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">全域系统审计日志</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Security Audit & System Operation Logs</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
               <Globe size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">系统集群状态: 极佳</span>
            </div>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
               导出审计报告
            </button>
         </div>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">操作人</label>
              <input type="text" placeholder="搜索姓名..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">所属组织</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全域组织</option>
                 <option>物理科组</option>
                 <option>化学科组</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">操作类型</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部类型</option>
                 <option>登录</option>
                 <option>敏感操作</option>
                 <option>删除</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">时间范围</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold w-full outline-none" />
           </div>
           <div className="flex items-end gap-2 text-center">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">即时检索</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"><RotateCcw size={18} /></button>
           </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">操作人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">业务角色</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">所属科室</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">事件类型</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">精确时间</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">审计内容简述</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">链路状态</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {records.map((r, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-300" />
                          <span className="text-xs font-black text-slate-800">{r.user}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.role}</td>
                    <td className="px-8 py-6 text-xs font-black text-slate-600">{r.org}</td>
                    <td className="px-8 py-6">
                       <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border",
                          r.type === '敏感操作' ? "border-rose-100 text-rose-500 bg-rose-50" : "border-slate-100 text-slate-500 bg-slate-50"
                       )}>{r.type}</span>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400 italic">{r.time}</td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-bold text-slate-700 block max-w-md truncate underline decoration-slate-100 underline-offset-4">{r.content}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-1 text-emerald-500">
                          <Database size={10} />
                          <span className="text-[10px] font-black uppercase font-mono">Sync</span>
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

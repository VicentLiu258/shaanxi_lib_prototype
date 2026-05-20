import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Wrench,
  AlertTriangle,
  History,
  MoreHorizontal,
  Plus,
  Download
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentRepair: React.FC = () => {
  const records = [
    { status: '待维修', id: 'WX-240519001', user: '李向东', date: '2024-05-19', expectDate: '2024-05-22', state: '已受理', creator: '管理员' },
    { status: '维修中', id: 'WX-240516008', user: '王美丽', date: '2024-05-16', expectDate: '2024-05-20', state: '维修中', creator: '王美丽' },
    { status: '已完成', id: 'WX-240510012', user: '张文明', date: '2024-05-10', expectDate: '2024-05-12', state: '已验证', creator: '张文明' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">仪器报修管理</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Instrument Maintenance & Repair Tracking</p>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('正在导出报修记录清单...')}
              className="px-6 py-3 border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
               <Download size={16} /> 导出
            </button>
            <button 
              onClick={() => alert('进入新增报修页面：\n- 报修人（默认当前：管理员）\n- 选择报修仪器\n- 填写故障描述与加急程度')}
              className="px-8 py-3 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2"
            >
               <Wrench size={16} /> 报修
            </button>
         </div>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">审批状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none">
                 <option>全部</option>
                 <option>待处理</option>
                 <option>维修中</option>
                 <option>已完成</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">维修单号</label>
              <input type="text" placeholder="WX-XXXXXXXX" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">报修人</label>
              <input type="text" placeholder="输入姓名" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">报修日期范围</label>
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
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">维修单号</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">报修人</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">报修日期</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">期望日期</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">当前状态</th>
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
                         r.status === '已完成' ? "text-emerald-500 bg-emerald-50 border-emerald-100" :
                         r.status === '维修中' ? "text-blue-500 bg-blue-50 border-blue-100" : "text-amber-500 bg-amber-50 border-amber-100"
                       )}>
                          {r.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-black text-slate-400">{r.id}</td>
                    <td className="px-8 py-6 text-xs font-black text-slate-600">{r.user}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.date}</td>
                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">{r.expectDate}</td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{r.state}</span>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.creator}</td>
                    <td className="px-8 py-6 text-right">
                       <button className="text-xs font-black text-[#1B6BE5] uppercase tracking-widest hover:underline">详情</button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

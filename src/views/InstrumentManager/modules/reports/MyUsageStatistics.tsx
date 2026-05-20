import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  Download,
  Package,
  Wrench,
  ChevronRight,
  Clock,
  MapPin
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export const MyUsageStatistics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'instr' | 'cons'>('instr');

  const instrData = [
    { status: '已借用', id: 'INS-00124', name: '数字示波器', model: 'TBS1102B', type: '测量设备', location: '物理实验室 A102', date: '2024-05-15' },
    { status: '使用中', id: 'INS-00451', name: '万用表', model: 'Fluke 15B+', type: '测量设备', location: '物理实验室 A102', date: '2024-05-18' },
  ];

  const consData = [
    { status: '已领用', id: 'CON-0082', name: '200ml 烧杯', qty: 5, specs: '高硼硅玻璃', date: '2024-05-19' },
    { status: '已领用', id: 'CON-1120', name: '导线 (黑/红)', qty: 20, specs: '1.5mm 屏蔽', date: '2024-05-17' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-500/20">
               <UserCheck size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">个人资产负责中心</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">My Responsible Assets & Usage History</p>
            </div>
         </div>
         <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <Download size={14} /> 导出我的清单
         </button>
      </div>

      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl w-max">
         <button 
           onClick={() => setActiveTab('instr')}
           className={cn(
             "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
             activeTab === 'instr' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
           )}
         >
            <Wrench size={14} /> 仪器资产 ({instrData.length})
         </button>
         <button 
           onClick={() => setActiveTab('cons')}
           className={cn(
             "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
             activeTab === 'cons' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
           )}
         >
            <Package size={14} /> 耗材领用 ({consData.length})
         </button>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     {activeTab === 'instr' ? '资产状态' : '领用状态'}
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">编号/名称</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     {activeTab === 'instr' ? '规格型号' : '规格参数'}
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                     {activeTab === 'instr' ? '仪器分类' : '领用数量'}
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     {activeTab === 'instr' ? '存放位置' : '领用日期'}
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic">
               {activeTab === 'instr' ? (
                 instrData.map((r, i) => (
                   <tr key={i} className="hover:bg-slate-50/50 transition-colors group not-italic">
                      <td className="px-8 py-6">
                         <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-blue-100 text-blue-500 bg-blue-50">
                            {r.status}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="text-xs font-black text-slate-800">{r.name}</div>
                         <div className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">{r.id}</div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500">{r.model}</td>
                      <td className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.type}</td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <MapPin size={12} className="text-slate-300" />
                            {r.location}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] text-slate-300 mt-1">
                            <Clock size={10} /> {r.date}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="text-slate-300 hover:text-blue-600 transition-colors"><ChevronRight size={20} /></button>
                      </td>
                   </tr>
                 ))
               ) : (
                 consData.map((r, i) => (
                   <tr key={i} className="hover:bg-slate-50/50 transition-colors group not-italic">
                      <td className="px-8 py-6">
                         <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-indigo-100 text-indigo-500 bg-indigo-50">
                            {r.status}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="text-xs font-black text-slate-800">{r.name}</div>
                         <div className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">{r.id}</div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500">{r.specs}</td>
                      <td className="px-8 py-6 text-center font-mono font-black text-indigo-600">{r.qty}</td>
                      <td className="px-8 py-6 text-xs font-mono font-bold text-slate-400">{r.date}</td>
                      <td className="px-8 py-6 text-right">
                         <button className="text-slate-300 hover:text-indigo-600 transition-colors"><ChevronRight size={20} /></button>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </section>
    </motion.div>
  );
};

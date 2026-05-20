import React from 'react';
import { motion } from 'motion/react';
import { 
  Trash2, 
  Download,
  Search,
  RotateCcw,
  AlertTriangle,
  History,
  TrendingDown
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export const DisposeStatistics: React.FC = () => {
  const kpis = [
    { label: '待处置金额', val: '12.5', unit: '万元', sub: '45 件', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: '当日处置金额', val: '0.8', unit: '万元', sub: '2 件', color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: '当月处置金额', val: '4.2', unit: '万元', sub: '12 件', color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  const records = [
    { status: '待处置', id: 'INS-00824', code: 'XY-2024-001', name: '显微镜 X100', model: 'OL-200', type: '实验仪器', category: '教学设备', location: '实验楼 301', org: '生物组' },
    { status: '待处置', id: 'INS-00512', code: 'XY-2024-055', name: '酒精灯', model: 'ST-50', type: '实验仪器', category: '玻璃仪器', location: '储藏室 105', org: '化学组' },
    { status: '已处置', id: 'INS-00210', code: 'XY-2023-102', name: '离心机', model: 'CF-X1', type: '专业仪器', category: '学科专用', location: '实验楼 205', org: '生物组' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
               <Trash2 size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">仪器处置统计与汇总</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Asset Disposal Analysis & Liquidation Audit</p>
            </div>
         </div>
         <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <Download size={14} /> 导出盘盈盘亏表
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {kpis.map((k, i) => (
           <div key={i} className={cn("rounded-[32px] p-8 border border-slate-100 flex flex-col gap-4 shadow-sm", k.bg)}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{k.label}</span>
              <div className="flex items-baseline gap-2">
                 <span className={cn("text-4xl font-black tracking-tight", k.color)}>¥ {k.val}</span>
                 <span className="text-xs font-bold text-slate-400 uppercase">{k.unit}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200/50 pt-4">
                 <span className="text-xs font-black text-slate-600 uppercase">{k.sub}</span>
                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300">
                    <TrendingDown size={14} />
                 </div>
              </div>
           </div>
         ))}
      </div>

      <section className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
               <History size={16} /> 资产处罝明细清单
            </h4>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100 italic">
                  <AlertTriangle size={12} /> 待处理: 4 笔
               </div>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">仪器编号</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">标签编码</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">仪器名称</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">规格型号</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">仪器分类</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">存放位置</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">所属组织</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {records.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-8 py-6">
                          <span className={cn(
                             "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border",
                             r.status === '待处置' ? 'border-amber-100 text-amber-600 bg-amber-50' : 'border-slate-100 text-slate-400 bg-slate-50'
                          )}>{r.status}</span>
                       </td>
                       <td className="px-8 py-6 text-xs font-mono font-black text-slate-400 group-hover:text-rose-600 transition-colors uppercase tracking-widest">{r.id}</td>
                       <td className="px-8 py-6 text-xs font-mono font-bold text-slate-400">{r.code}</td>
                       <td className="px-8 py-6 text-xs font-black text-slate-800">{r.name}</td>
                       <td className="px-8 py-6 text-xs font-bold text-slate-500">{r.model}</td>
                       <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.category}</td>
                       <td className="px-8 py-6 text-xs font-bold text-slate-600 italic">{r.location}</td>
                       <td className="px-8 py-6 text-xs font-black text-slate-700 uppercase">{r.org}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Download, 
  Upload,
  Plus, 
  Eye, 
  Settings,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Database,
  CheckCircle2,
  Clock,
  Ban
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const InstrumentStorage: React.FC = () => {
  const records = [
    { status: '已审批', id: 'RK-20240519-01', type: '集中采购', user: '张文明', qty: 12, amount: 154000, date: '2024-05-19' },
    { status: '待审批', id: 'RK-20240518-04', type: '赠送入库', user: '李晓华', qty: 2, amount: 0, date: '2024-05-18' },
    { status: '审批中', id: 'RK-20240517-12', type: '调拨入库', user: '王思齐', qty: 5, amount: 24000, date: '2024-05-17' },
    { status: '已驳回', id: 'RK-20240515-08', type: '采购入库', user: '赵雷', qty: 8, amount: 45000, date: '2024-05-15' },
    { status: '审批中', id: 'RK-20240514-02', type: '科研产出', user: '孙悦', qty: 1, amount: 12000, date: '2024-05-14' },
  ];

  const statusMap = {
    '已审批': { color: 'text-emerald-500 bg-emerald-50 border-emerald-100', icon: CheckCircle2 },
    '待审批': { color: 'text-amber-500 bg-amber-50 border-amber-100', icon: Clock },
    '审批中': { color: 'text-blue-500 bg-blue-50 border-blue-100', icon: Database },
    '已驳回': { color: 'text-rose-500 bg-rose-50 border-rose-100', icon: Ban },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      {/* Action Header */}
      <div className="flex items-center justify-between mb-2">
         <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">仪器入库管理</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Instrument Warehousing & Records Management</p>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('当前筛选条件已保存为默认初始化视图')}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10"
            >
               <Database size={16} /> 保存初始化
            </button>
            <button 
              onClick={() => alert('请填写并提交仪器入库申请单')}
              className="px-6 py-2.5 bg-[#1B6BE5] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
            >
               <Plus size={16} /> 申请入库
            </button>
         </div>
      </div>

      {/* Filter Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1B6BE5] group-hover:scale-110 transition-transform">
                  <Clock size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">本月入库申请</p>
                  <h3 className="text-3xl font-black text-slate-800 font-mono italic">42 <span className="text-sm font-bold text-slate-300 not-italic uppercase ml-1">Orders</span></h3>
               </div>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
         </div>
         <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <Database size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">入库资产总额</p>
                  <h3 className="text-3xl font-black text-slate-800 font-mono italic">¥ 842.5K <span className="text-sm font-bold text-slate-300 not-italic uppercase ml-1">CNY</span></h3>
               </div>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
         </div>
      </div>

      {/* Search Bar */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center lg:text-left">审批状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/10">
                 <option>全部状态</option>
                 <option>待审批</option>
                 <option>审批中</option>
                 <option>已审批</option>
                 <option>已驳回</option>
              </select>
           </div>
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center lg:text-left">入库人</label>
              <input type="text" placeholder="输入姓名" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10" />
           </div>
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center lg:text-left">批次号 / ID</label>
              <input type="text" placeholder="RK-XXXXXXXX" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold font-mono outline-none focus:ring-2 focus:ring-blue-500/10" />
           </div>
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center lg:text-left">时间范围</label>
              <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10" />
           </div>
           <div className="flex items-end gap-2">
              <button className="flex-1 h-[43px] bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">查询</button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"><RotateCcw size={18} /></button>
           </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dashed border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <button className="px-6 py-2 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                 <Upload size={14} /> 导入
              </button>
              <button className="px-6 py-2 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                 <Download size={14} /> 导出
              </button>
           </div>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
              Use "Batch Initialization" for your first data-sync
           </p>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">审批状态</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">入库批次号</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">入库类型</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">入库申办人</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">入库数量</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">资产评估总额</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">申办日期</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {records.map((r, i) => {
                     const st = statusMap[r.status as keyof typeof statusMap];
                     return (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className={cn("px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase w-fit flex items-center gap-2", st.color)}>
                                 <st.icon size={12} />
                                 {r.status}
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-xs font-black font-mono text-slate-400 group-hover:text-blue-600 transition-colors">{r.id}</span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                 <span className="text-xs font-bold text-slate-700">{r.type}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-xs font-black text-slate-600">{r.user}</span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <span className="text-sm font-black font-mono">{r.qty}</span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <span className="text-sm font-black font-mono text-[#1B6BE5]">¥ {r.amount.toLocaleString()}</span>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-[10px] font-mono font-bold text-slate-400">{r.date}</span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="px-4 py-1.5 bg-slate-100 text-slate-800 text-[10px] font-black rounded-lg hover:bg-[#1B6BE5] hover:text-white transition-all uppercase tracking-widest">查看明细</button>
                                 <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"><MoreHorizontal size={16} /></button>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </section>
    </motion.div>
  );
};

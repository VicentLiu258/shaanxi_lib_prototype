import React from 'react';
import { 
  Search, 
  RotateCcw, 
  Upload, 
  ChevronLeft, 
  ChevronRight,
  ClipboardList,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const MOCK_PLANS = [
  { id: '1', year: '2023-2024', semester: '第一学期', grade: '高一', subject: '物理', count: 12, creator: '管理员', status: '进行中' },
  { id: '2', year: '2023-2024', semester: '第一学期', grade: '高一', subject: '化学', count: 15, creator: '管理员', status: '进行中' },
  { id: '3', year: '2023-2024', semester: '第一学期', grade: '高一', subject: '生物', count: 10, creator: '管理员', status: '进行中' },
  { id: '4', year: '2023-2024', semester: '第二学期', grade: '高二', subject: '物理', count: 8, creator: '管理员', status: '未开始' },
];

export const PilotProgram: React.FC = () => {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-full">
      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList size={18} className="text-blue-600" />
          <h3 className="font-black text-sm uppercase tracking-tight">实验教学计划管理</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">学年/学期</label>
              <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                 <option>2023-2024学年 | 第二学期</option>
                 <option>2023-2024学年 | 第一学期</option>
              </select>
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">年级</label>
              <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                 <option>全部年级</option>
                 <option>高一</option>
                 <option>高二</option>
                 <option>高三</option>
              </select>
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">学科</label>
              <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                 <option>全部学科</option>
                 <option>物理</option>
                 <option>化学</option>
                 <option>生物</option>
              </select>
           </div>
           <div className="flex items-end gap-2">
              <button className="flex-1 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                 <Search size={14} />
                 <span>查询计划</span>
              </button>
              <button className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-all">
                <RotateCcw size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
            <Filter size={14} className="text-blue-500" />
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">当前处于 2023-2024 第二学期 计划周期</span>
         </div>
         <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white font-bold text-xs rounded-lg hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20">
               <Upload size={14} />
               <span>导入外部计划</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20">
               <ClipboardList size={14} />
               <span>新增教学计划</span>
            </button>
         </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] text-slate-400 border-b border-slate-100">
               <tr>
                 <th className="px-6 py-4 font-black uppercase tracking-widest">学年度</th>
                 <th className="px-6 py-4 font-black uppercase tracking-widest">学期</th>
                 <th className="px-6 py-4 font-black uppercase tracking-widest">年级</th>
                 <th className="px-6 py-4 font-black uppercase tracking-widest">学科</th>
                 <th className="px-6 py-4 font-black uppercase tracking-widest">实验总数</th>
                 <th className="px-6 py-4 font-black uppercase tracking-widest">状态</th>
                 <th className="px-6 py-4 font-black uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_PLANS.map(plan => (
                 <tr key={plan.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-500">{plan.year}</td>
                    <td className="px-6 py-4 text-slate-500">{plan.semester}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{plan.grade}</td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-bold">{plan.subject}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">{plan.count}</td>
                    <td className="px-6 py-4">
                       <span className={cn(
                         "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest",
                         plan.status === '进行中' ? "text-emerald-500" : "text-slate-400"
                       )}>
                         <div className={cn("w-1.5 h-1.5 rounded-full", plan.status === '进行中' ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                         {plan.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1">
                          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14} /></button>
                          <button className="p-2 text-slate-300 hover:text-slate-700 transition-colors"><MoreVertical size={14} /></button>
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"><Trash2 size={14} /></button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

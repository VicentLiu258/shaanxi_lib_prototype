import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  AlertTriangle, 
  Settings, 
  BarChart2, 
  FileSearch,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const MOCK_TEACHER_DATA = [
  { name: '张平', count: 12, rate: 100 },
  { name: '李华', count: 8, rate: 80 },
  { name: '王芳', count: 15, rate: 93 },
  { name: '周敏', count: 10, rate: 100 },
  { name: '赵丽', count: 6, rate: 75 },
];

export const TeacherOpenStatistics: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);

  if (!isConfigured) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-8">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-8 animate-bounce">
           <AlertTriangle size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight uppercase">未配置调调！</h2>
        <p className="text-slate-400 font-medium text-center max-w-md mb-8">
          需要先在系统管理中配置学科、教师、实验室关联等基础支撑数据后，系统才能自动汇算教师开课绩效统计图表。
        </p>
        <button 
          onClick={() => setIsConfigured(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 transition-all uppercase tracking-widest"
        >
          <Settings size={18} />
          <span>前往配置基础数据</span>
        </button>
        <p className="mt-4 text-[10px] text-slate-300 font-mono">STATUS_CODE: CONFIG_REQUIRED_FETCH_ERR</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <BarChart2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">教师实验开出率统计</h2>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Teacher Performance Analytics</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400">时间周期:</span>
              <span className="text-xs font-black text-slate-800">2023-2024 第二学期</span>
              <ChevronDown size={14} className="text-slate-400" />
           </div>
           <button className="px-6 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 transition-all shadow-sm">导出报告</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
         <div className="col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-2">
               <div className="w-1 h-4 bg-blue-600 rounded-full" />
               教师实验开出次数 (Top 5)
            </h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_TEACHER_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-2">
               <div className="w-1 h-4 bg-emerald-500 rounded-full" />
               计划完成率分布
            </h3>
            <div className="flex-1 min-h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_TEACHER_DATA}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {MOCK_TEACHER_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-4">
               {MOCK_TEACHER_DATA.map((item, idx) => (
                 <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}} />
                       <span className="text-xs font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-blue-600">{item.rate}%</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">详细教师分析表</h4>
            <div className="flex bg-slate-100 p-1 rounded-lg">
               <button className="px-4 py-1.5 bg-white rounded-md text-[10px] font-black uppercase text-blue-600 shadow-sm">列表模式</button>
               <button className="px-4 py-1.5 rounded-md text-[10px] font-black uppercase text-slate-400">对比模式</button>
            </div>
         </div>
         <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-slate-400 uppercase">
               <tr>
                  <th className="px-8 py-4 font-black tracking-widest">教师姓名</th>
                  <th className="px-8 py-4 font-black tracking-widest">所属学科</th>
                  <th className="px-8 py-4 font-black tracking-widest">应开实验数</th>
                  <th className="px-8 py-4 font-black tracking-widest">实开实验数</th>
                  <th className="px-8 py-4 font-black tracking-widest">完成率</th>
                  <th className="px-8 py-4 font-black tracking-widest text-right">变动趋势</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_TEACHER_DATA.map(item => (
                 <tr key={item.name} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-4 font-bold text-slate-700">{item.name}</td>
                    <td className="px-8 py-4 text-slate-500 font-medium whitespace-nowrap">实验物理/力学组</td>
                    <td className="px-8 py-4 text-slate-500 font-mono font-bold">20</td>
                    <td className="px-8 py-4">
                       <span className="text-blue-600 font-mono font-black">{item.count}</span>
                    </td>
                    <td className="px-8 py-4">
                       <div className="w-full max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{width: `${item.rate}%`}} />
                       </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                       <span className="text-emerald-500 font-bold ml-auto">+2.4%</span>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

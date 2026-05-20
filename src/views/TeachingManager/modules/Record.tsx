import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Calendar
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const MOCK_RECORDS = [
  { id: '1', name: '探究影响电荷间相互作用的因素', place: '物理实验室1', subject: '物理', class: '高一(3)班', teacher: '张平', applicant: '张平', time: '2024-03-05 10:00', registerTime: '2024-03-01 09:30', status: '已通过' },
  { id: '2', name: '植物细胞的吸水和失水', place: '生物实验室2', subject: '生物', class: '高一(1)班', teacher: '李华', applicant: '李华', time: '2024-03-06 14:30', registerTime: '2024-03-02 11:15', status: '待审核' },
  { id: '3', name: '验证机械能守恒定律', place: '物理实验室1', subject: '物理', class: '高一(3)班', teacher: '张平', applicant: '张平', time: '2024-03-07 09:00', registerTime: '2024-03-02 15:45', status: '已通过' },
  { id: '4', name: '配制一定物质的量浓度的溶液', place: '化学实验室1', subject: '化学', class: '高一(5)班', teacher: '王芳', applicant: '王芳', time: '2024-03-08 10:00', registerTime: '2024-03-03 08:20', status: '已拒绝' },
];

export const Record: React.FC = () => {
  const [filters, setFilters] = useState({
    name: '',
    class: '',
    applicant: '',
    teacher: '',
    time: ['', ''],
    registerTime: ['', ''],
    place: '',
    subject: '',
    status: ''
  });

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-full">
      {/* Search Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Filter size={18} className="text-blue-600" />
          <h3 className="font-black text-sm uppercase tracking-tight">实验预约记录查询</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">实验名称</label>
            <input 
              type="text" 
              placeholder="请输入实验名称"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">班级名称</label>
            <input 
              type="text" 
              placeholder="请输入班级名称"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">预约人</label>
            <input 
              type="text" 
              placeholder="请输入预约人"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">实验教师</label>
            <input 
              type="text" 
              placeholder="请输入教师姓名"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1 lg:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">预约时间范围</label>
            <div className="flex items-center gap-2">
               <input type="date" className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500" />
               <span className="text-slate-300">至</span>
               <input type="date" className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">开课地点</label>
            <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
               <option value="">全部</option>
               <option value="1">物理实验室1</option>
               <option value="2">生物实验室1</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">状态</label>
            <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
               <option value="">全部</option>
               <option value="1">待审核</option>
               <option value="2">已通过</option>
               <option value="3">已拒绝</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg text-slate-500 font-bold text-xs hover:bg-slate-100 transition-all">
            <RotateCcw size={16} />
            <span>清空条件</span>
          </button>
          <button className="flex items-center gap-2 px-8 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all">
            <Search size={16} />
            <span>立即查询</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all ml-auto">
            <Download size={16} />
            <span>导出记录</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#f8fafc] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-black uppercase tracking-widest">实验名称</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest">开课地点</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest">学科</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest">班级</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest">教师</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest">预约人</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest">预约时间</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest">状态</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RECORDS.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-700">{record.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{record.place}</td>
                  <td className="px-6 py-4 text-slate-500">{record.subject}</td>
                  <td className="px-6 py-4 text-slate-500">{record.class}</td>
                  <td className="px-6 py-4 text-slate-500">{record.teacher}</td>
                  <td className="px-6 py-4 text-slate-500">{record.applicant}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Calendar size={12} className="text-slate-300" />
                        <span>{record.time}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                      record.status === '已通过' ? "bg-emerald-100 text-emerald-600" : 
                      record.status === '已拒绝' ? "bg-red-100 text-red-600" : 
                      "bg-amber-100 text-amber-600"
                    )}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="查看详情"><Eye size={14} /></button>
                       {record.status === '待审核' && (
                         <>
                           <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="通过"><CheckCircle size={14} /></button>
                           <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="拒绝"><XCircle size={14} /></button>
                         </>
                       )}
                       <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="删除"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Showing 1-10 of 124 Results</span>
           <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30"><ChevronLeft size={16} /></button>
              <div className="flex items-center gap-1">
                 <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20">1</button>
                 <button className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-bold transition-all">2</button>
                 <button className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-bold transition-all">3</button>
                 <span className="px-2 text-slate-300">...</span>
                 <button className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-bold transition-all">13</button>
              </div>
              <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronRight size={16} /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

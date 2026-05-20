import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Download, 
  Upload,
  Plus, 
  Eye, 
  Edit3, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface InstrumentItem {
  id: string;
  code: string;
  name: string;
  spec: string;
  dept: string;
  location: string;
  status: '闲置' | '使用中' | '维修中' | '待处置';
  date: string;
}

const mockData: InstrumentItem[] = [
  { id: '1', code: 'INS-00124', name: '智能数字示波器', spec: 'TDS-2000C', dept: '物理实验室', location: 'A-204 架位 01', status: '闲置', date: '2023-12-01' },
  { id: '2', code: 'INS-00125', name: '高倍率电子显微镜', spec: 'OP-500X', dept: '生物中心', location: 'B-102 架位 03', status: '使用中', date: '2023-10-15' },
  { id: '3', code: 'INS-00126', name: '精密电子天平', spec: 'BT-224N', dept: '化学实验室', location: 'C-301 储柜 A', status: '闲置', date: '2024-01-20' },
  { id: '4', code: 'INS-00127', name: '离心机 (5000rpm)', spec: 'LC-04C', dept: '化学实验室', location: 'C-301 储柜 B', status: '维修中', date: '2023-11-22' },
  { id: '5', code: 'INS-00128', name: '恒温培养箱', spec: 'SPX-150', dept: '生物中心', location: 'B-105 温室区', status: '使用中', date: '2023-09-05' },
  { id: '6', code: 'INS-00129', name: '紫外分光光度计', spec: 'UV-1800', dept: '物理实验室', location: 'A-208 暗室', status: '闲置', date: '2024-02-11' },
  { id: '7', code: 'INS-00130', name: '超声波清洗机', spec: 'KQ-500DB', dept: '现代教育中心', location: 'E-101 仓库', status: '待处置', date: '2022-05-15' },
  { id: '8', code: 'INS-00131', name: '马弗炉', spec: 'SX2-10-12', dept: '物理实验室', location: 'A-102 加热室', status: '使用中', date: '2023-12-28' },
];

export const InstrumentList: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [nameTerm, setNameTerm] = useState('');
  const [specTerm, setSpecTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('全部部门');
  const [statusFilter, setStatusFilter] = useState('全部状态');
  const [filteredData, setFilteredData] = useState<InstrumentItem[]>(mockData);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSearch = () => {
    const filtered = mockData.filter(item => {
      const matchName = item.name.toLowerCase().includes(nameTerm.toLowerCase());
      const matchSpec = item.spec.toLowerCase().includes(specTerm.toLowerCase());
      const matchDept = deptFilter === '全部部门' || item.dept === deptFilter;
      const matchStatus = statusFilter === '全部状态' || item.status === statusFilter;
      return matchName && matchSpec && matchDept && matchStatus;
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setNameTerm('');
    setSpecTerm('');
    setDeptFilter('全部部门');
    setStatusFilter('全部状态');
    setFilteredData(mockData);
  };

  const handleBulkDelete = () => {
    if (confirm(`确认删除选中的 ${selected.length} 台仪器档案吗？此操作不可逆。`)) {
      setFilteredData(prev => prev.filter(item => !selected.includes(item.id)));
      setSelected([]);
    }
  };

  const statusColors = {
    '闲置': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    '使用中': 'bg-blue-50 text-blue-600 border-blue-100',
    '维修中': 'bg-amber-50 text-amber-600 border-amber-100',
    '待处置': 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      {/* 搜索栏 */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
           <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">仪器名称</label>
              <input 
                type="text" 
                placeholder="输入名称关键字" 
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                value={nameTerm}
                onChange={(e) => setNameTerm(e.target.value)}
              />
           </div>
           <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">规格型号</label>
              <input 
                type="text" 
                placeholder="输入型号" 
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                value={specTerm}
                onChange={(e) => setSpecTerm(e.target.value)}
              />
           </div>
           
           {showMoreFilters && (
             <>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">所属部门</label>
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                  >
                     <option>全部部门</option>
                     <option>物理实验室</option>
                     <option>化学实验室</option>
                     <option>生物中心</option>
                  </select>
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">设备状态</label>
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                     <option>全部状态</option>
                     <option>闲置</option>
                     <option>使用中</option>
                     <option>维修中</option>
                     <option>待处置</option>
                  </select>
               </div>
             </>
           )}
           
           <div className={cn("flex items-end gap-2", !showMoreFilters && "lg:col-span-2 xl:col-span-3")}>
              <button 
                onClick={handleSearch}
                className="flex-1 px-4 py-2 bg-[#1B6BE5] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                查询
              </button>
              <button 
                onClick={handleReset}
                className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
              >
                <RotateCcw size={18} />
              </button>
           </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-50 text-[#1B6BE5] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center gap-2">
                 <Plus size={14} /> 录入
              </button>
              <button className="px-4 py-2 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 border border-slate-200">
                 <Upload size={14} /> 导入
              </button>
              <button className="px-4 py-2 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 border border-slate-200">
                 <Download size={14} /> 导出
              </button>
              <button 
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border ${showMoreFilters ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-500 border-slate-200 hover:bg-slate-50'}`}
              >
                <Filter size={14} /> 更多筛选
              </button>
           </div>
           {selected.length > 0 && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-4 bg-slate-900 text-white px-4 py-2 rounded-xl"
             >
                <span className="text-[10px] font-black uppercase tracking-widest">已选择 {selected.length} 项</span>
                <div className="h-4 w-px bg-white/20" />
                <button onClick={() => alert(`正在为已选的 ${selected.length} 台仪器办理借用申请...`)} className="text-[10px] font-black text-emerald-400 uppercase hover:text-emerald-300">借取</button>
                <button onClick={() => confirm(`确定批量删除已选的 ${selected.length} 台仪器？操作不可逆`)} className="text-[10px] font-black text-red-400 uppercase hover:text-red-300">删除</button>
                <button onClick={() => alert(`正在将已选的 ${selected.length} 台仪器标记为待处置...`)} className="text-[10px] font-black text-blue-400 uppercase hover:text-blue-300">待处置</button>
                <button onClick={() => alert(`正在为已选的 ${selected.length} 台仪器生成并打印标签贴码...`)} className="text-[10px] font-black text-amber-400 uppercase hover:text-amber-300">标签打印</button>
             </motion.div>
           )}
        </div>
      </section>

      {/* 表格区 */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                     <th className="px-6 py-4 w-10">
                        <button onClick={() => setSelected(selected.length === filteredData.length && filteredData.length > 0 ? [] : filteredData.map(d => d.id))}>
                           {selected.length === filteredData.length && filteredData.length > 0 ? <CheckSquare size={18} className="text-[#1B6BE5]" /> : <Square size={18} className="text-slate-300" />}
                        </button>
                     </th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">仪器编号</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">仪器名称</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">规格型号</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">所属部门</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">存放位置</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-center">当前状态</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">购置日期</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item) => (
                     <tr key={item.id} className={cn("hover:bg-slate-50/50 transition-colors group", selected.includes(item.id) && "bg-blue-50/30")}>
                        <td className="px-6 py-5">
                           <button onClick={() => toggleSelect(item.id)}>
                              {selected.includes(item.id) ? <CheckSquare size={18} className="text-[#1B6BE5]" /> : <Square size={18} className="text-slate-300" />}
                           </button>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                           <span className="text-xs font-black font-mono text-slate-400 group-hover:text-blue-600">{item.code}</span>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-sm font-bold text-slate-800">{item.name}</span>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-xs font-bold text-slate-500">{item.spec}</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              <span className="text-xs font-bold text-slate-600">{item.dept}</span>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-xs font-medium text-slate-400">{item.location}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <span className={cn("px-2 py-0.5 rounded text-[10px] font-black border tracking-widest uppercase", statusColors[item.status])}>
                              {item.status}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-xs font-mono font-bold text-slate-400">{item.date}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-1">
                              <button className="px-3 py-1 text-xs font-black text-[#1B6BE5] hover:bg-blue-50 rounded transition-all">查看</button>
                              <button className="px-3 py-1 text-xs font-black text-slate-400 hover:text-slate-800 transition-all">编辑</button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* 分页器 */}
         <div className="h-16 border-t border-slate-200 px-8 flex items-center justify-between bg-slate-50/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected {selected.length} | Total 1,248 Items Found</span>
            <div className="flex items-center gap-1">
               <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30" disabled>
                  <ChevronLeft size={18} />
               </button>
               {[1, 2, 3].map(p => (
                  <button key={p} className={cn(
                     "w-8 h-8 rounded-lg text-[10px] font-black uppercase transition-all",
                     p === 1 ? "bg-[#1B6BE5] text-white" : "text-slate-500 hover:bg-slate-100"
                  )}>
                     {p}
                  </button>
               ))}
               <span className="px-2 text-slate-300">...</span>
               <button className="w-8 h-8 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100">125</button>
               <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                  <ChevronRight size={18} />
               </button>
            </div>
         </div>
      </section>
    </motion.div>
  );
};

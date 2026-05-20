import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Upload, 
  ChevronLeft, 
  ChevronRight,
  FolderTree,
  Edit,
  Trash2,
  FileText,
  X,
  Minus,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';

const MOCK_EXPERIMENTS = [
  { id: '1', name: '探究影响电荷间相互作用的因素', type: '分组实验', subject: '物理', time: '2024-01-15' },
  { id: '2', name: '验证机械能守恒定律', type: '分组实验', subject: '物理', time: '2024-01-16' },
  { id: '3', name: '植物细胞的吸水和失水', type: '演示实验', subject: '生物', time: '2024-01-20' },
  { id: '4', name: '酸碱中和滴定', type: '分组实验', subject: '化学', time: '2024-02-05' },
];

export const LibraryManage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instruments, setInstruments] = useState([
    { id: '1', name: '感应起电机', unit: '台', count: 1 }
  ]);
  const [consumables, setConsumables] = useState([
    { id: '1', name: '导线', unit: '根', count: 5 }
  ]);

  const addRow = (type: 'instr' | 'cons') => {
    if (type === 'instr') {
      setInstruments([...instruments, { id: Date.now().toString(), name: '', unit: '', count: 1 }]);
    } else {
      setConsumables([...consumables, { id: Date.now().toString(), name: '', unit: '', count: 1 }]);
    }
  };

  const removeRow = (id: string, type: 'instr' | 'cons') => {
    if (type === 'instr') {
      setInstruments(instruments.filter(i => i.id !== id));
    } else {
      setConsumables(consumables.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-full">
      {/* Search Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-400 whitespace-nowrap">实验名称</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="实验名称" className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-400 whitespace-nowrap">实验类型</label>
            <select className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 min-w-32">
               <option value="">全部</option>
               <option>分组实验</option>
               <option>演示实验</option>
            </select>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
             <Search size={14} />
             <span>查询</span>
          </button>
          <button className="px-6 py-2 bg-slate-100 text-slate-500 font-bold text-xs rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2">
             <RotateCcw size={14} />
             <span>重置</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-2 bg-emerald-500 text-white font-bold text-xs rounded-lg hover:bg-emerald-600 transition-all flex items-center gap-2">
             <Upload size={14} />
             <span>批量导入</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
          >
             <Plus size={14} />
             <span>新建实验</span>
          </button>
        </div>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] text-slate-400 border-b border-slate-100">
               <tr>
                 <th className="px-6 py-4 font-black uppercase tracking-widest">实验名称</th>
                 <th className="px-6 py-4 font-black uppercase tracking-widest">实验类型</th>
                 <th className="px-6 py-4 font-black uppercase tracking-widest">实验学科</th>
                 <th className="px-6 py-4 font-black uppercase tracking-widest">创建时间</th>
                 <th className="px-6 py-4 font-black uppercase tracking-widest text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_EXPERIMENTS.map(exp => (
                 <tr key={exp.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-700">{exp.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded font-bold uppercase tracking-wider text-[10px]">
                        {exp.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{exp.subject}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{exp.time}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14} /></button>
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
          <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-4">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mr-auto">Standard XY v4.2 Library Module</span>
             <button className="p-2 border rounded-lg text-slate-400"><ChevronLeft size={16} /></button>
             <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs">1</button>
             <button className="p-2 border rounded-lg text-slate-400"><ChevronRight size={16} /></button>
          </div>
      </div>

      {/* New Experiment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-blue-600">
                 <div className="flex items-center gap-2 font-black uppercase tracking-tight">
                    <FolderTree size={20} />
                    <span>新建实验库记录</span>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="hover:bg-slate-100 p-1 rounded transition-colors text-slate-400"><X size={20} /></button>
              </header>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                 <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1 col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">实验名称 *</label>
                       <input type="text" placeholder="输入实验项目名称" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">实验指南</label>
                       <button className="w-full p-2 bg-slate-100 border-2 border-dashed border-slate-200 rounded-lg text-xs flex items-center justify-center gap-2 text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-all font-bold">
                          <Upload size={14} />
                          上传指南
                       </button>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">实验类型 *</label>
                       <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                          <option>分段实验</option>
                          <option>演示实验</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">实验学科 *</label>
                       <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                          <option>物理</option>
                          <option>基础综合</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-6">
                    {/* Instruments Sub-table */}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-tight">
                            <Briefcase size={16} className="text-blue-500" />
                            <span>所需仪器设备</span>
                          </div>
                          <button onClick={() => addRow('instr')} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">+ 添加物品</button>
                       </div>
                       <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                          <table className="w-full text-xs text-left">
                             <thead className="bg-[#f8fafc] text-slate-400">
                                <tr>
                                   <th className="px-4 py-3 font-black uppercase tracking-widest">物品信息 (仪器)</th>
                                   <th className="px-4 py-3 font-black uppercase tracking-widest w-32">计量单位</th>
                                   <th className="px-4 py-3 font-black uppercase tracking-widest w-40">数量</th>
                                   <th className="px-4 py-3 font-black uppercase tracking-widest w-16"></th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                {instruments.map((row, idx) => (
                                  <tr key={row.id}>
                                     <td className="px-4 py-3">
                                        <select className="w-full p-1.5 bg-transparent outline-none focus:ring-1 ring-blue-500 rounded border border-transparent hover:border-slate-200">
                                           <option value="">选择仪器...</option>
                                           <option>感应起电机</option>
                                           <option>物理演示架</option>
                                        </select>
                                     </td>
                                     <td className="px-4 py-3">
                                        <input type="text" defaultValue={row.unit} placeholder="单位" className="w-full p-1.5 bg-transparent outline-none focus:ring-1 ring-blue-500 rounded border border-transparent hover:border-slate-200" />
                                     </td>
                                     <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                           <button onClick={() => setInstruments(instruments.map(r => r.id === row.id ? {...r, count: Math.max(1, r.count-1)} : r))} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold font-mono">-</button>
                                           <input type="number" value={row.count} className="w-12 text-center bg-transparent font-bold" readOnly />
                                           <button onClick={() => setInstruments(instruments.map(r => r.id === row.id ? {...r, count: r.count+1} : r))} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold font-mono">+</button>
                                        </div>
                                     </td>
                                     <td className="px-4 py-3 text-right">
                                        <button onClick={() => removeRow(row.id, 'instr')} className="text-red-400 hover:text-red-600 transition-colors"><Minus size={14} /></button>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>

                    {/* Consumables Sub-table */}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-tight">
                            <Plus size={16} className="text-emerald-500" />
                            <span>所需耗材用品</span>
                          </div>
                          <button onClick={() => addRow('cons')} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">+ 添加耗材</button>
                       </div>
                       <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                          <table className="w-full text-xs text-left">
                             <thead className="bg-[#f8fafc] text-slate-400">
                                <tr>
                                   <th className="px-4 py-3 font-black uppercase tracking-widest">物品信息 (耗材)</th>
                                   <th className="px-4 py-3 font-black uppercase tracking-widest w-32">计量单位</th>
                                   <th className="px-4 py-3 font-black uppercase tracking-widest w-40">数量</th>
                                   <th className="px-4 py-3 font-black uppercase tracking-widest w-16"></th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                {consumables.map((row, idx) => (
                                  <tr key={row.id}>
                                     <td className="px-4 py-3">
                                        <select className="w-full p-1.5 bg-transparent outline-none focus:ring-1 ring-emerald-500 rounded border border-transparent hover:border-slate-200">
                                           <option value="">选择耗材...</option>
                                           <option>导线</option>
                                           <option>石蕊试纸</option>
                                        </select>
                                     </td>
                                     <td className="px-4 py-3">
                                        <input type="text" defaultValue={row.unit} placeholder="单位" className="w-full p-1.5 bg-transparent outline-none focus:ring-1 ring-emerald-500 rounded border border-transparent hover:border-slate-200" />
                                     </td>
                                     <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                           <button onClick={() => setConsumables(consumables.map(r => r.id === row.id ? {...r, count: Math.max(1, r.count-1)} : r))} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold font-mono">-</button>
                                           <input type="number" value={row.count} className="w-12 text-center bg-transparent font-bold" readOnly />
                                           <button onClick={() => setConsumables(consumables.map(r => r.id === row.id ? {...r, count: r.count+1} : r))} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold font-mono">+</button>
                                        </div>
                                     </td>
                                     <td className="px-4 py-3 text-right">
                                        <button onClick={() => removeRow(row.id, 'cons')} className="text-red-400 hover:text-red-600 transition-colors"><Minus size={14} /></button>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </div>
              </div>

              <footer className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                 <button onClick={() => setIsModalOpen(false)} className="px-8 py-2 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100 transition-all uppercase tracking-widest">取消</button>
                 <button onClick={() => setIsModalOpen(false)} className="px-10 py-2 rounded-xl bg-blue-600 text-white font-black text-xs shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all uppercase tracking-[0.2em]">提交入库</button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

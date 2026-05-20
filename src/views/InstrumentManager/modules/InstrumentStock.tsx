import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Download, 
  Plus, 
  Eye, 
  Edit3, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Wallet,
  Boxes
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface StockData {
  id: string;
  code: string;
  name: string;
  spec: string;
  price: number;
  value: number;
  qty: number;
  amount: number;
}

const mockStock: StockData[] = [
  { id: '1', code: 'XY-INST-001', name: '智能数字示波器', spec: 'TDS-2000C', price: 4500, value: 4200, qty: 10, amount: 45000 },
  { id: '2', code: 'XY-INST-002', name: '高倍率电子显微镜', spec: 'OP-500X', price: 12000, value: 11500, qty: 5, amount: 60000 },
  { id: '3', code: 'XY-INST-003', name: '化学分析热导池', spec: 'GC-2014', price: 8500, value: 8000, qty: 2, amount: 17000 },
  { id: '4', code: 'XY-INST-004', name: '离心机 (5000rpm)', spec: 'LC-04C', price: 2800, value: 2500, qty: 8, amount: 22400 },
  { id: '5', code: 'XY-INST-005', name: '精密电子天平 (0.1mg)', spec: 'BT-224N', price: 3500, value: 3200, qty: 12, amount: 42000 },
  { id: '6', code: 'XY-INST-006', name: '恒温培养箱', spec: 'SPX-150', price: 5200, value: 4800, qty: 4, amount: 20800 },
  { id: '7', code: 'XY-INST-007', name: '紫外分光光度计', spec: 'UV-1800', price: 15000, value: 14200, qty: 2, amount: 30000 },
  { id: '8', code: 'XY-INST-008', name: '移液枪套装 (8道)', spec: 'PX-1200', price: 1800, value: 1500, qty: 20, amount: 36000 },
  { id: '9', code: 'XY-INST-009', name: '马弗炉 (1200℃)', spec: 'SX2-10-12', price: 7800, value: 7200, qty: 3, amount: 23400 },
  { id: '10', code: 'XY-INST-010', name: '超声波清洗机', spec: 'KQ-500DB', price: 2200, value: 2000, qty: 6, amount: 13200 },
];

export const InstrumentStock: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specTerm, setSpecTerm] = useState('');
  const [filteredStock, setFilteredStock] = useState<StockData[]>(mockStock);

  const handleSearch = () => {
    const filtered = mockStock.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.spec.toLowerCase().includes(specTerm.toLowerCase())
    );
    setFilteredStock(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSpecTerm('');
    setFilteredStock(mockStock);
  };

  const handleExport = () => {
    alert('正在生成库存报表 Excel 文件...');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      {/* 搜索栏 */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex-1 min-w-[240px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索仪器名称..." 
                className="bg-transparent border-none outline-none text-sm font-medium w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
           </div>
           <div className="flex-1 min-w-[200px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <input 
                type="text" 
                placeholder="规格型号" 
                className="bg-transparent border-none outline-none text-sm font-medium w-full" 
                value={specTerm}
                onChange={(e) => setSpecTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
           </div>
           
           <div className="flex items-center gap-2">
              <button 
                onClick={handleSearch}
                className="px-6 py-2 bg-[#1B6BE5] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                 <Search size={14} /> 查询
              </button>
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-slate-100 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                 <RotateCcw size={14} /> 清空
              </button>
              <button 
                onClick={handleExport}
                className="px-4 py-2 text-[#1B6BE5] font-black text-xs uppercase tracking-widest hover:bg-blue-50 rounded-xl transition-all flex items-center gap-2 border border-blue-100"
              >
                 <Download size={14} /> 导出
              </button>
           </div>
        </div>
      </section>

      {/* 汇总信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="pro-card p-6 bg-gradient-to-br from-[#1B6BE5] to-[#1E40AF] text-white flex items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
               <Wallet size={120} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Inventory Total Amount</p>
               <h2 className="text-4xl font-black font-mono tracking-tighter">¥ 310,000.00</h2>
               <div className="flex items-center gap-2 mt-4 text-[10px] font-bold bg-white/10 px-2 py-1 rounded w-fit">
                  <TrendingUp size={12} /> 比上月增长 12.5%
               </div>
            </div>
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
               <Wallet size={24} />
            </div>
         </div>
         <div className="pro-card p-6 flex items-center justify-between border-slate-200 shadow-sm">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Total Units in Stock</p>
               <h2 className="text-4xl font-black font-mono tracking-tighter text-slate-800">82 <span className="text-lg text-slate-400 font-bold ml-1 uppercase">PCS</span></h2>
               <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded w-fit">
                  <TrendingDown size={12} /> 状态正常：100%
               </div>
            </div>
            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1B6BE5]">
               <Boxes size={24} />
            </div>
         </div>
      </div>

      {/* 表格区 */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">仪器总号 / ID</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">仪器名称</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">规格型号</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">采购单价</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">实存价值</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">库存数量</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">库存总额</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredStock.map((item) => (
                     <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                           <span className="text-xs font-black font-mono text-slate-400 group-hover:text-blue-600">{item.code}</span>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-sm font-bold text-slate-800">{item.name}</span>
                        </td>
                        <td className="px-6 py-5">
                           <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">{item.spec}</span>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-xs font-bold text-slate-600">¥ {item.price.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <span className="text-xs font-black text-emerald-600">¥ {item.value.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <span className="text-sm font-black font-mono">{item.qty}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <span className="text-sm font-black text-[#1B6BE5] font-mono">¥ {item.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="查看明细">
                                 <Eye size={16} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="编辑信息">
                                 <Edit3 size={16} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="更多操作">
                                 <MoreHorizontal size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* 分页器 */}
         <div className="h-16 border-t border-slate-200 px-8 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 1 to 10 of 42 entries</span>
            <div className="flex items-center gap-1">
               <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30" disabled>
                  <ChevronLeft size={18} />
               </button>
               {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} className={cn(
                     "w-8 h-8 rounded-lg text-[10px] font-black uppercase transition-all",
                     p === 1 ? "bg-[#1B6BE5] text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:bg-slate-100"
                  )}>
                     {p}
                  </button>
               ))}
               <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                  <ChevronRight size={18} />
               </button>
            </div>
         </div>
      </section>
    </motion.div>
  );
};
